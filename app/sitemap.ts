import type { MetadataRoute } from "next";

const siteUrl = "https://utilwise.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/area",
    "/loan",
    "/brokerage",
    "/salary",
    "/severance",
    "/savings",
    "/dsr",
    "/rent-conversion",
    "/fuel",
    "/vat",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-11-06"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
