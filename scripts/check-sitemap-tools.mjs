import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const registryPath = "lib/tools/registry.ts";
const sitemapPath = "app/sitemap.ts";
const registry = readFileSync(registryPath, "utf8");
const sitemap = readFileSync(sitemapPath, "utf8");
const routes = [...registry.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
const koreanMbtiResultPage = readFileSync("app/mbti/result/[type]/page.tsx", "utf8");
const englishMbtiResultPage = readFileSync("app/en/mbti/result/[type]/page.tsx", "utf8");
const koreanMbtiResultLayout = readFileSync("app/mbti/result/layout.tsx", "utf8");
const englishMbtiResultLayout = readFileSync("app/en/mbti/result/layout.tsx", "utf8");

const errors = [];

// Personalized MBTI result pages are intentionally noindex and must not be in the sitemap.
if (sitemap.includes("/mbti/result/")) errors.push("MBTI result URLs must not be included in the sitemap.");
if (!koreanMbtiResultPage.includes("robots:{index:false,follow:true}")) errors.push("Korean MBTI result pages must set robots noindex,follow.");
if (!englishMbtiResultPage.includes("robots:{index:false,follow:true}")) errors.push("English MBTI result pages must set robots noindex,follow.");
if (!koreanMbtiResultLayout.includes("index:false") || !koreanMbtiResultLayout.includes("follow:true")) errors.push("Korean MBTI result layout must enforce noindex,follow.");
if (!englishMbtiResultLayout.includes("index:false") || !englishMbtiResultLayout.includes("follow:true")) errors.push("English MBTI result layout must enforce noindex,follow.");
if (!koreanMbtiResultPage.includes("https://utilwise.kr/mbti/result/")) errors.push("Korean MBTI result canonical must use utilwise.kr.");
if (!englishMbtiResultPage.includes("https://utilwise.kr/en/mbti/result/")) errors.push("English MBTI result canonical must use utilwise.kr.");
const duplicates = routes.filter((route, index) => routes.indexOf(route) !== index);
if (duplicates.length) {
  errors.push(`Duplicate tool routes in ${registryPath}: ${[...new Set(duplicates)].join(", ")}`);
}

for (const route of routes) {
  const koreanPage = join("app", route.slice(1), "page.tsx");
  if (!existsSync(koreanPage)) {
    errors.push(`Missing Korean page for tool route ${route}: expected ${koreanPage}`);
  }

  // Every tool route must be explicitly listed in one of the sitemap route groups.
  const quotedRoute = JSON.stringify(route);
  if (!sitemap.includes(quotedRoute)) {
    errors.push(`Tool route is missing from sitemap route groups: ${route}`);
  }

  // The English year-end tax calculator is intentionally excluded because it is Korea-specific.
  if (route !== "/year-end-tax") {
    const englishRoute = `/en${route}`;
    const exactEnglishPage = join("app", englishRoute.slice(1), "page.tsx");
    const oneSegmentDynamicPage = route.split("/").filter(Boolean).length === 1
      && existsSync("app/en/[tool]/page.tsx");
    if (!existsSync(exactEnglishPage) && !oneSegmentDynamicPage) {
      errors.push(`Missing English page or dynamic route for tool route ${route}: expected ${exactEnglishPage}`);
    }
  }
}

if (errors.length) {
  console.error("Sitemap/tool route check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Sitemap/tool route check passed: ${routes.length} registered tools, no duplicate routes, Korean pages and English counterparts verified.`);
