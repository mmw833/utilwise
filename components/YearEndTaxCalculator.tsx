"use client";

import { useMemo, useState } from "react";

const won = (value: number) => Math.round(value).toLocaleString("ko-KR") + "원";
const amount = (value: string) => Math.max(0, Number(value) || 0);

function earnedIncomeDeduction(pay: number) {
  let deduction = 0;
  if (pay <= 5_000_000) deduction = pay * 0.7;
  else if (pay <= 15_000_000) deduction = 3_500_000 + (pay - 5_000_000) * 0.4;
  else if (pay <= 45_000_000) deduction = 7_500_000 + (pay - 15_000_000) * 0.15;
  else if (pay <= 100_000_000) deduction = 12_000_000 + (pay - 45_000_000) * 0.05;
  else deduction = 14_750_000 + (pay - 100_000_000) * 0.02;
  return Math.min(20_000_000, deduction);
}

function progressiveTax(base: number) {
  const brackets: [number, number][] = [
    [14_000_000, 0.06],
    [50_000_000, 0.15],
    [88_000_000, 0.24],
    [150_000_000, 0.35],
    [300_000_000, 0.38],
    [500_000_000, 0.4],
    [1_000_000_000, 0.42],
    [Infinity, 0.45],
  ];
  let previous = 0;
  let tax = 0;
  for (const [limit, rate] of brackets) {
    const taxable = Math.max(0, Math.min(base, limit) - previous);
    tax += taxable * rate;
    if (base <= limit) break;
    previous = limit;
  }
  return tax;
}

function earnedIncomeTaxCredit(tax: number, grossPay: number) {
  const calculated = tax <= 1_300_000 ? tax * 0.55 : 715_000 + (tax - 1_300_000) * 0.3;
  let cap = 740_000;
  if (grossPay > 33_000_000 && grossPay <= 70_000_000) {
    cap = Math.max(660_000, 740_000 - (grossPay - 33_000_000) * 0.008);
  } else if (grossPay > 70_000_000 && grossPay <= 120_000_000) {
    cap = Math.max(500_000, 660_000 - (grossPay - 70_000_000) * 0.5);
  } else if (grossPay > 120_000_000) {
    cap = Math.max(200_000, 500_000 - (grossPay - 120_000_000) * 0.5);
  }
  return Math.min(calculated, cap);
}

function Input({ label, value, onChange, hint, suffix = "원" }: {
  label: string; value: string; onChange: (value: string) => void; hint?: string; suffix?: string;
}) {
  return <div className="field">
    <label>{label}</label>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="number" min="0" step="10000" value={value} onChange={event => onChange(event.target.value)} />
      <span className="hint">{suffix}</span>
    </div>
    {hint && <p className="hint" style={{ margin: 0 }}>{hint}</p>}
  </div>;
}

