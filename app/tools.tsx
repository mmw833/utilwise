"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 const r=num(rate)/1200,n=Math.max(1,Math.floor(num(years)*12)),P=num(principal);
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
 const [annual,setAnnual]=useState("50000000"),[nontaxable,setNontaxable]=useState("0"),[withholding,setWithholding]=useState("0");
 const monthly=num(annual)/12, taxablePay=Math.max(0,monthly-num(nontaxable));
 const pensionBase=Math.min(6_590_000,Math.max(410_000,Math.round(taxablePay/1000)*1000));
 const pension=pensionBase*.0475;
 const health=taxablePay*.03595, care=health*(.9448/7.19), employment=taxablePay*.009;
 const incomeTax=num(withholding), total=pension+health+care+employment+incomeTax;
 return <div className="calc-layout"><section className="panel"><h2>급여 정보</h2><Field label="연봉 (세전)" value={annual} onChange={setAnnual} suffix="원"/><Field label="월 비과세 급여" value={nontaxable} onChange={setNontaxable} suffix="원"/><Field label="월 소득세·지방소득세 합계" value={withholding} onChange={setWithholding} suffix="원"/><p className="hint">급여명세서 또는 국세청 홈택스 간이세액표에서 확인한 월 소득세와 지방소득세 합계를 입력하세요. 기본값 0원은 세금 면제를 뜻하지 않습니다.</p></section><section className="panel"><h2>예상 실수령액</h2><Result title="월 예상 실수령액" value={won(monthly-total)} rows={[[ "월 세전 급여",won(monthly)],["국민연금 (근로자 부담)",won(pension)],["건강보험 (근로자 부담)",won(health)],["장기요양보험",won(care)],["고용보험 (근로자 부담)",won(employment)],["입력한 소득세·지방소득세",won(incomeTax)]]}/><div className="notice">2026년 7월~2027년 6월 국민연금 기준소득월액 상·하한(41만~659만원)을 반영한 간이 계산입니다. 비과세 급여, 실제 보수 산정, 원 단위 절사, 상여금 및 개인별 원천징수 조건에 따라 실제 급여명세서와 다를 수 있습니다.</div></section></div>
}

export function Severance(){
 const [wages,setWages]=useState("12000000"),[bonus,setBonus]=useState("0"),[annualLeave,setAnnualLeave]=useState("0"),[periodDays,setPeriodDays]=useState("92"),[days,setDays]=useState("1095"),[ordinary,setOrdinary]=useState("0");
 const bonusIncluded=num(bonus)*3/12, leaveIncluded=num(annualLeave)*3/12;
 const average=(num(wages)+bonusIncluded+leaveIncluded)/Math.max(1,num(periodDays));
 const daily=Math.max(average,num(ordinary)),estimate=daily*30*(num(days)/365);
 return <div className="calc-layout"><section className="panel"><h2>근무 정보</h2><Field label="퇴직 전 3개월 임금 총액" value={wages} onChange={setWages} suffix="원"/><Field label="퇴직 전 1년간 상여금 총액" value={bonus} onChange={setBonus} suffix="원"/><Field label="퇴직 전전년도 발생·미사용 연차수당 총액" value={annualLeave} onChange={setAnnualLeave} suffix="원"/><Field label="퇴직 전 3개월의 총 일수" value={periodDays} onChange={setPeriodDays} suffix="일"/><Field label="총 재직일수" value={days} onChange={setDays} suffix="일"/><Field label="1일 통상임금 (모르면 0)" value={ordinary} onChange={setOrdinary} suffix="원"/><p className="hint">상여금과 연차수당은 고용노동부 예시 방식에 따라 각 3/12를 반영합니다. 평균임금 산정 제외기간이 있으면 해당 기간과 일수를 별도로 조정해야 합니다.</p></section><section className="panel"><h2>예상 퇴직금</h2><Result title="세전 예상 퇴직금" value={won(estimate)} rows={[[ "1일 평균임금",won(average)],["적용 1일 임금 (평균·통상 중 큰 금액)",won(daily)],["상여금 반영액 (3/12)",won(bonusIncluded)],["연차수당 반영액 (3/12)",won(leaveIncluded)],["계속근로기간",`${(num(days)/365).toFixed(2)}년`],["퇴직소득세", "미반영"]]}/><div className="notice">계산식: 적용 1일 임금 × 30일 × (재직일수 ÷ 365). 실제 평균임금 산정 제외기간, 임금 항목의 포함 여부, 연차수당 귀속 및 통상임금 판단에 따라 결과가 달라집니다. 퇴직소득세는 미반영입니다.</div></section></div>
}


