import type { MetadataRoute } from "next";

const siteUrl = "https://utilwise.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
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
    "/mbti",
    "/mbti/test",
    ...["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"].map((type) => `/mbti/result/${type}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-11-06"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
