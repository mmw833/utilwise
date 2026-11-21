"use client";
export type UsageCategory="calculator"|"online-tool"|"personality-test"|"psychology-test";
export type UsageEvent="run"|"start"|"complete";
/** Send event metadata only. Never pass user answers, input values, or result data. */
export function trackToolUsage(toolId:string,category:UsageCategory,eventType:UsageEvent="complete",locale:"ko"|"en"="ko"){
 if(typeof window==="undefined"||!/^[a-z0-9-]{2,64}$/.test(toolId))return;
 const eventId=typeof crypto!=="undefined"&&"randomUUID" in crypto?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2);
 try{void fetch("/api/analytics/tool-usage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({eventId,toolId,category,eventType,locale}),keepalive:true,credentials:"same-origin"}).catch(()=>undefined);}catch{}
}
export function trackToolUsageStart(toolId:string,category:UsageCategory,locale:"ko"|"en"="ko"){
 try{const key="uw-usage-started:"+toolId+":"+locale;const last=Number(sessionStorage.getItem(key)||0);if(Date.now()-last<3000)return;sessionStorage.setItem(key,String(Date.now()));}catch{}
 trackToolUsage(toolId,category,"start",locale);
}