export function Savings(){
 const [kind,setKind]=useState("installment"),[amount,setAmount]=useState("300000"),[rate,setRate]=useState("3.5"),[months,setMonths]=useState("12"),[tax,setTax]=useState("15.4");
 const r=num(rate)/1200,m=Math.max(1,Math.floor(num(months)));
 const principal=num(amount)*(kind==="installment"?m:1);
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
 const monthlyFromDeposit=num(deposit)*num(rate)/1200,depositEquivalent=num(rate)>0?num(monthly)*1200/num(rate):0;
 return <div className="calc-layout"><section className="panel"><h2>전월세 조건</h2><Field label="전환할 보증금 차액" value={deposit} onChange={setDeposit} suffix="원"/><Field label="월세 금액" value={monthly} onChange={setMonthly} suffix="원"/><Field label="전월세 전환율" value={rate} onChange={setRate} suffix="%" step="0.1"/><p className="hint">입력한 전환율을 이용한 단순 비교 계산입니다. 법정 전환율은 기준금리 및 주택임대차보호법상 기준에 따라 달라질 수 있으므로 계약 전 최신 기준을 확인하세요.</p></section><section className="panel"><h2>전환 예상 결과</h2><Result title="보증금 차액 기준 예상 월세" value={won(monthlyFromDeposit)} rows={[["월세 기준 환산 보증금",won(depositEquivalent)],["적용 전환율",`${num(rate)}%`],["연간 환산 월세",won(num(monthly)*12)]]}/></section></div>
}
export function DSR(){
 const [income,setIncome]=useState("60000000"),[existing,setExisting]=useState("6000000"),[principal,setPrincipal]=useState("200000000"),[rate,setRate]=useState("4.0"),[years,setYears]=useState("30"),[limit,setLimit]=useState("40"),[stress,setStress]=useState("1.5");
 const n=Math.max(1,Math.floor(num(years)*12)),r=(num(rate)+num(stress))/1200,P=num(principal);
 const payment=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),annual=payment*12,dsr= num(income)>0?(num(existing)+annual)/num(income)*100:0;
 const capacity=Math.max(0,num(income)*num(limit)/100-num(existing)),maxMonthly=capacity/12,maxLoan=r===0?maxMonthly*n:maxMonthly*(1-Math.pow(1+r,-n))/r;
 return <div className="calc-layout"><section className="panel"><h2>소득 및 대출 조건</h2><Field label="연소득" value={income} onChange={setIncome} suffix="원"/><Field label="기존 대출 연간 원리금 상환액" value={existing} onChange={setExisting} suffix="원"/><Field label="신규 대출 희망 금액" value={principal} onChange={setPrincipal} suffix="원"/><Field label="대출 금리" value={rate} onChange={setRate} suffix="%" step="0.1"/><Field label="대출 기간" value={years} onChange={setYears} suffix="년"/><Field label="DSR 기준 비율" value={limit} onChange={setLimit} suffix="%" step="1"/><Field label="추가 가산금리(가정)" value={stress} onChange={setStress} suffix="%p" step="0.1"/><p className="hint">가산금리는 사용자가 조정하는 시뮬레이션 입력값이며, 실제 스트레스 DSR 적용 금리·단계·지역·상품별 규제를 자동 판정하지 않습니다.</p></section><section className="panel"><h2>DSR 예상 결과</h2><Result title="입력 조건의 추정 DSR" value={`${dsr.toFixed(2)}%`} rows={[["신규 대출 월 상환액",won(payment)],["신규 대출 연간 상환액",won(annual)],["설정한 DSR 기준",`${num(limit)}%`],["기준 내 추가 연간 상환 여력",won(capacity)],["기준 내 예상 최대 대출액",won(maxLoan)]]}/><div className="notice">참고용 단순 원리금균등 시뮬레이션입니다. 실제 대출 한도는 금융기관 심사, 규제지역, 대출 종류, 만기, 금리 산정 및 스트레스 DSR 등 여러 조건에 따라 달라집니다. 대출 가능 금액으로 확정해 해석하지 마세요.</div></section></div>
}