export default function YearEndTaxCalculator() {
  const [salary, setSalary] = useState("50000000");
  const [nonTaxable, setNonTaxable] = useState("0");
  const [withheld, setWithheld] = useState("1800000");
  const [dependents, setDependents] = useState("1");
  const [nationalPension, setNationalPension] = useState("0");
  const [pensionSavings, setPensionSavings] = useState("0");
  const [irp, setIrp] = useState("0");

  const result = useMemo(() => {
    const annualSalary = amount(salary);
    const annualNonTaxable = Math.min(annualSalary, amount(nonTaxable));
    const grossPay = Math.max(0, annualSalary - annualNonTaxable);
    const earnedAmount = Math.max(0, grossPay - earnedIncomeDeduction(grossPay));
    const personalDeduction = Math.min(20, Math.max(1, Math.floor(amount(dependents)))) * 1_500_000;
    const publicPensionDeduction = Math.min(earnedAmount, amount(nationalPension));
    const taxBase = Math.max(0, earnedAmount - personalDeduction - publicPensionDeduction);
    const calculatedTax = progressiveTax(taxBase);
    const earnedCredit = Math.min(calculatedTax, earnedIncomeTaxCredit(calculatedTax, grossPay));
    const pensionSavingsEligible = Math.min(6_000_000, amount(pensionSavings));
    const irpEligible = Math.min(9_000_000 - pensionSavingsEligible, amount(irp));
    const pensionLimit = pensionSavingsEligible + irpEligible;
    const pensionRate = grossPay <= 55_000_000 ? 0.15 : 0.12;
    const pensionCredit = Math.min(Math.max(0, calculatedTax - earnedCredit), pensionLimit * pensionRate);
    const estimatedDecisionTax = Math.max(0, calculatedTax - earnedCredit - pensionCredit);
    const paidTax = amount(withheld);
    const difference = paidTax - estimatedDecisionTax;
    const localTaxDifference = difference * 0.1;
    return {
      grossPay, earnedAmount, personalDeduction, publicPensionDeduction, taxBase,
      calculatedTax, earnedCredit, pensionCredit, estimatedDecisionTax, paidTax,
      incomeTaxDifference: difference, localTaxDifference, totalDifference: difference + localTaxDifference,
      pensionRate,
    };
  }, [salary, nonTaxable, withheld, dependents, nationalPension, pensionSavings, irp]);

  const isRefund = result.totalDifference >= 0;
  const valid = amount(salary) > 0 && amount(withheld) >= 0 && amount(dependents) >= 1;

  return <div className="year-end-tax">
    <div className="calc-layout">
      <section className="panel">
        <h2>기본 정보 입력</h2>
        <Input label="① 연간 총급여" value={salary} onChange={setSalary} hint="세전 연봉과 상여금 등 과세 대상 급여 합계" />
        <Input label="② 연간 비과세 급여" value={nonTaxable} onChange={setNonTaxable} hint="급여명세서의 식대·자가운전보조금 등 비과세 금액 합계. 모르면 0원" />
        <Input label="③ 올해 미리 낸 소득세" value={withheld} onChange={setWithheld} hint="급여명세서의 소득세 누계 또는 연말까지 예상액. 지방소득세는 제외" />
        <div className="field">
          <label>④ 기본공제 대상 가족 수 (본인 포함)</label>
          <select value={dependents} onChange={event => setDependents(event.target.value)}>
            {Array.from({ length: 8 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count}명</option>)}
          </select>
          <p className="hint">본인은 반드시 포함하고, 소득·나이 등 기본공제 요건을 충족하는 가족만 더해 주세요.</p>
        </div>
        <details style={{ borderTop: "1px solid #e5eaf0", paddingTop: 16, marginTop: 20 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14 }}>추가 정보 입력 (선택)</summary>
          <Input label="⑤ 국민연금 본인 부담액" value={nationalPension} onChange={setNationalPension} hint="올해 급여에서 공제된 국민연금 근로자 부담액 합계. 모르면 0원" />
          <Input label="⑥ 연금저축 납입액" value={pensionSavings} onChange={setPensionSavings} hint="연금저축 세액공제 대상 납입액은 최대 600만원" />
          <Input label="⑦ IRP 납입액" value={irp} onChange={setIrp} hint="연금저축과 합산해 세액공제 대상 납입액 최대 900만원" />
        </details>
        <p className="hint" style={{ marginTop: 18 }}>입력한 금액은 이 브라우저 안에서만 계산하며 서버로 전송하지 않습니다.</p>
      </section>

      <section className="panel">
        <h2>예상 연말정산 결과</h2>
        {!valid ? <div className="notice">총급여와 공제 대상 가족 수를 확인해 주세요.</div> : <>
          <div className="result" style={{ background: isRefund ? "#f1f7fd" : "#fff7ed", borderColor: isRefund ? "#dce9f7" : "#f4dfc7" }}>
            <small>{isRefund ? "예상 환급액" : "예상 추가 납부액"}</small>
            <strong style={{ color: isRefund ? "#245b91" : "#9a5b20" }}>{won(Math.abs(result.totalDifference))}</strong>
            <span className="hint">소득세와 지방소득세 포함 추정</span>
          </div>
          <div className="result-row"><span>예상 결정 소득세</span><b>{won(result.estimatedDecisionTax)}</b></div>
          <div className="result-row"><span>미리 납부한 소득세</span><b>{won(result.paidTax)}</b></div>
          <div className="result-row"><span>소득세 차이</span><b>{won(Math.abs(result.incomeTaxDifference))} {result.incomeTaxDifference >= 0 ? "환급" : "추가 납부"}</b></div>
          <div className="result-row"><span>지방소득세 차이 추정</span><b>{won(Math.abs(result.localTaxDifference))}</b></div>
          <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#f7f8fa" }}>
            <strong style={{ fontSize: 14 }}>계산 과정</strong>
            {[
              ["총급여액", won(result.grossPay)],
              ["근로소득금액", won(result.earnedAmount)],
              ["기본공제", won(result.personalDeduction)],
              ["국민연금 소득공제", won(result.publicPensionDeduction)],
              ["예상 과세표준", won(result.taxBase)],
              ["산출세액", won(result.calculatedTax)],
              ["근로소득세액공제", won(result.earnedCredit)],
              ["연금계좌 세액공제", won(result.pensionCredit)],
            ].map(([label, value]) => <div className="result-row" key={label}><span>{label}</span><b>{value}</b></div>)}
          </div>
        </>}
        <div className="notice">이 결과는 기본공제와 근로소득세액공제, 연금계좌 세액공제만 반영한 간편 추정치입니다. 신용카드, 보험료, 의료비, 교육비, 월세, 주택자금, 기부금, 자녀·장애인 등 추가 공제는 반영하지 않아 실제 환급액과 차이가 날 수 있습니다. 실제 정산은 회사의 원천징수영수증과 국세청 자료를 기준으로 확인하세요.</div>
      </section>
    </div>

    <section className="date-guide" style={{ marginTop: 24 }}>
      <h2>연말정산 환급액은 어떻게 결정될까요?</h2>
      <p>연말정산은 1년 동안 미리 낸 소득세와 각종 공제를 반영해 확정한 세금을 비교하는 과정입니다. 이미 낸 세금이 최종 세금보다 많으면 환급받고, 적으면 추가 납부합니다.</p>
      <h3>계산에 반영한 항목</h3>
      <p>2026년 귀속 근로소득공제, 기본공제, 국민연금 본인 부담액, 누진세율, 근로소득세액공제, 연금계좌 세액공제를 간단히 반영합니다. 지방소득세는 소득세 차액의 10%로 추정합니다.</p>
      <h3>정확한 결과가 필요하다면</h3>
      <p><a href="https://www.hometax.go.kr/" target="_blank" rel="noreferrer">국세청 홈택스</a>의 연말정산 예상세액 계산 서비스를 이용하면 간소화 자료와 공제신고서를 바탕으로 더 구체적으로 확인할 수 있습니다.</p>
      <p style={{ fontSize: 12, color: "#718096" }}>공식 기준: <a href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7870" target="_blank" rel="noreferrer">국세청 연말정산 세액계산방법</a> · <a href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7871" target="_blank" rel="noreferrer">국세청 근로소득공제</a> · <a href="https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1032884481" target="_blank" rel="noreferrer">소득세법 제59조 근로소득세액공제</a></p>
      <p style={{ fontSize: 12, color: "#718096" }}>기준 확인일: 2026년 11월 17일 · 2026년 귀속 근로소득자용 간편 추정 도구</p>
    </section>
  </div>;
}
