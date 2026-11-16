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
// Set this once to the 30-day visitor count supplied by the site owner before first production use.
const INITIAL_TOTAL_BASELINE = 0;

function koreaDate(now: Date): string {
  return new Date(now.getTime() + KOREA_OFFSET_MS).toISOString().slice(0, 10);
}

async function readJson<T>(bucket: ReturnType<typeof getBlogImageBucket>, key: string): Promise<T | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  return JSON.parse(await new Response(object.body).text()) as T;
}

async function queryTodayVisitors(
  apiToken: string,
  zoneId: string,
  today: string,
  now: Date,
): Promise<number> {
  // With no time dimension selected, Cloudflare returns one aggregate for the
  // requested period instead of one row per hour. This keeps uniq.uniques
  // deduplicated across the whole Korea calendar day.
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

  const start = new Date(`${today}T00:00:00+09:00`);
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
        end: now.toISOString(),
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

    // The owner-provided 30-day starting count is stored only once.
    let baseline = await readJson<{ total: number }>(bucket, BASELINE_KEY);
    if (!baseline) {
      baseline = { total: INITIAL_TOTAL_BASELINE };
      await bucket.put(BASELINE_KEY, new TextEncoder().encode(JSON.stringify(baseline)), {
        httpMetadata: { contentType: "application/json" },
      });
      baseline = (await readJson<{ total: number }>(bucket, BASELINE_KEY)) ?? baseline;
    }

    const todayVisitors = await queryTodayVisitors(config.apiToken, config.zoneId, today, now);
    // Replace today's snapshot rather than incrementing it on every API call.
    await saveDailySnapshot(bucket, today, todayVisitors);

    const total = baseline.total + await sumDailySnapshots(bucket);
    return NextResponse.json(
      { today: todayVisitors, total, source: "cloudflare", totalMode: "owner-baseline-plus-daily" },
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Visitor analytics are temporarily unavailable.", source: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
