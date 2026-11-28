import {NextRequest,NextResponse} from "next/server";
import {isAdminAuthenticated} from "@/lib/blog/admin-auth";
import {getBlogDatabase} from "@/lib/blog/db";
import {RELATED_TOOLS} from "@/lib/tools/registry";
export const dynamic="force-dynamic";
const tests:Record<string,string>={"mbti":"personality-test","big-five":"personality-test","eq":"personality-test","psychology":"psychology-test","psychology-desire":"psychology-test","psychology-mirror":"psychology-test","psychology-zombie":"psychology-test"};
const online=new Set(["qr-code-generator","image-compressor","image-resizer","image-converter","background-remover","image-to-text","image-to-pdf","pdf-merge","pdf-split","pdf-rotate","pdf-organize","pdf-compress","text-to-speech","character-counter","speech-time"]);
const tools=new Set(RELATED_TOOLS.map(x=>x.id));
const json=(v:unknown,s=200)=>NextResponse.json(v,{status:s,headers:{"Cache-Control":"no-store"}});
const dateKst=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
export async function POST(req:NextRequest){
 const origin=req.headers.get("origin");if(origin&&origin!==new URL(req.url).origin)return json({error:"Invalid origin."},403);
 if(Number(req.headers.get("content-length")||0)>1200)return json({error:"Payload too large."},413);
 let body:any;try{body=await req.json()}catch{return json({error:"Invalid JSON."},400)}
 const {eventId,toolId,eventType,locale}=body||{};
 const category=tests[toolId]||(tools.has(toolId)?(online.has(toolId)?"online-tool":"calculator"):"");
 if(typeof eventId!=="string"||!/^[a-zA-Z0-9-]{16,80}$/.test(eventId)||typeof toolId!=="string"||!/^[a-z0-9-]{2,64}$/.test(toolId)||!category||!["run","start","complete"].includes(eventType)||!["ko","en"].includes(locale))return json({error:"Unsupported event."},400);
 try{await getBlogDatabase().prepare("INSERT OR IGNORE INTO tool_usage_events(event_id,tool_id,category,locale,event_type,event_date) VALUES(?,?,?,?,?,?)").bind(eventId,toolId,category,locale,eventType,dateKst()).run();return json({success:true})}
 catch{return json({error:"Usage analytics are not available. Apply the D1 migration first."},503)}
}
export async function GET(req:NextRequest){
 if(!(await isAdminAuthenticated()))return json({error:"Authentication required."},401);
 const p=new URL(req.url).searchParams,today=dateKst(),end=p.get("end")||today;
 const start=p.get("start")||(()=>{const d=new Date(Date.now()-29*86400000);return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)})();
 if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^(\d{4}-\d{2}-\d{2})$/.test(end)||start>end)return json({error:"Invalid date range."},400);
 try{
  const db=getBlogDatabase();
  const [daily,toolsRows,cats,langs,totals]=await Promise.all([
   db.prepare("SELECT event_date AS date,SUM(CASE WHEN event_type IN ('run','complete') THEN 1 ELSE 0 END) AS usage,SUM(CASE WHEN event_type='start' THEN 1 ELSE 0 END) AS starts,SUM(CASE WHEN event_type='complete' THEN 1 ELSE 0 END) AS completions FROM tool_usage_events WHERE event_date BETWEEN ? AND ? GROUP BY event_date ORDER BY event_date").bind(start,end).all(),
   db.prepare("SELECT tool_id AS toolId,category,locale,SUM(CASE WHEN event_type IN ('run','complete') THEN 1 ELSE 0 END) AS usage,SUM(CASE WHEN event_type='start' THEN 1 ELSE 0 END) AS starts,SUM(CASE WHEN event_type='complete' THEN 1 ELSE 0 END) AS completions FROM tool_usage_events WHERE event_date BETWEEN ? AND ? GROUP BY tool_id,category,locale ORDER BY usage DESC LIMIT 100").bind(start,end).all(),
   db.prepare("SELECT category,SUM(CASE WHEN event_type IN ('run','complete') THEN 1 ELSE 0 END) AS usage FROM tool_usage_events WHERE event_date BETWEEN ? AND ? GROUP BY category").bind(start,end).all(),
   db.prepare("SELECT locale,SUM(CASE WHEN event_type IN ('run','complete') THEN 1 ELSE 0 END) AS usage FROM tool_usage_events WHERE event_date BETWEEN ? AND ? GROUP BY locale").bind(start,end).all(),
   db.prepare("SELECT SUM(CASE WHEN event_type IN ('run','complete') THEN 1 ELSE 0 END) AS usage,SUM(CASE WHEN event_type='start' THEN 1 ELSE 0 END) AS starts,SUM(CASE WHEN event_type='complete' THEN 1 ELSE 0 END) AS completions FROM tool_usage_events WHERE event_date BETWEEN ? AND ?").bind(start,end).first()
  ]);
  const labels:Record<string,[string,string]>={mbti:["MBTI 성격유형 테스트","MBTI Personality Test"],"big-five":["빅파이브 성격검사","Big Five Personality Test"],eq:["감성지능(EQ) 테스트","Emotional Intelligence Test"],psychology:["나도 몰랐던 나의 진짜 모습","Discover Your Hidden Self"],"psychology-desire":["내 마음속 진짜 욕망","What Do I Truly Want?"],"psychology-mirror":["사람들이 보는 나 vs 진짜 나","How Others See Me vs. Who I Really Am"],"psychology-zombie":["좀비 생존 테스트","Zombie Survival Quiz"]};
  const catalog=[
   ...RELATED_TOOLS.map(x=>({toolId:x.id,category:online.has(x.id)?"online-tool":"calculator",name:[x.ko,x.en] as [string,string]})),
   ...Object.entries(tests).map(([toolId,category])=>({toolId,category,name:labels[toolId]||[toolId,toolId] as [string,string]}))
  ];
  const actual=new Map((toolsRows.results||[]).map((x:any)=>[x.toolId+":"+x.locale,x]));
  const expanded=catalog.flatMap(tool=>[("ko" as const),("en" as const)].map(locale=>{
   const x:any=actual.get(tool.toolId+":"+locale);
   return {toolId:tool.toolId,category:tool.category,locale,usage:Number(x?.usage)||0,starts:Number(x?.starts)||0,completions:Number(x?.completions)||0,name:tool.name};
  }));
  return json({start,end,totals:totals||{usage:0,starts:0,completions:0},daily:daily.results||[],tools:expanded,categories:cats.results||[],locales:langs.results||[]});
 }catch{return json({error:"사용량 통계를 불러오지 못했습니다. D1 migration 적용 여부를 확인해 주세요."},503)}
}