const calculatorGuides: Record<string,{formula:string,example:string,faqs:[string,string][],source:string,sourceLabel:string}> = {
 "/area":{formula:"평 = ㎡ × 0.3025, ㎡ = 평 ÷ 0.3025입니다.",example:"84㎡는 약 25.41평입니다. 전용면적과 공급면적은 구분해서 비교하세요.",faqs:[["1평은 몇 ㎡인가요?","약 3.305785㎡입니다."],["84㎡가 흔히 34평형인가요?","84㎡ 자체는 약 25.41평이며 34평형은 공급면적 기준인 경우가 많습니다."]],source:"https://www.law.go.kr/법령/계량에관한법률",sourceLabel:"국가법령정보센터"},
 "/loan":{formula:"원리금균등 월 상환액은 원금×월이율×(1+월이율)^개월수 ÷ ((1+월이율)^개월수−1)입니다. 원금균등은 매월 같은 원금에 잔액 이자를 더합니다.",example:"원금 3억원, 연 4%, 30년을 입력하면 월 상환액과 총이자를 비교할 수 있습니다.",faqs:[["실제 상환액과 다른 이유는?","변동금리, 거치기간, 납입일, 수수료 및 금융기관의 원 단위 처리 차이 때문입니다."],["금리가 0%이면?","원금을 전체 개월 수로 나누어 계산합니다."]],source:"https://www.fss.or.kr/",sourceLabel:"금융감독원"},
 "/brokerage":{formula:"중개보수 상한은 거래금액×해당 구간 상한요율이며 한도액이 있으면 이를 초과할 수 없습니다. 월세 거래금액은 보증금+월세×100, 5천만원 미만이면 월세×70을 적용합니다.",example:"주택 매매·임대차의 기본 상한요율 기준 예상치이며 지역 조례와 실제 협의 요율에 따라 달라질 수 있습니다.",faqs:[["상한액을 무조건 내나요?","아닙니다. 법정 상한 이내에서 중개의뢰인과 중개사가 협의합니다."],["상가도 같은 요율인가요?","주택 외 부동산은 별도 요율이 적용되므로 물건 유형을 확인해야 합니다."]],source:"https://irts.molit.go.kr/com/cmn/popup/fee/rtecsFeeRtoPopup.do",sourceLabel:"국토교통부 중개보수 요율표"},
 "/salary":{formula:"월 실수령액 = 월 세전 급여−국민연금−건강보험−장기요양보험−고용보험−입력한 소득세·지방소득세입니다.",example:"연봉을 12개월로 나눈 금액에서 2026년 근로자 부담 보험료율을 반영합니다. 비과세 급여와 실제 원천징수 세액을 입력하면 추정 오차를 줄일 수 있습니다.",faqs:[["세금을 직접 입력하는 이유는?","국세청 간이세액은 월 급여와 공제대상 가족 수, 자녀 수 등에 따라 달라져 연봉만으로 확정할 수 없습니다."],["국민연금 상한이 반영되나요?","2026년 7월부터 2027년 6월까지 기준소득월액 41만~659만원을 반영합니다."]],source:"https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7862&mi=6426",sourceLabel:"국세청 근로소득 간이세액표"},
 "/severance":{formula:"퇴직금 = 1일 평균임금(통상임금이 더 높으면 통상임금)×30×재직일수÷365입니다. 평균임금에는 최근 1년 상여금 및 해당 연차수당의 3/12 반영액을 포함할 수 있습니다.",example:"퇴직 전 3개월 임금 총액과 실제 일수, 최근 1년 상여금·연차수당, 재직일수를 입력합니다.",faqs:[["3개월은 항상 90일인가요?","아닙니다. 실제 달력 기간에 따라 89~92일 등으로 달라집니다."],["퇴직소득세가 포함되나요?","아니요. 세전 퇴직금 추정액이며 퇴직소득세는 미반영입니다."]],source:"https://moel.go.kr/retirementpayCal.do",sourceLabel:"고용노동부 퇴직금 계산기"},
 "/savings":{formula:"예금 단리 이자=원금×연이율×개월수÷12. 적금 이자는 매월 납입액에 남은 예치 개월을 곱해 합산합니다.",example:"월 30만원씩 12개월 납입하면 납입 원금은 360만원입니다.",faqs:[["적금 이자가 예금보다 적은 이유는?","원금이 매월 나누어 납입되어 모든 돈이 전체 기간 이자를 받지 않기 때문입니다."],["실제 만기금과 차이가 나나요?","실제 일수, 납입일, 우대금리, 복리 및 세금 처리에 따라 달라집니다."]],source:"https://www.fss.or.kr/",sourceLabel:"금융감독원"},
 "/dsr":{formula:"DSR(%)=연간 모든 대출 원리금 상환액÷연소득×100입니다. 본 도구는 사용자가 입력한 가산금리를 신규 대출 상환액에 반영하는 시뮬레이션입니다.",example:"연소득, 기존 연간 원리금, 신규 대출 조건을 입력해 설정한 DSR 기준 안의 상환 여력을 추정합니다.",faqs:[["계산된 한도만큼 빌릴 수 있나요?","아닙니다. 금융기관 심사와 대출 종류, 만기, 규제 및 스트레스 DSR에 따라 달라집니다."],["스트레스 금리가 자동 적용되나요?","아니요. 입력한 가산금리만 반영하며 실제 규제 조건을 판정하지 않습니다."]],source:"https://www.fsc.go.kr/",sourceLabel:"금융위원회"},
 "/rent-conversion":{formula:"보증금 차액의 월세 환산액=보증금 차액×연 전환율÷12. 월세의 보증금 환산액=월세×12÷연 전환율입니다.",example:"보증금 차액 1억원, 연 4.5%이면 월 환산액은 37만5천원입니다.",faqs:[["입력 전환율은 법정 상한인가요?","아닙니다. 단순 환산용 입력값이며 법정 상한은 계약 시점의 법령과 기준금리를 확인해야 합니다."],["전환율 0%도 가능한가요?","월세의 보증금 환산을 할 수 없으므로 0보다 큰 값을 입력해야 합니다."]],source:"https://www.law.go.kr/법령/주택임대차보호법",sourceLabel:"국가법령정보센터 주택임대차보호법"},
 "/fuel":{formula:"필요 연료(L)=주행거리÷연비. 유류비=필요 연료×리터당 가격입니다.",example:"100km, 연비 12km/L, 리터당 1,700원이면 1회 유류비는 약 14,167원입니다.",faqs:[["왕복은 어떻게 입력하나요?","왕복 전체 거리를 주행거리로 입력하면 됩니다."],["월 유류비는 어떻게 계산하나요?","1회 유류비에 월 운행 일수를 곱한 추정치입니다."]],source:"https://www.opinet.co.kr/",sourceLabel:"한국석유공사 오피넷"},
 "/vat":{formula:"공급가액 입력 시 부가세=공급가액×세율. 합계금액 입력 시 공급가액=합계금액÷(1+세율)입니다.",example:"공급가액 100,000원에 10%를 적용하면 부가세 10,000원, 합계 110,000원입니다.",faqs:[["모든 거래에 10%인가요?","아닙니다. 면세·영세율 및 거래 유형별 예외를 확인해야 합니다."],["신고 납부액과 같은가요?","아닙니다. 매입세액 공제, 신고 조정 및 가산세는 계산하지 않습니다."]],source:"https://www.nts.go.kr/",sourceLabel:"국세청"}
};
function CalculatorGuide({pathname}:{pathname:string}){
 const guide=calculatorGuides[pathname]; if(!guide)return null;
 const faqJson={"@context":"https://schema.org","@type":"FAQPage","mainEntity":guide.faqs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))};
 return <section style={{marginTop:32,padding:24,background:"#f7f8fa",borderRadius:16,lineHeight:1.75}}>
 <h2>계산 방법과 이용 안내</h2><h3>계산 공식</h3><p>{guide.formula}</p><h3>계산 예시</h3><p>{guide.example}</p><h3>자주 묻는 질문</h3>
 {guide.faqs.map(([q,a])=><div key={q} style={{marginTop:14}}><strong>Q. {q}</strong><p>A. {a}</p></div>)}
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJson)}} />
 <p style={{marginTop:20,fontSize:13,color:"#596579"}}>공식 참고 자료: <a href={guide.source} target="_blank" rel="noreferrer">{guide.sourceLabel}</a><br/>기준 확인일: 2026년 11월 6일 · 계산 결과는 참고용입니다.</p></section>;
}

export function CalculatorShell({title,desc,children}:{title:string,desc:string,children:React.ReactNode}){
 const pathname = usePathname();
 const pageUrl = `https://utilwise.kr${pathname}`;
 const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: title,
  description: desc,
  url: pageUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko-KR",
 };
 const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
   { "@type": "ListItem", position: 1, name: "UTILWISE", item: "https://utilwise.kr/" },
   { "@type": "ListItem", position: 2, name: title, item: pageUrl },
  ],
 };
 return <main>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbData)}} />
  <header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><Link href="/" className="sub">← 전체 도구</Link></header>
  <section className="wrap section"><div className="eyebrow">UTILWISE CALCULATOR</div><h1 style={{fontSize:32,letterSpacing:"-1px",margin:"12px 0 8px"}}>{title}</h1><p className="sub">{desc}</p>{children}<CalculatorGuide pathname={pathname}/><div className="footer">계산 결과는 참고용이며 실제 거래·세금·금융 판단 전 관련 기관의 최신 기준을 확인하세요.</div></section>
 </main>;
}
