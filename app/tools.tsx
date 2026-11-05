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

export function Savings(){
 const [kind,setKind]=useState("installment"),[amount,setAmount]=useState("300000"),[rate,setRate]=useState("3.5"),[months,setMonths]=useState("12"),[tax,setTax]=useState("15.4");
 const principal=num(amount)*(kind==="installment"?num(months):1);
 const r=num(rate)/1200,m=Math.max(1,Math.floor(num(months)));
 let interest=0;
 if(kind==="deposit") interest=num(amount)*num(rate)/100*m/12;
 else { for(let i=1;i<=m;i++) interest+=num(amount)*r*(m-i); }
 const taxAmount=interest*num(tax)/100, net=interest-taxAmount;
 return <div className="calc-layout"><section className="panel"><h2>저축 조건</h2><div className="tabs"><button className={`tab ${kind==="installment"?"active":""}`} onClick={()=>setKind("installment")}>적금</button><button className={`tab ${kind==="deposit"?"active":""}`} onClick={()=>setKind("deposit")}>예금</button></div><Field label={kind==="installment"?"월 납입액":"예치 금액"} value={amount} onChange={setAmount} suffix="원"/><Field label="연 이자율" value={rate} onChange={setRate} suffix="%" step="0.01"/><Field label="가입 기간" value={months} onChange={setMonths} suffix="개월"/><Field label="이자 과세율" value={tax} onChange={setTax} suffix="%" step="0.1"/><p className="hint">적금은 매월 말 납입하는 단리 방식으로 월별 이자를 합산합니다. 예금은 단리로 계산합니다. 실제 금융상품의 이자 계산·세금은 상품 조건에 따라 다릅니다.</p></section><section className="panel"><h2>만기 예상 금액</h2><Result title="세후 만기 수령액" value={won(principal+net)} rows={[["총 납입 원금",won(principal)],["세전 이자",won(interest)],["이자 세금",won(taxAmount)],["세후 이자",won(net)]]}/></section></div>
}
export function Fuel(){
 const [distance,setDistance]=useState("100"),[efficiency,setEfficiency]=useState("12"),[price,setPrice]=useState("1700"),[days,setDays]=useState("20");
 const liters=num(distance)/Math.max(num(efficiency),.0001),cost=liters*num(price),monthly=cost*num(days);
 return <div className="calc-layout"><section className="panel"><h2>주행 정보</h2><Field label="주행 거리" value={distance} onChange={setDistance} suffix="km" step="0.1"/><Field label="자동차 연비" value={efficiency} onChange={setEfficiency} suffix="km/L" step="0.1"/><Field label="리터당 유가" value={price} onChange={setPrice} suffix="원"/><Field label="월 운행 일수" value={days} onChange={setDays} suffix="일"/><p className="hint">입력한 1회 주행 거리를 매일 운행한다고 가정한 단순 추정입니다.</p></section><section className="panel"><h2>예상 유류비</h2><Result title="1회 주행 유류비" value={won(cost)} rows={[["예상 소비 연료",`${liters.toFixed(2)}L`],["월 예상 유류비",won(monthly)],["연간 예상 유류비",won(monthly*12)]]}/></section></div>
}
export function VAT(){
 const [mode,setMode]=useState("exclusive"),[amount,setAmount]=useState("110000"),[rate,setRate]=useState("10");
 const a=num(amount),r=num(rate)/100,base=mode==="exclusive"?a:a/(1+r),vat=base*r,total=base+vat;
 return <div className="calc-layout"><section className="panel"><h2>금액 입력</h2><div className="tabs"><button className={`tab ${mode==="exclusive"?"active":""}`} onClick={()=>setMode("exclusive")}>공급가액 입력</button><button className={`tab ${mode==="inclusive"?"active":""}`} onClick={()=>setMode("inclusive")}>합계금액 입력</button></div><Field label={mode==="exclusive"?"공급가액":"부가세 포함 합계금액"} value={amount} onChange={setAmount} suffix="원"/><Field label="부가세율" value={rate} onChange={setRate} suffix="%" step="0.1"/><p className="hint">일반과세자의 기본 세율 10%를 기본값으로 제공합니다. 업종·거래 유형에 따라 영세율 또는 면세 등이 적용될 수 있습니다.</p></section><section className="panel"><h2>부가세 계산 결과</h2><Result title="부가세 포함 합계금액" value={won(total)} rows={[["공급가액",won(base)],["부가세",won(vat)],["적용 세율",`${num(rate)}%`]]}/></section></div>
}
export function RentConversion(){
 const [deposit,setDeposit]=useState("300000000"),[monthly,setMonthly]=useState("1000000"),[rate,setRate]=useState("4.5");
 const monthlyFromDeposit=num(deposit)*num(rate)/1200,depositEquivalent=num(monthly)*1200/Math.max(num(rate),.0001);
 return <div className="calc-layout"><section className="panel"><h2>전월세 조건</h2><Field label="전환할 보증금 차액" value={deposit} onChange={setDeposit} suffix="원"/><Field label="월세 금액" value={monthly} onChange={setMonthly} suffix="원"/><Field label="전월세 전환율" value={rate} onChange={setRate} suffix="%" step="0.1"/><p className="hint">입력한 전환율을 이용한 단순 비교 계산입니다. 법정 전환율은 기준금리 및 주택임대차보호법상 기준에 따라 달라질 수 있으므로 계약 전 최신 기준을 확인하세요.</p></section><section className="panel"><h2>전환 예상 결과</h2><Result title="보증금 차액 기준 예상 월세" value={won(monthlyFromDeposit)} rows={[["월세 기준 환산 보증금",won(depositEquivalent)],["적용 전환율",`${num(rate)}%`],["연간 환산 월세",won(num(monthly)*12)]]}/></section></div>
}
export function DSR(){
 const [income,setIncome]=useState("60000000"),[existing,setExisting]=useState("6000000"),[principal,setPrincipal]=useState("200000000"),[rate,setRate]=useState("4.0"),[years,setYears]=useState("30"),[limit,setLimit]=useState("40"),[stress,setStress]=useState("1.5");
 const n=Math.max(1,Math.floor(num(years)*12)),r=(num(rate)+num(stress))/1200,P=num(principal);
 const payment=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),annual=payment*12,dsr= num(income)>0?(num(existing)+annual)/num(income)*100:0;
 const capacity=Math.max(0,num(income)*num(limit)/100-num(existing)),maxMonthly=capacity/12,maxLoan=r===0?maxMonthly*n:maxMonthly*(1-Math.pow(1+r,-n))/r;
 return <div className="calc-layout"><section className="panel"><h2>소득 및 대출 조건</h2><Field label="연소득" value={income} onChange={setIncome} suffix="원"/><Field label="기존 대출 연간 원리금 상환액" value={existing} onChange={setExisting} suffix="원"/><Field label="신규 대출 희망 금액" value={principal} onChange={setPrincipal} suffix="원"/><Field label="대출 금리" value={rate} onChange={setRate} suffix="%" step="0.1"/><Field label="대출 기간" value={years} onChange={setYears} suffix="년"/><Field label="DSR 기준 비율" value={limit} onChange={setLimit} suffix="%" step="1"/><Field label="추가 가산금리(가정)" value={stress} onChange={setStress} suffix="%p" step="0.1"/><p className="hint">가산금리는 사용자가 조정하는 시뮬레이션 입력값이며, 실제 스트레스 DSR 적용 금리·단계·지역·상품별 규제를 자동 판정하지 않습니다.</p></section><section className="panel"><h2>DSR 예상 결과</h2><Result title="입력 조건의 추정 DSR" value={`${dsr.toFixed(2)}%`} rows={[["신규 대출 월 상환액",won(payment)],["신규 대출 연간 상환액",won(annual)],["설정한 DSR 기준",`${num(limit)}%`],["기준 내 추가 연간 상환 여력",won(capacity)],["기준 내 예상 최대 대출액",won(maxLoan)]]}/><div className="notice">참고용 단순 원리금균등 시뮬레이션입니다. 실제 대출 한도는 금융기관 심사, 규제지역, 대출 종류, 만기, 금리 산정 및 스트레스 DSR 등 여러 조건에 따라 달라집니다. 대출 가능 금액으로 확정해 해석하지 마세요.</div></section></div>
}

export function CalculatorShell({title,desc,children}:{title:string,desc:string,children:React.ReactNode}){
 return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><Link href="/" className="sub">← 전체 도구</Link></header><section className="wrap section"><div className="eyebrow">UTILWISE CALCULATOR</div><h1 style={{fontSize:32,letterSpacing:"-1px",margin:"12px 0 8px"}}>{title}</h1><p className="sub">{desc}</p>{children}<div className="footer">계산 결과는 참고용이며 실제 거래·세금·금융 판단 전 관련 기관의 최신 기준을 확인하세요.</div></section></main>
}
