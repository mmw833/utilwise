"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
type Row={date:string;usage:number;starts:number;completions:number};
type Tool={toolId:string;category:string;locale:string;usage:number;starts:number;completions:number;name:[string,string]};
type Data={start:string;end:string;totals:{usage:number;starts:number;completions:number};daily:Row[];tools:Tool[];categories:{category:string;usage:number}[];locales:{locale:string;usage:number}[]};
const fmt=(v:unknown)=>new Intl.NumberFormat("ko-KR").format(Number(v)||0);
const names:Record<string,string>={"calculator":"계산기","online-tool":"온라인 도구","personality-test":"성격테스트","psychology-test":"심리테스트"};
function date(d:Date){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)}
export default function AdminToolUsageAnalytics(){
 const [period,setPeriod]=useState<"7"|"30"|"all">("30"),[data,setData]=useState<Data|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const from=period==="all"?"2020-01-01":(()=>{const d=new Date();d.setDate(d.getDate()-Number(period)+1);return date(d)})();const r=await fetch("/api/analytics/tool-usage?start="+from+"&end="+date(new Date()),{cache:"no-store"});if(r.status===401){location.assign("/admin/blog/login");return}const j=await r.json();if(!r.ok)throw Error(j.error||"통계를 불러오지 못했습니다.");setData(j)}catch(e){setError(e instanceof Error?e.message:"통계를 불러오지 못했습니다.")}finally{setLoading(false)}},[period]);
 useEffect(()=>{void load()},[load]);
 const ranked=useMemo(()=>{const m=new Map<string,Tool>();for(const x of data?.tools||[]){const a=m.get(x.toolId)||{...x,usage:0,starts:0,completions:0};a.usage+=Number(x.usage)||0;a.starts+=Number(x.starts)||0;a.completions+=Number(x.completions)||0;m.set(x.toolId,a)}return [...m.values()].sort((a,b)=>b.usage-a.usage)},[data]);
 const max=Math.max(1,...(data?.daily||[]).map(x=>Number(x.usage)||0)),total=Number(data?.totals.usage)||0;
 return <section className="uw-usage">
  <header className="uw-usage-head"><div><h2>도구 사용량 분석</h2><p>실제 기능 실행과 테스트 완료 기준 · 한국시간</p></div><nav>{(["7","30","all"] as const).map(x=><button key={x} className={period===x?"active":""} onClick={()=>setPeriod(x)}>{x==="all"?"전체 기간":`최근 ${x}일`}</button>)}</nav></header>
  {error&&<p className="uw-usage-error">{error}</p>}
  {loading?<p className="uw-usage-muted">통계를 불러오는 중입니다…</p>:data&&<>
   <div className="uw-usage-kpis"><article><span>전체 사용 완료</span><b>{fmt(total)}회</b><small>선택 기간 합계</small></article><article><span>테스트 시작</span><b>{fmt(data.totals.starts)}회</b><small>시작 이벤트</small></article><article><span>테스트 완료</span><b>{fmt(data.totals.completions)}회</b><small>결과 생성 완료</small></article><article><span>테스트 완료율</span><b>{fmt(data.totals.starts?Math.round(data.totals.completions/data.totals.starts*100):0)}%</b><small>시작 이벤트 대비</small></article></div>
   <section className="uw-usage-panel"><h3>날짜별 사용량</h3><p className="uw-usage-muted">{data.start} ~ {data.end}</p>{data.daily.length===0?<p className="uw-usage-empty">아직 기록이 없습니다. 사용량 수집이 적용된 뒤부터 표시됩니다.</p>:<div className="uw-usage-bars">{data.daily.map(x=><div key={x.date} title={x.date+" "+fmt(x.usage)+"회"}><b>{fmt(x.usage)}</b><i style={{height:Math.max(3,Number(x.usage)/max*100)+"%"}}/><small>{x.date.slice(5)}</small></div>)}</div>}</section>
   <div className="uw-usage-grid"><section className="uw-usage-panel"><h3>인기 도구 TOP 20</h3>{ranked.length===0?<p className="uw-usage-empty">집계된 사용 기록이 없습니다.</p>:<ol className="uw-usage-rank">{ranked.slice(0,20).map((x,i)=><li key={x.toolId}><em>{i+1}</em><span><b>{x.name[0]}</b><small>{names[x.category]||x.category} · {x.name[1]}</small></span><strong>{fmt(x.usage)}회</strong></li>)}</ol>}</section>
   <section className="uw-usage-panel"><h3>카테고리별 사용량</h3>{Object.entries(names).map(([key,label])=>{const n=Number(data.categories.find(x=>x.category===key)?.usage)||0;return <div className="uw-usage-cat" key={key}><span>{label}</span><b>{fmt(n)}회</b><i><em style={{width:(total?n/total*100:0)+"%"}}/></i></div>})}<h3 className="uw-usage-locale-title">언어별 사용량</h3><p>한국어 <b>{fmt(data.locales.find(x=>x.locale==="ko")?.usage)}회</b></p><p>English <b>{fmt(data.locales.find(x=>x.locale==="en")?.usage)}회</b></p></section></div>
   <p className="uw-usage-note">개인별 답변·입력값·IP 주소는 저장하지 않습니다. 과거 사용량은 소급 추정하지 않으며, 추적 기능이 적용된 이후의 데이터만 표시합니다.</p>
  </>}
 </section>
}
