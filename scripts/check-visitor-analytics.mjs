import { readFileSync } from "node:fs";

const route = readFileSync("app/api/analytics/visitors/route.ts", "utf8");
const component = readFileSync("components/SiteVisitorStats.tsx", "utf8");
const errors = [];

if (!route.includes("httpRequests1dGroups") || !route.includes("sum { pageViews }")) {
  errors.push("Daily totals must use Cloudflare's page-view rollup, not unique IP counts.");
}
if (!route.includes("httpRequests1hGroups") || !route.includes("hourlyPageViews")) {
  errors.push("The rolling 24-hour metric must use hourly page-view rollups.");
}
if (!route.includes("datetime_geq: $start") || !route.includes("datetime_lt: $end")) {
  errors.push("The rolling 24-hour query must use a bounded time range.");
}
if (!route.includes("pageviews-daily/") || !route.includes("pageviews-backfill-v1.json")) {
  errors.push("Page-view totals must use their own R2 namespace and one-time historical backfill.");
}
if (route.includes("uniq { uniques }") || route.includes("sum { visits }")) {
  errors.push("Displayed traffic must count page views, not unique IPs or referrer-only visits.");
}
if (!component.includes("last24Hours") || !component.includes("Reloads and repeat visits are counted")) {
  errors.push("The homepage must show rolling 24-hour page views and disclose repeat counting.");
}

if (errors.length) {
  console.error("Visitor analytics check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Visitor analytics check passed: daily and rolling 24-hour page views, repeat counting, separate R2 history, and disclosure verified.");
