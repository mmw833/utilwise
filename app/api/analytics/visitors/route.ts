import { NextResponse } from "next/server";
import {
  getBlogImageBucket,
  getCloudflareAnalyticsConfig,
} from "@/lib/blog/db";

export const dynamic = "force-dynamic";

type AnalyticsGroup = {
  dimensions?: { date?: string };
  uniq?: { uniques?: number };
};
type CloudflareAnalyticsResponse = {
  data?: {
    viewer?: {
      zones?: Array<{ visitors?: AnalyticsGroup[] }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

type R2Object = { key: string };
type R2ListResult = { objects: R2Object[]; truncated: boolean; cursor?: string };

const BASELINE_KEY = "visitor-stats/baseline.json";
const DAILY_PREFIX = "visitor-stats/daily/";
const BACKFILL_KEY = "visitor-stats/daily-rollup-backfill-v1.json";
const BACKFILL_START_DATE = "2026-11-17";
// Set this once to the 30-day visitor count supplied by the site owner before first production use.
const INITIAL_TOTAL_BASELINE = 1260;

function utcDate(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function nextUtcDate(date: string): string {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return utcDate(next);
}

async function readJson<T>(bucket: ReturnType<typeof getBlogImageBucket>, key: string): Promise<T | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  return JSON.parse(await new Response(object.body).text()) as T;
}

/**
 * Query Cloudflare's daily rollup. A 1d group returns one unique-IP count for
 * the whole UTC calendar day; hourly unique counts must never be summed because
 * the same visitor can appear in multiple hourly groups.
 */
async function queryDailyVisitors(
  apiToken: string,
  zoneId: string,
  startDate: string,
  endDate: string,
): Promise<Map<string, number>> {
  const query = `
    query SiteDailyVisitors($zoneTag: String!, $start: Date!, $end: Date!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          visitors: httpRequests1dGroups(
            limit: 1000
            filter: { date_geq: $start, date_lt: $end }
            orderBy: [date_ASC]
          ) {
            dimensions { date }
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
      variables: { zoneTag: zoneId, start: startDate, end: endDate },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error("Cloudflare Analytics request failed.");
  const result = (await response.json()) as CloudflareAnalyticsResponse;
  const rows = result.data?.viewer?.zones?.[0]?.visitors;
  if (result.errors?.length || !Array.isArray(rows)) {
    throw new Error("Cloudflare Analytics returned incomplete daily visitor data.");
  }

  const daily = new Map<string, number>();
  for (const row of rows) {
    const date = row.dimensions?.date;
    const visitors = row.uniq?.uniques;
    if (date && Number.isFinite(visitors)) {
      daily.set(date, Math.max(0, Math.floor(Number(visitors))));
    }
  }
  return daily;
}

async function queryTodayVisitors(
  apiToken: string,
  zoneId: string,
  today: string,
): Promise<number> {
  const daily = await queryDailyVisitors(apiToken, zoneId, today, nextUtcDate(today));
  const value = daily.get(today);
  if (!Number.isFinite(value)) {
    throw new Error("Cloudflare Analytics has no daily visitor value for the current UTC date yet.");
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

/**
 * The previous implementation stored only one hourly group's uniques per day.
 * Rebuild snapshots from the daily rollup once so TOTAL no longer includes
 * those incomplete hourly values.
 */
async function backfillDailySnapshotsIfNeeded(
  bucket: ReturnType<typeof getBlogImageBucket>,
  apiToken: string,
  zoneId: string,
  now: Date,
): Promise<Map<string, number> | null> {
  const marker = await readJson<{ version?: number }>(bucket, BACKFILL_KEY);
  if (marker?.version === 1) return null;

  const today = utcDate(now);
  const endDate = nextUtcDate(today);
  const daily = await queryDailyVisitors(apiToken, zoneId, BACKFILL_START_DATE, endDate);

  // Do not mark the repair complete until Cloudflare has returned today's row.
  if (!daily.has(today)) {
    throw new Error("Cloudflare daily rollup is not ready for the current UTC date.");
  }

  for (let date = BACKFILL_START_DATE; date < endDate; date = nextUtcDate(date)) {
    await saveDailySnapshot(bucket, date, daily.get(date) ?? 0);
  }

  await bucket.put(
    BACKFILL_KEY,
    new TextEncoder().encode(JSON.stringify({
      version: 1,
      completedAt: now.toISOString(),
      startDate: BACKFILL_START_DATE,
      endDate,
    })),
    { httpMetadata: { contentType: "application/json" } },
  );

  return daily;
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
    const today = utcDate(now);

    // The owner-provided 30-day starting count is stored only once.
    let baseline = await readJson<{ total: number }>(bucket, BASELINE_KEY);
    if (!baseline) {
      baseline = { total: INITIAL_TOTAL_BASELINE };
      await bucket.put(BASELINE_KEY, new TextEncoder().encode(JSON.stringify(baseline)), {
        httpMetadata: { contentType: "application/json" },
      });
      baseline = (await readJson<{ total: number }>(bucket, BASELINE_KEY)) ?? baseline;
    }

    const backfilled = await backfillDailySnapshotsIfNeeded(
      bucket,
      config.apiToken,
      config.zoneId,
      now,
    );
    const todayVisitors = backfilled?.get(today)
      ?? await queryTodayVisitors(config.apiToken, config.zoneId, today);

    // Replace today's UTC daily snapshot rather than incrementing it on every API call.
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
