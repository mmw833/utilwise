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
if (!component.includes("UTC calendar day")) {
  errors.push("Visitor counter tooltip must disclose the UTC day boundary.");
}

if (errors.length) {
  console.error("Visitor analytics check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Visitor analytics check passed: daily unique rollup, bounded date query, historical repair, and UTC label verified.");
