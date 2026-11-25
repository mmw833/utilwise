import { readFileSync } from "node:fs";

const route = readFileSync("app/api/analytics/visitors/route.ts", "utf8");
const component = readFileSync("components/SiteVisitorStats.tsx", "utf8");
const errors = [];

if (!route.includes("httpRequests1dGroups")) {
  errors.push("Visitor analytics must use Cloudflare's daily rollup dataset.");
}
if (route.includes("httpRequests1hGroups")) {
  errors.push("Visitor analytics must not use hourly groups for daily unique visitors.");
}
if (!route.includes("date_geq: $start") || !route.includes("date_lt: $end")) {
  errors.push("Daily visitor query must use a bounded date range.");
}
if (!route.includes("BACKFILL_START_DATE") || !route.includes("BACKFILL_KEY")) {
  errors.push("Daily visitor snapshots must include the one-time historical correction.");
}
if (!route.includes("httpRequests1hGroups") || !route.includes("datetime_geq: $start") || !route.includes("datetime_lt: $end")) {
  errors.push("Rolling 24-hour visitors must use a bounded hourly Cloudflare query.");
}
if (!route.includes("queryLast24HoursVisitors") || !route.includes("last24HoursMode")) {
  errors.push("Visitor API must expose the rolling 24-hour hourly-series metric separately from daily totals.");
}
if (!component.includes("last24Hours") || !component.includes("same visitor may be counted")) {
  errors.push("Visitor counter must show the 24-hour value and disclose hourly repeat counting.");
}

if (errors.length) {
  console.error("Visitor analytics check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Visitor analytics check passed: daily TOTAL rollup, rolling 24-hour hourly metric, historical repair, and repeat-count disclosure verified.");
