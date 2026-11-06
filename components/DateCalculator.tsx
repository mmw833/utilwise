"use client";
import {useMemo,useState} from "react";

type Lang="ko"|"en";
const copy={
 ko:{title:"날짜 계산기",tabs:["기간 계산","D-day","날짜 더하기·빼기","근무일 계산","나이 계산"],start:"시작일",end:"종료일",target:"목표 날짜",base:"기준 날짜",days:"계산할 일수",birth:"생년월일",include:"시작일과 종료일 포함",weekends:"주말 제외",holidays:"제외할 공휴일 날짜 (선택)",holidayHint:"YYYY-MM-DD 형식으로 쉼표로 구분해 입력하세요. 예: 2026-12-25, 2027-01-01",result:"계산 결과",difference:"날짜 차이",inclusive:"양 끝 날짜 포함",remain:"남은 날짜",after:"계산된 날짜",business:"근무일 수",age:"만 나이",lived:"태어난 지",next:"다음 생일까지",weekday:"태어난 요일",daysUnit:"일",years:"세",past:"지난 날짜",future:"남은 날짜",formula:"계산 방법 및 안내",formulaText:"날짜 차이는 달력상의 날짜를 기준으로 계산합니다. 근무일 계산은 선택한 시작일·종료일 범위에서 주말을 제외하고, 직접 입력한 공휴일 날짜도 제외합니다.",notice:"공휴일은 국가·지역 및 사업장에 따라 다르므로 자동으로 확정하지 않습니다. 근무일 계산에서 제외할 공휴일을 직접 입력해 주세요. 시작일·종료일 포함 여부를 선택할 수 있습니다.",faq:"자주 묻는 질문",faq1:"시작일과 종료일을 모두 포함하나요?",faq2:"기본 날짜 차이는 두 날짜 사이의 경과 일수이며, 포함 옵션을 선택하면 양 끝 날짜를 모두 셉니다.",faq3:"공휴일도 자동으로 제외되나요?",faq4:"공휴일은 지역·연도·사업장에 따라 달라 자동 반영하지 않습니다. 제외할 날짜를 직접 입력하면 됩니다.",faq5:"만 나이는 어떻게 계산하나요?",faq6:"생일이 지났는지 여부를 기준으로 생년월일과 오늘 날짜의 연도 차이를 계산합니다.",daysSuffix:"일",go:"계산하기"},
 en:{title:"Date Calculator",tabs:["Date Difference","D-Day","Add / Subtract Days","Business Days","Age Calculator"],start:"Start date",end:"End date",target:"Target date",base:"Base date",days:"Number of days",birth:"Date of birth",include:"Include both start and end dates",weekends:"Exclude weekends",holidays:"Exclude holidays (optional)",holidayHint:"Enter dates as YYYY-MM-DD, separated by commas. Example: 2026-12-25, 2027-01-01",result:"Result",difference:"Date difference",inclusive:"Including both dates",remain:"Days remaining",after:"Calculated date",business:"Business days",age:"Age",lived:"Days lived",next:"Days until next birthday",weekday:"Day of birth",daysUnit:"days",years:"years old",past:"Days elapsed",future:"Days remaining",formula:"How it works",formulaText:"Date differences use calendar days. Business-day calculations exclude weekends in the selected range and any holiday dates you enter.",notice:"Public holidays vary by country, region, year, and employer, so they are not assumed automatically. Enter the holidays you want excluded. You can choose whether to include the start and end dates.",faq:"Frequently asked questions",faq1:"Are both the start and end dates included?",faq2:"By default, the difference is elapsed calendar days. Turn on the include option to count both endpoints.",faq3:"Are public holidays excluded automatically?",faq4:"No. Holidays vary by location, year, and employer. Enter the dates you want to exclude.",faq5:"How is age calculated?",faq6:"Age is calculated using the difference in calendar years, adjusted if the birthday has not occurred yet this year.",daysSuffix:"days",go:"Calculate"}
};
const localToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const dateOf=(s:string)=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const iso=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
const diff=(a:Date,b:Date)=>Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000);
const add=(d:Date,n:number)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
export default function DateCalculator({lang="ko"}:{lang?:Lang}){
 const t=copy[lang],today=localToday();
 const [tab,setTab]=useState(0),[start,setStart]=useState(today),[end,setEnd]=useState(today),[target,setTarget]=useState(today),[base,setBase]=useState(today),[days,setDays]=useState("100"),[birth,setBirth]=useState("1990-01-01"),[inclusive,setInclusive]=useState(false),[weekends,setWeekends]=useState(true),[holidays,setHolidays]=useState("");
 const n=Math.trunc(Number(days)||0),dateDiff=diff(dateOf(start),dateOf(end)),absDiff=Math.abs(dateDiff);
 const targetDiff=diff(dateOf(today),dateOf(target));
 const added=add(dateOf(base),n);
 const holidaySet=useMemo(()=>new Set(holidays.split(",").map(x=>x.trim()).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x))),[holidays]);
 const workdays=useMemo(()=>{let a=dateOf(start),b=dateOf(end);if(a>b)[a,b]=[b,a];let count=0;const offset=inclusive?0:1;for(let i=offset;i<=diff(a,b)-(inclusive?0:1);i++){const d=add(a,i),day=d.getDay(),key=iso(d);if((!weekends||!(day===0||day===6))&&!holidaySet.has(key))count++;}return count;},[start,end,inclusive,weekends,holidaySet]);
 const bd=dateOf(birth),now=dateOf(today);let age=now.getFullYear()-bd.getFullYear();if(now.getMonth()<bd.getMonth()||(now.getMonth()===bd.getMonth()&&now.getDate()<bd.getDate()))age--;
 const nextBirthday=new Date(now.getFullYear(),bd.getMonth(),bd.getDate());if(nextBirthday<now)nextBirthday.setFullYear(now.getFullYear()+1);
 const weekday=new Intl.DateTimeFormat(lang==="ko"?"ko-KR":"en-US",{weekday:"long"}).format(bd);
 const fmt=(d:Date)=>new Intl.DateTimeFormat(lang==="ko"?"ko-KR":"en-US",{year:"numeric",month:"long",day:"numeric"}).format(d);
 const input=(label:string,value:string,onChange:(v:string)=>void)=><div className="field"><label>{label}</label><input type="date" value={value} onChange={e=>onChange(e.target.value)}/></div>;
 const result=(label:string,value:string,rows:[string,string][]=[])=><div className="result"><small>{label}</small><strong>{value}</strong>{rows.map(([a,b])=><div className="result-row" key={a}><span>{a}</span><b>{b}</b></div>)}</div>;
 return <div className="date-calculator">
 <section className="panel"><h2>{t.title}</h2><div className="tabs">{t.tabs.map((label,i)=><button type="button" key={label} className={`tab ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{label}</button>)}</div>
 {tab===0&&<>{input(t.start,start,setStart)}{input(t.end,end,setEnd)}<label className="date-check"><input type="checkbox" checked={inclusive} onChange={e=>setInclusive(e.target.checked)}/>{t.include}</label></>}
 {tab===1&&input(t.target,target,setTarget)}
 {tab===2&&<>{input(t.base,base,setBase)}<div className="field"><label>{t.days}</label><input type="number" value={days} onChange={e=>setDays(e.target.value)}/></div></>}
 {tab===3&&<>{input(t.start,start,setStart)}{input(t.end,end,setEnd)}<label className="date-check"><input type="checkbox" checked={inclusive} onChange={e=>setInclusive(e.target.checked)}/>{t.include}</label><label className="date-check"><input type="checkbox" checked={weekends} onChange={e=>setWeekends(e.target.checked)}/>{t.weekends}</label><div className="field"><label>{t.holidays}</label><textarea rows={3} value={holidays} onChange={e=>setHolidays(e.target.value)} placeholder={t.holidayHint}/><p className="hint">{t.holidayHint}</p></div></>}
 {tab===4&&input(t.birth,birth,setBirth)}
 </section>
 <section className="panel"><h2>{t.result}</h2>
 {tab===0&&result(t.difference,`${absDiff.toLocaleString()} ${t.daysUnit}`,[[t.inclusive,`${(absDiff+(inclusive?1:0)).toLocaleString()} ${t.daysUnit}`],[t.start,start],[t.end,end]])}
 {tab===1&&result(targetDiff===0?"D-Day":targetDiff>0?"D-Day": "D-Day",targetDiff===0?"D-Day":targetDiff>0?`D-${targetDiff.toLocaleString()}`:`D+${Math.abs(targetDiff).toLocaleString()}`,[[t.target,fmt(dateOf(target))],[targetDiff>0?t.future:t.past,`${Math.abs(targetDiff).toLocaleString()} ${t.daysUnit}`]])}
 {tab===2&&result(t.after,fmt(added),[[t.base,fmt(dateOf(base))],[t.days,`${n>0?"+":""}${n.toLocaleString()} ${t.daysUnit}`]])}
 {tab===3&&result(t.business,`${workdays.toLocaleString()} ${t.daysUnit}`,[[t.start,start],[t.end,end],[t.weekends,weekends?(lang==="ko"?"제외":"Excluded"):(lang==="ko"?"포함":"Included")],[t.holidays,`${holidaySet.size} ${lang==="ko"?"개 날짜":"date(s)"}`]])}
 {tab===4&&result(t.age,`${Math.max(0,age)} ${t.years}`,[[t.lived,`${Math.max(0,diff(bd,now)).toLocaleString()} ${t.daysUnit}`],[t.next,`${Math.max(0,diff(now,nextBirthday)).toLocaleString()} ${t.daysUnit}`],[t.weekday,weekday]])}
 </section>
 <section className="date-guide"><h2>{t.formula}</h2><p>{t.formulaText}</p><div className="notice">{t.notice}</div><h3>{t.faq}</h3><p><b>Q. {t.faq1}</b><br/>{t.faq2}</p><p><b>Q. {t.faq3}</b><br/>{t.faq4}</p><p><b>Q. {t.faq5}</b><br/>{t.faq6}</p></section>
 </div>;
}
