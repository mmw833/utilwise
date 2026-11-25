import { readFileSync } from "node:fs";

const route = readFileSync("app/api/analytics/visitors/route.ts", "utf8");
const component = readFileSync("components/SiteVisitorStats.tsx", "utf8");
const errors = [];

if (!route.includes("httpRequests1dGroups") || !route.includes("sum { pageViews }")) {
  errors.push("Historical totals must use Cloudflare's daily page-view rollup.");
}
if (!route.includes("httpRequests1hGroups") || !route.includes("sum { pageViews }")) {
  errors.push("TODAY must use Cloudflare's hourly page-view aggregate.");
}
if (!route.includes("datetime_geq: $start") || !route.includes("datetime_lt: $end")) {
  errors.push("TODAY must query a bounded time range.");
}
if (!route.includes("getTime() + 9 * 60 * 60 * 1000") || !route.includes("completedHour.setUTCMinutes(0, 0, 0)")) {
  errors.push("TODAY must use Korea midnight and exclude the current incomplete hour.");
}
if (!route.includes("pageviews-daily/") || !route.includes("pageviews-backfill-v1.json")) {
  errors.push("Page-view totals must keep their separate R2 history and backfill.");
}
if (route.includes("browserMap") || route.includes("last24Hours")) {
  errors.push("Obsolete rolling-24-hour query fields must not remain.");
}
if (!component.includes("data.today") || !component.includes(">TODAY<")) {
  errors.push("The homepage must display the TODAY label and today metric.");
}
if (component.includes("last24Hours") || component.includes(">24H<")) {
  errors.push("The homepage must no longer display the rolling 24-hour metric.");
}

if (errors.length) {
  console.error("Visitor analytics check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Visitor analytics check passed: Korea TODAY pageViews, completed-hour boundary, daily page-view history, and homepage label verified.");
