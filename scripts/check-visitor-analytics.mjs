import { readFileSync } from "node:fs";

const route = readFileSync("app/api/analytics/visitors/route.ts", "utf8");
const component = readFileSync("components/SiteVisitorStats.tsx", "utf8");
const errors = [];

if (!route.includes("httpRequests1dGroups") || !route.includes("sum { pageViews }")) {
  errors.push("Daily totals must use Cloudflare's page-view rollup, not unique IP counts.");
}
if (!route.includes("httpRequests1hGroups") || !route.includes("browserMap { pageViews }")) {
  errors.push("The rolling 24-hour metric must use the hourly browserMap page-view field.");
}
if (!route.includes("datetime_geq: $start") || !route.includes("datetime_lt: $end")) {
  errors.push("The rolling 24-hour query must use a bounded time range.");
}
if (!route.includes("pageviews-daily/") || !route.includes("BACKFILL_START_DATE") || !route.includes("Reconcile the complete daily history")) {
  errors.push("Page-view totals must use their own R2 namespace and reconcile the complete daily history on every refresh.");
}
if (!route.includes("for (const [date, pageViews] of daily)") || !route.includes("const total = await sumDailyPageViews(bucket)")) {
  errors.push("TOTAL must refresh available daily rollups and sum the saved daily snapshots without adding a stale baseline.");
}
if (!route.includes("if (!daily.has(today))")) {
  errors.push("The current UTC daily rollup must be present before returning a total.");
}
if (route.includes("uniq { uniques }") || route.includes("sum { visits }")) {
  errors.push("Displayed traffic must count page views, not unique IPs or referrer-only visits.");
}
if (!component.includes("last24Hours") || !component.includes("Reloads and repeat visits are counted") || !component.includes(">TODAY<")) {
  errors.push("The homepage must retain rolling 24-hour page views, disclose repeat counting, and display the TODAY label.");
}

if (errors.length) {
  console.error("Visitor analytics check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Visitor analytics check passed: daily pageViews, hourly browserMap.pageViews, repeat counting, separate R2 history, and disclosure verified.");
