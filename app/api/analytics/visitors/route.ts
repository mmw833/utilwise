import { NextResponse } from "next/server";
import { getCloudflareAnalyticsConfig } from "@/lib/blog/db";
import { getBlogVisitorStats } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

let cloudflareCache: { today: number; expiresAt: number } | null = null;

type CloudflareAnalyticsResponse = {
  data?: {
    viewer?: {
      zones?: Array<{
        httpRequests1hGroups?: Array<{
          sum?: { pageViews?: number; requests?: number };
          uniq?: { uniques?: number };
        }>;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

function koreaDayStart(now: Date): Date {
  const timestamp = Math.floor((now.getTime() / 1000 + 9 * 60 * 60) / 86400) * 86400 - 9 * 60 * 60;
  return new Date(timestamp * 1000);
}

export async function GET() {
  try {
    const localStats = await getBlogVisitorStats();
    const config = getCloudflareAnalyticsConfig();

    if (!config) {
      return NextResponse.json(
        { ...localStats, source: "local", cloudflareConfigured: false },
        { headers: { "Cache-Control": "private, max-age=60" } },
      );
    }

    if (cloudflareCache && cloudflareCache.expiresAt > Date.now()) {
      return NextResponse.json(
        { today: cloudflareCache.today, total: localStats.total, source: "cloudflare", cloudflareConfigured: true, metric: "unique_ips" },
        { headers: { "Cache-Control": "private, max-age=60" } },
      );
    }

    const now = new Date();
    const start = koreaDayStart(now);
    const query = `
      query SiteVisitors($zoneTag: String!, $start: Time!, $end: Time!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1hGroups(
              limit: 1
              filter: { datetime_geq: $start, datetime_lt: $end }
            ) {
              uniq { uniques }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          zoneTag: config.zoneId,
          start: start.toISOString(),
          end: now.toISOString(),
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ...localStats, source: "local-fallback", cloudflareConfigured: true },
        { headers: { "Cache-Control": "private, max-age=60" } },
      );
    }

    const result = (await response.json()) as CloudflareAnalyticsResponse;
    const group = result.data?.viewer?.zones?.[0]?.httpRequests1hGroups?.[0];
    const cloudflareToday = group?.uniq?.uniques;

    if (result.errors?.length || !Number.isFinite(cloudflareToday)) {
      return NextResponse.json(
        { ...localStats, source: "local-fallback", cloudflareConfigured: true },
        { headers: { "Cache-Control": "private, max-age=60" } },
      );
    }

    const today = Math.max(0, Math.floor(Number(cloudflareToday)));
    cloudflareCache = { today, expiresAt: Date.now() + 5 * 60 * 1000 };

    return NextResponse.json(
      {
        today,
        total: localStats.total,
        source: "cloudflare",
        cloudflareConfigured: true,
        metric: "unique_ips",
      },
      { headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=60" } },
    );
  } catch {
    return NextResponse.json(
      { today: 0, total: 0, source: "unavailable", cloudflareConfigured: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
