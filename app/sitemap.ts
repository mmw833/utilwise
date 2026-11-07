import type { MetadataRoute } from "next";
const siteUrl="https://utilwise.kr";
export default function sitemap():MetadataRoute.Sitemap{
const routes=["","/about","/en","/en/about",...[ "area","loan","brokerage","salary","severance","savings","dsr","rent-conversion","fuel","vat"].map(tool=>`/en/${tool}`),"/en/mbti","/en/mbti/test","/en/big-five","/date","/en/date","/area","/loan","/brokerage","/salary","/severance","/savings","/dsr","/rent-conversion","/fuel","/vat","/mbti","/mbti/test","/big-five"];
return routes.map(route=>({url:`${siteUrl}${route}`,lastModified:new Date("2026-11-07"),changeFrequency:route===""?"weekly":"monthly",priority:route===""?1:0.8}));
}
