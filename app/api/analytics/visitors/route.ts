import { NextResponse } from "next/server";
import {
  getBlogImageBucket,
  getCloudflareAnalyticsConfig,
} from "@/lib/blog/db";

export const dynamic = "force-dynamic";

type AnalyticsGroup = {
  dimensions?: { date?: string };
  sum?: { pageViews?: number };
};
type HourlyAnalyticsGroup = {
  dimensions?: { datetime?: string };
  sum?: { browserMap?: Array<{ pageViews?: number }> };
};
type CloudflareAnalyticsResponse = {
  data?: {
    viewer?: {
      zones?: Array<{
        visitors?: AnalyticsGroup[];
        hourlyPageViews?: HourlyAnalyticsGroup[];
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

type R2Object = { key: string };
type R2ListResult = { objects: R2Object[]; truncated: boolean; cursor?: string };

// Page-view totals use a separate R2 namespace so they never mix with legacy unique-IP snapshots.
const BASELINE_KEY = "visitor-stats/pageviews-baseline-v1.json";
const DAILY_PREFIX = "visitor-stats/pageviews-daily/";
const BACKFILL_KEY = "visitor-stats/pageviews-backfill-v1.json";
const BACKFILL_START_DATE = "2026-11-17";

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
 * Query Cloudflare's daily page-view rollup. Page views count successful HTML
 * requests, so reloads and repeat visits are counted rather than deduplicated by IP.
 */
async function queryDailyPageViews(
  apiToken: string,
  zoneId: string,
  startDate: string,
  endDate: string,
): Promise<Map<string, number>> {
  const query = `
    query SiteDailyPageViews($zoneTag: String!, $start: Date!, $end: Date!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          visitors: httpRequests1dGroups(
            limit: 1000
            filter: { date_geq: $start, date_lt: $end }
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { pageViews }
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
    const pageViews = row.sum?.pageViews;
    if (date && Number.isFinite(pageViews)) {
      daily.set(date, Math.max(0, Math.floor(Number(pageViews))));
    }
  }
  return daily;
}

async function queryTodayPageViews(
  apiToken: string,
  zoneId: string,
  today: string,
): Promise<number> {
  const daily = await queryDailyPageViews(apiToken, zoneId, today, nextUtcDate(today));
  const value = daily.get(today);
  if (!Number.isFinite(value)) {
    throw new Error("Cloudflare Analytics has no daily page-view value for the current UTC date yet.");
  }
  return Math.max(0, Math.floor(Number(value)));
}


// Page views count successful HTML requests, including reloads and repeat visits.
// Hourly rollups count repeated page views; the display uses the last 24 completed hours.
async function queryLast24HoursPageViews(
  apiToken: string,
  zoneId: string,
  now: Date,
): Promise<number> {
  // httpRequests1hGroups are hour-bucketed. Query the last 24 completed UTC
  // hours so the first and last buckets are not partial or inconsistently excluded.
  const completedHour = new Date(now);
  completedHour.setUTCMinutes(0, 0, 0);
  const end = completedHour.toISOString();
  const start = new Date(completedHour.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const query = `
    query SiteLast24HoursPageViews($zoneTag: String!, $start: Time!, $end: Time!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          hourlyPageViews: httpRequests1hGroups(
            limit: 100
            filter: { datetime_geq: $start, datetime_lt: $end }
            orderBy: [datetime_ASC]
          ) {
            dimensions { datetime }
            sum { browserMap { pageViews } }
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
    body: JSON.stringify({ query, variables: { zoneTag: zoneId, start, end } }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error("Cloudflare hourly page-view request failed.");
  const result = (await response.json()) as CloudflareAnalyticsResponse;
  const rows = result.data?.viewer?.zones?.[0]?.hourlyPageViews;
  if (result.errors?.length || !Array.isArray(rows)) {
    throw new Error("Cloudflare Analytics returned incomplete hourly page-view data.");
  }

  return rows.reduce((total, row) => {
    const browserRows = row.sum?.browserMap;
    if (!Array.isArray(browserRows)) {
      throw new Error("Cloudflare returned incomplete hourly browser page-view data.");
    }
    const hourPageViews = browserRows.reduce((hourTotal, browser) => {
      const value = browser.pageViews;
      if (!Number.isFinite(value)) {
        throw new Error("Cloudflare returned an invalid hourly page-view value.");
      }
      return hourTotal + Math.max(0, Math.floor(Number(value)));
    }, 0);
    return total + hourPageViews;
  }, 0);
}

async function saveDailySnapshot(
  bucket: ReturnType<typeof getBlogImageBucket>,
  date: string,
  pageViews: number,
): Promise<void> {
  await bucket.put(
    `${DAILY_PREFIX}${date}.json`,
    new TextEncoder().encode(JSON.stringify({ date, pageViews })),
    { httpMetadata: { contentType: "application/json" } },
  );
}

/**
 * Rebuild page-view snapshots from the daily rollup once. The separate v1
 * namespace prevents legacy unique-visitor totals from being mixed with views.
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
  const daily = await queryDailyPageViews(apiToken, zoneId, BACKFILL_START_DATE, endDate);

  // Do not mark the repair complete until Cloudflare has returned today's row.
  if (!daily.has(today)) {
    throw new Error("Cloudflare daily page-view rollup is not ready for the current UTC date.");
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

async function sumDailyPageViews(
  bucket: ReturnType<typeof getBlogImageBucket>,
): Promise<number> {
  let cursor: string | undefined;
  let total = 0;

  do {
    const page: R2ListResult = await (bucket as unknown as {
      list(options: { prefix: string; cursor?: string }): Promise<R2ListResult>;
    }).list({ prefix: DAILY_PREFIX, ...(cursor ? { cursor } : {}) });

    for (const object of page.objects) {
      const snapshot = await readJson<{ pageViews?: number }>(bucket, object.key);
      if (Number.isFinite(snapshot?.pageViews)) total += Math.max(0, Math.floor(snapshot!.pageViews!));
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

    // New page-view total starts at zero; backfill reconstructs all daily views
    // available since BACKFILL_START_DATE without reusing the old unique-IP baseline.
    let baseline = await readJson<{ total: number }>(bucket, BASELINE_KEY);
    if (!baseline) {
      baseline = { total: 0 };
      await bucket.put(BASELINE_KEY, new TextEncoder().encode(JSON.stringify(baseline)), {
        httpMetadata: { contentType: "application/json" },
      });
    }

    const backfilled = await backfillDailySnapshotsIfNeeded(
      bucket,
      config.apiToken,
      config.zoneId,
      now,
    );
    const todayPageViews = backfilled?.get(today)
      ?? await queryTodayPageViews(config.apiToken, config.zoneId, today);
    const last24Hours = await queryLast24HoursPageViews(config.apiToken, config.zoneId, now);

    // Replace today's UTC daily page-view snapshot; repeated page loads are counted.
    await saveDailySnapshot(bucket, today, todayPageViews);

    const total = baseline.total + await sumDailyPageViews(bucket);
    return NextResponse.json(
      {
        today: todayPageViews,
        last24Hours,
        total,
        source: "cloudflare",
        metric: "pageViews",
        totalMode: "daily-pageviews-since-2026-11-17",
      },
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Visitor analytics are temporarily unavailable.", source: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
