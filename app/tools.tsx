"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

const won=(n:number)=>Math.round(n).toLocaleString("ko-KR")+"원";
const num=(s:string)=>Math.max(0,Number(s)||0);
function Field({label,value,onChange,suffix="",step="1",type="number"}:{label:string,value:string,onChange:(v:string)=>void,suffix?:string,step?:string,type?:string}){
 return <div className="field"><label>{label}</label><div style={{display:"flex",alignItems:"center",gap:8}}><input type={type} min="0" step={step} value={value} onChange={e=>onChange(e.target.value)}/>{suffix&&<span className="hint">{suffix}</span>}</div></div>
}
function Result({title,value,rows=[]}:{title:string,value:string,rows?:[string,string][]}){
 return <div className="result"><small>{title}</small><strong>{value}</strong>{rows.map(([a,b])=><div className="result-row" key={a}><span>{a}</span><b>{b}</b></div>)}</div>
}
export function Area(){
 const [sqm,setSqm]=useState("84.0"); const p=num(sqm)*0.3025;
 return <><div className="calc-layout"><section className="panel"><h2>면적 입력</h2><Field label="제곱미터 (㎡)" value={sqm} onChange={setSqm} suffix="㎡" step="0.01"/><p className="hint">1평은 약 3.305785㎡이며, 평수는 ㎡ × 0.3025로 환산합니다.</p></section><section className="panel"><h2>변환 결과</h2><Result title="평수" value={`${p.toLocaleString("ko-KR",{maximumFractionDigits:2})}평`} rows={[["제곱미터",`${num(sqm).toLocaleString()}㎡`],["평당 환산", "1평 ≈ 3.3058㎡"]]}/></section></div></>
}
export function Loan(){
 const [principal,setPrincipal]=useState("300000000"),[rate,setRate]=useState("4.0"),[years,setYears]=useState("30"),[method,setMethod]=useState("equal");
 const r=num(rate)/1200,n=num(years)*12,P=num(principal);
 const monthly=method==="equal"?(r===0?P/Math.max(n,1):P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)):P/Math.max(n,1)+P*r;
 const total=method==="equal"?monthly*n:P+P*r*(n+1)/2;
 return <div className="calc-layout"><section className="panel"><h2>대출 조건</h2><Field label="대출 원금" value={principal} onChange={setPrincipal} suffix="원"/><Field label="연 이자율" value={rate} onChange={setRate} suffix="%"/><Field label="대출 기간" value={years} onChange={setYears} suffix="년"/><div className="field"><label>상환 방식</label><div className="tabs"><button className={`tab ${method==="equal"?"active":""}`} onClick={()=>setMethod("equal")}>원리금균등</button><button className={`tab ${method==="principal"?"active":""}`} onClick={()=>setMethod("principal")}>원금균등</button></div></div></section><section className="panel"><h2>예상 상환 금액</h2><Result title={method==="equal"?"매월 동일 상환액":"첫 달 예상 상환액"} value={won(monthly)} rows={[["총 상환액",won(total)],["총 이자",won(total-P)],["상환 기간",`${n.toLocaleString()}개월`]]}/><p className="hint">변동금리, 거치기간, 중도상환수수료 및 실제 금융기관의 원 단위 처리 방식은 반영하지 않은 단순 추정치입니다.</p></section></div>
}
const feeRule=(amount:number,kind:string)=>{
 if(kind==="sale"){
  if(amount<50_000_000)return [.006,250000]; if(amount<200_000_000)return [.005,800000]; if(amount<900_000_000)return [.004,Infinity]; if(amount<1_200_000_000)return [.005,Infinity]; if(amount<1_500_000_000)return [.006,Infinity]; return [.007,Infinity];
 }
 if(amount<50_000_000)return [.005,200000]; if(amount<100_000_000)return [.004,300000]; if(amount<600_000_000)return [.003,Infinity]; if(amount<1_200_000_000)return [.004,Infinity]; if(amount<1_500_000_000)return [.005,Infinity]; return [.006,Infinity];
};
export function Brokerage(){
 const [kind,setKind]=useState("sale"),[price,setPrice]=useState("500000000"),[deposit,setDeposit]=useState("10000000"),[rent,setRent]=useState("500000");
 const trade=kind==="sale"?num(price):(num(deposit)+num(rent)*100<50_000_000?num(deposit)+num(rent)*70:num(deposit)+num(rent)*100);
 const [rate,cap]=feeRule(trade,kind); const fee=Math.min(trade*rate,cap);
 return <div className="calc-layout"><section className="panel"><h2>거래 정보</h2><div className="tabs"><button className={`tab ${kind==="sale"?"active":""}`} onClick={()=>setKind("sale")}>매매</button><button className={`tab ${kind==="rent"?"active":""}`} onClick={()=>setKind("rent")}>임대차</button></div>{kind==="sale"?<Field label="매매 금액" value={price} onChange={setPrice} suffix="원"/>:<><Field label="보증금" value={deposit} onChange={setDeposit} suffix="원"/><Field label="월세" value={rent} onChange={setRent} suffix="원"/></>}<p className="hint">주택 기준 기본 상한요율을 적용한 예시입니다. 실제 요율은 거래 지역 및 중개사와의 협의에 따라 달라질 수 있습니다.</p></section><section className="panel"><h2>중개보수 예상 상한</h2><Result title="중개보수 최대 금액" value={won(fee)} rows={[["환산 거래금액",won(trade)],["적용 상한요율",`${(rate*100).toFixed(2)}%`],["부가세", "별도일 수 있음"]]}/><div className="notice">법정 상한 이내에서 중개보수는 협의로 결정됩니다. 지역별 조례 및 거래 유형을 반드시 확인하세요.</div></section></div>
}
export function Salary(){
 const [annual,setAnnual]=useState("50000000");
 const monthly=num(annual)/12;
 const pension=monthly*.0475;
 const health=monthly*.03595, care=health*(.9448/7.19), employment=monthly*.009;
 // Simplified annualized tax estimate using 2026 general progressive brackets and basic earned-income deduction.
 const gross=num(annual), earned=Math.max(0,gross-(gross<=5_000_000?gross*.7:gross<=15_000_000?3_500_000+(gross-5_000_000)*.4:gross<=45_000_000?7_500_000+(gross-15_000_000)*.15:gross<=100_000_000?12_000_000+(gross-45_000_000)*.05:14_750_000+(gross-100_000_000)*.02));
 const taxable=Math.max(0,earned-1_500_000);
 const brackets:[[number,number],... [number,number][]]=[[14_000_000,.06],[50_000_000,.15],[88_000_000,.24],[150_000_000,.35],[300_000_000,.38],[500_000_000,.40],[1_000_000_000,.42],[Infinity,.45]];
 let prev=0,tax=0; for(const [limit,rr] of brackets){const part=Math.max(0,Math.min(taxable,limit)-prev);tax+=part*rr;prev=limit;if(taxable<=limit)break;}
 const credit=Math.min(tax*.55,740000); const annualTax=Math.max(0,tax-credit); const localTax=annualTax*.1;
 const monthlyTax=(annualTax+localTax)/12;
 const total=pension+health+care+employment+monthlyTax;
 return <div className="calc-layout"><section className="panel"><h2>급여 정보</h2><Field label="연봉 (세전)" value={annual} onChange={setAnnual} suffix="원"/><p className="hint">세금은 부양가족 수, 비과세 급여, 공제 항목 등에 따라 달라집니다. 현재 결과는 표준 조건의 단순 추정치입니다.</p></section><section className="panel"><h2>예상 실수령액</h2><Result title="월 예상 실수령액 (간이 추정)" value={won(monthly-total)} rows={[["월 세전 급여",won(monthly)],["국민연금",won(pension)],["건강보험",won(health)],["장기요양보험",won(care)],["고용보험",won(employment)],["소득세·지방소득세 추정",won(monthlyTax)]]}/><div className="notice">세액은 공제·가족 수·비과세 급여·연말정산 등에 따라 달라집니다. 정확한 월 원천징수액은 국세청 홈택스 간이세액표 조회를 이용하세요.</div></section></div>
}
export function Severance(){
 const [salary,setSalary]=useState("4000000"),[bonus,setBonus]=useState("0"),[days,setDays]=useState("1095");
 const daily=(num(salary)*3+num(bonus))/90; const estimate=daily*30*(num(days)/365);
 return <div className="calc-layout"><section className="panel"><h2>근무 정보</h2><Field label="퇴직 전 3개월 월 평균 급여" value={salary} onChange={setSalary} suffix="원"/><Field label="최근 1년 상여금 총액 (참고)" value={bonus} onChange={setBonus} suffix="원"/><Field label="총 재직일수" value={days} onChange={setDays} suffix="일"/><p className="hint">단순 추정용 입력입니다. 정확한 평균임금은 퇴직 전 3개월 임금 총액과 해당 기간의 실제 총 일수로 산정합니다.</p></section><section className="panel"><h2>예상 퇴직금</h2><Result title="세전 예상 퇴직금" value={won(estimate)} rows={[["추정 1일 평균임금",won(daily)],["계속근로기간",`${(num(days)/365).toFixed(2)}년`],["퇴직소득세", "미반영"]]}/><div className="notice">실제 퇴직금은 평균임금 산정 제외기간, 통상임금, 상여금·연차수당 등의 반영 여부에 따라 달라질 수 있습니다.</div></section></div>
}
export function CalculatorShell({title,desc,children}:{title:string,desc:string,children:React.ReactNode}){
 return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><Link href="/" className="sub">← 전체 도구</Link></header><section className="wrap section"><div className="eyebrow">UTILWISE CALCULATOR</div><h1 style={{fontSize:32,letterSpacing:"-1px",margin:"12px 0 8px"}}>{title}</h1><p className="sub">{desc}</p>{children}<div className="footer">계산 결과는 참고용이며 실제 거래·세금·금융 판단 전 관련 기관의 최신 기준을 확인하세요.</div></section></main>
}
