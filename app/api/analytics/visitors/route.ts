import { NextResponse } from "next/server";
import { getCloudflareAnalyticsConfig } from "@/lib/blog/db";

export const dynamic = "force-dynamic";

let cachedStats: { today: number; total: number; expiresAt: number } | null = null;

type AnalyticsGroup = { uniq?: { uniques?: number } };
type CloudflareAnalyticsResponse = {
  data?: {
    viewer?: {
      zones?: Array<{
        today: AnalyticsGroup[];
        total: AnalyticsGroup[];
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

function koreaDayStart(now: Date): Date {
  const utcMs = now.getTime();
  const koreaOffsetMs = 9 * 60 * 60 * 1000;
  const koreaMidnightUtcMs =
    Math.floor((utcMs + koreaOffsetMs) / 86400000) * 86400000 - koreaOffsetMs;
  return new Date(koreaMidnightUtcMs);
}

export async function GET() {
  try {
    const config = getCloudflareAnalyticsConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Cloudflare Analytics is not configured.", source: "unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (cachedStats && cachedStats.expiresAt > Date.now()) {
      return NextResponse.json(
        { today: cachedStats.today, total: cachedStats.total, source: "cloudflare", totalPeriodDays: 30 },
        { headers: { "Cache-Control": "private, max-age=60" } },
      );
    }

    const now = new Date();
    const todayStart = koreaDayStart(now);
    const totalStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const query = `
      query SiteVisitors($zoneTag: String!, $todayStart: Time!, $totalStart: Time!, $end: Time!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            today: httpRequests1hGroups(
              limit: 1
              filter: { datetime_geq: $todayStart, datetime_lt: $end }
            ) {
              uniq { uniques }
            }
            total: httpRequests1hGroups(
              limit: 1
              filter: { datetime_geq: $totalStart, datetime_lt: $end }
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
          todayStart: todayStart.toISOString(),
          totalStart: totalStart.toISOString(),
          end: now.toISOString(),
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Cloudflare Analytics request failed.", source: "unavailable" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const result = (await response.json()) as CloudflareAnalyticsResponse;
    const zone = result.data?.viewer?.zones?.[0];
    const todayValue = zone?.today?.[0]?.uniq?.uniques;
    const totalValue = zone?.total?.[0]?.uniq?.uniques;

    if (
      result.errors?.length ||
      !Number.isFinite(todayValue) ||
      !Number.isFinite(totalValue)
    ) {
      return NextResponse.json(
        { error: "Cloudflare Analytics returned incomplete visitor data.", source: "unavailable" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const today = Math.max(0, Math.floor(Number(todayValue)));
    const total = Math.max(today, Math.floor(Number(totalValue)));
    cachedStats = { today, total, expiresAt: Date.now() + 5 * 60 * 1000 };

    return NextResponse.json(
      { today, total, source: "cloudflare", totalPeriodDays: 30 },
      { headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=60" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Visitor analytics are temporarily unavailable.", source: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
