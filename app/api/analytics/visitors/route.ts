import { NextResponse } from "next/server";
import {
  getBlogImageBucket,
  getCloudflareAnalyticsConfig,
} from "@/lib/blog/db";

export const dynamic = "force-dynamic";

type AnalyticsGroup = { uniq?: { uniques?: number } };
type CloudflareAnalyticsResponse = {
  data?: {
    viewer?: {
      zones?: Array<{ visitors: AnalyticsGroup[] }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

type R2Object = { key: string };
type R2ListResult = { objects: R2Object[]; truncated: boolean; cursor?: string };

const BASELINE_KEY = "visitor-stats/baseline.json";
const DAILY_PREFIX = "visitor-stats/daily/";
const KOREA_OFFSET_MS = 9 * 60 * 60 * 1000;

function koreaDate(now: Date): string {
  return new Date(now.getTime() + KOREA_OFFSET_MS).toISOString().slice(0, 10);
}

function koreaMidnightUtc(date: string): Date {
  return new Date(new Date(`${date}T00:00:00+09:00`).getTime());
}

async function readJson<T>(bucket: ReturnType<typeof getBlogImageBucket>, key: string): Promise<T | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  return JSON.parse(await new Response(object.body).text()) as T;
}

async function queryCloudflareVisitors(
  apiToken: string,
  zoneId: string,
  start: Date,
  end: Date,
): Promise<number> {
  const query = `
    query SiteVisitors($zoneTag: String!, $start: Time!, $end: Time!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          visitors: httpRequests1hGroups(
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
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        zoneTag: zoneId,
        start: start.toISOString(),
        end: end.toISOString(),
      },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error("Cloudflare Analytics request failed.");
  const result = (await response.json()) as CloudflareAnalyticsResponse;
  const value = result.data?.viewer?.zones?.[0]?.visitors?.[0]?.uniq?.uniques;
  if (result.errors?.length || !Number.isFinite(value)) {
    throw new Error("Cloudflare Analytics returned incomplete visitor data.");
  }
  return Math.max(0, Math.floor(Number(value)));
}

async function saveDailySnapshot(
  bucket: ReturnType<typeof getBlogImageBucket>,
  date: string,
  visitors: number,
): Promise<void> {
  await bucket.put(
    `${DAILY_PREFIX}${date}.json`,
    new TextEncoder().encode(JSON.stringify({ date, visitors })),
    { httpMetadata: { contentType: "application/json" } },
  );
}

async function sumDailySnapshots(
  bucket: ReturnType<typeof getBlogImageBucket>,
): Promise<number> {
  let cursor: string | undefined;
  let total = 0;

  do {
    const page: R2ListResult = await (bucket as unknown as {
      list(options: { prefix: string; cursor?: string }): Promise<R2ListResult>;
    }).list({ prefix: DAILY_PREFIX, ...(cursor ? { cursor } : {}) });

    for (const object of page.objects) {
      const snapshot = await readJson<{ visitors?: number }>(bucket, object.key);
      if (Number.isFinite(snapshot?.visitors)) total += Math.max(0, Math.floor(snapshot!.visitors!));
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  return total;
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

    const bucket = getBlogImageBucket();
    const now = new Date();
    const today = koreaDate(now);
    const todayStart = koreaMidnightUtc(today);

    // Initialize the starting total only once: the 30 full Korea-calendar days
    // immediately before today. Later requests never query this 30-day range again.
    let baseline = await readJson<{ total: number }>(bucket, BASELINE_KEY);
    if (!baseline) {
      const baselineEnd = koreaMidnightUtc(today);
      const baselineStart = new Date(baselineEnd.getTime() - 30 * 86400000);
      const initialTotal = await queryCloudflareVisitors(
        config.apiToken,
        config.zoneId,
        baselineStart,
        baselineEnd,
      );
      baseline = { total: initialTotal };
      await bucket.put(BASELINE_KEY, new TextEncoder().encode(JSON.stringify(baseline)), {
        httpMetadata: { contentType: "application/json" },
      });
      // Re-read after writing so simultaneous first requests converge on the saved baseline.
      baseline = (await readJson<{ total: number }>(bucket, BASELINE_KEY)) ?? baseline;
    }

    const todayVisitors = await queryCloudflareVisitors(
      config.apiToken,
      config.zoneId,
      todayStart,
      now,
    );
    // A date-keyed snapshot is overwritten with the latest daily unique count.
    // This prevents duplicate additions when multiple visitors load the page.
    await saveDailySnapshot(bucket, today, todayVisitors);

    const total = baseline.total + await sumDailySnapshots(bucket);
    return NextResponse.json(
      { today: todayVisitors, total, source: "cloudflare", totalMode: "initial-30-days-plus-daily" },
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Visitor analytics are temporarily unavailable.", source: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
