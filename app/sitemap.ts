import type { MetadataRoute } from "next";
const siteUrl = "https://utilwise.kr";
const calculators = ["/area","/date","/loan","/brokerage","/salary","/severance","/savings","/dsr","/rent-conversion","/fuel","/vat","/volume","/tip"];
const englishCalculators = calculators.map((route) => `/en${route}`);
const pdfToolPages = ["/pdf-merge","/pdf-split","/pdf-rotate","/pdf-organize","/image-to-pdf"];
const onlineToolPages = ["/online-tools","/qr-code-generator","/image-compressor","/image-resizer",...pdfToolPages];
const englishOnlineToolPages = onlineToolPages.map((route) => `/en${route}`);
const textToolPages = ["/text-tools","/text-tools/character-counter","/text-tools/text-compare","/text-tools/remove-duplicates","/text-tools/speech-time"];
const englishTextToolPages = textToolPages.map((route) => `/en${route}`);
const mbtiTypes = ["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"];
const pages = [
{route:"/",priority:1,changeFrequency:"weekly" as const},
{route:"/about",priority:0.6,changeFrequency:"yearly" as const},
{route:"/privacy",priority:0.4,changeFrequency:"yearly" as const},
{route:"/terms",priority:0.4,changeFrequency:"yearly" as const},
...calculators.map(route=>({route,priority:0.8,changeFrequency:"monthly" as const})),
...onlineToolPages.map(route=>({route,priority:0.75,changeFrequency:"monthly" as const})),
...textToolPages.map(route=>({route,priority:0.75,changeFrequency:"monthly" as const})),
{route:"/mbti",priority:0.7,changeFrequency:"monthly" as const},
{route:"/big-five",priority:0.7,changeFrequency:"monthly" as const},
{route:"/eq",priority:0.7,changeFrequency:"monthly" as const},
{route:"/psychology",priority:0.7,changeFrequency:"monthly" as const},
{route:"/psychology/desire",priority:0.7,changeFrequency:"monthly" as const},
{route:"/psychology/mirror",priority:0.7,changeFrequency:"monthly" as const},
...mbtiTypes.map(type=>({route:`/mbti/result/${type}`,priority:0.45,changeFrequency:"yearly" as const})),
{route:"/en",priority:0.8,changeFrequency:"weekly" as const},
{route:"/en/about",priority:0.5,changeFrequency:"yearly" as const},
{route:"/en/privacy",priority:0.4,changeFrequency:"yearly" as const},
{route:"/en/terms",priority:0.4,changeFrequency:"yearly" as const},
...englishCalculators.map(route=>({route,priority:0.7,changeFrequency:"monthly" as const})),
...englishOnlineToolPages.map(route=>({route,priority:0.65,changeFrequency:"monthly" as const})),
...englishTextToolPages.map(route=>({route,priority:0.65,changeFrequency:"monthly" as const})),
{route:"/en/mbti",priority:0.6,changeFrequency:"monthly" as const},
{route:"/en/big-five",priority:0.6,changeFrequency:"monthly" as const},
{route:"/en/eq",priority:0.6,changeFrequency:"monthly" as const},
{route:"/en/psychology",priority:0.6,changeFrequency:"monthly" as const},
{route:"/en/psychology/desire",priority:0.6,changeFrequency:"monthly" as const},
{route:"/en/psychology/mirror",priority:0.6,changeFrequency:"monthly" as const},
...mbtiTypes.map(type=>({route:`/en/mbti/result/${type}`,priority:0.4,changeFrequency:"yearly" as const}))
];
export default function sitemap():MetadataRoute.Sitemap{return pages.map(({route,priority,changeFrequency})=>({url:`${siteUrl}${route}`,changeFrequency,priority}));}
