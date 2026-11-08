"use client";

import { useMemo, useState } from "react";

type Lang = "ko" | "en";
type Currency = "KRW" | "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

const currencies: Currency[] = ["KRW", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
const copy = {
  ko: {
    bill: "결제 금액", currency: "통화", tipRate: "팁 비율", custom: "직접 입력", people: "인원수",
    result: "계산 결과", tip: "팁 금액", total: "팁 포함 총액", perPerson: "1인당 결제 금액",
    tipPerPerson: "1인당 팁", totalTip: "전체 팁", presets: "추천 비율",
    guide: "팁 계산 방법", formula: "팁 금액 = 결제 금액 × 팁 비율", totalFormula: "총 결제 금액 = 결제 금액 + 팁 금액",
    split: "총액과 팁을 인원수로 나누어 1인당 금액을 계산합니다.",
    example: "예: 결제 금액이 50,000원이고 팁 비율이 15%라면 팁은 7,500원, 팁 포함 총액은 57,500원입니다. 2명이 나누면 1인당 28,750원입니다.",
    faq: "자주 묻는 질문", q1: "팁 비율은 얼마로 설정해야 하나요?", a1: "국가와 업종, 서비스 방식에 따라 다릅니다. 10%, 15%, 18%, 20% 등은 계산을 위한 선택 예시이며 현지 관행이나 영수증의 서비스 요금을 확인하세요.",
    q2: "여러 명이 나눠 낼 수 있나요?", a2: "네. 인원수를 입력하면 팁을 포함한 총액과 팁 금액을 인원수로 나눈 1인당 금액을 보여줍니다.",
    q3: "어떤 통화를 지원하나요?", a3: "KRW, USD, EUR, GBP, JPY, CAD, AUD 표시를 지원합니다. 환율 변환 기능은 아니며 입력한 통화 그대로 계산합니다.",
    note: "팁 관행과 서비스 요금은 국가·지역·업종에 따라 다릅니다. 이 계산기는 선택한 비율로 금액을 산출할 뿐 적정 팁이나 현지 관행을 판단하지 않습니다."
  },
  en: {
    bill: "Bill amount", currency: "Currency", tipRate: "Tip percentage", custom: "Custom", people: "Number of people",
    result: "Your tip breakdown", tip: "Tip amount", total: "Total with tip", perPerson: "Total per person",
    tipPerPerson: "Tip per person", totalTip: "Total tip", presets: "Quick percentages",
    guide: "How tip calculation works", formula: "Tip amount = Bill amount × Tip percentage", totalFormula: "Total = Bill amount + Tip amount",
    split: "The bill and tip are divided evenly by the number of people.",
    example: "Example: On a 50.00 bill with a 15% tip, the tip is 7.50 and the total is 57.50. Split between two people, each pays 28.75.",
    faq: "Frequently asked questions", q1: "What tip percentage should I use?", a1: "It varies by country, industry, and service style. 10%, 15%, 18%, and 20% are examples for calculation only. Check local customs and any service charge on your receipt.",
    q2: "Can I split the bill between people?", a2: "Yes. Enter the number of people to see the tip-inclusive total and tip amount per person.",
    q3: "Which currencies are supported?", a3: "The calculator formats KRW, USD, EUR, GBP, JPY, CAD, and AUD. It does not convert exchange rates; calculations stay in the selected currency.",
    note: "Tipping customs and service charges vary by country, region, and industry. This tool calculates the percentage you choose and does not determine what tip is customary or appropriate."
  }
};

export default function TipCalculator({ lang = "ko" }: { lang?: Lang }) {
  const t = copy[lang];
  const [bill, setBill] = useState("50000");
  const [currency, setCurrency] = useState<Currency>(lang === "ko" ? "KRW" : "USD");
  const [tipRate, setTipRate] = useState("15");
  const [people, setPeople] = useState("2");
  const [customMode, setCustomMode] = useState(false);

  const amount = Math.max(0, Number(bill) || 0);
  const rate = Math.min(100, Math.max(0, Number(tipRate) || 0));
  const count = Math.max(1, Math.floor(Number(people) || 1));
  const tip = useMemo(() => amount * rate / 100, [amount, rate]);
  const total = amount + tip;
  const format = (value: number) => new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "en-US", {
    style: "currency", currency, maximumFractionDigits: currency === "KRW" || currency === "JPY" ? 0 : 2
  }).format(value);

  return <div className="tip-calculator">
    <div className="calc-layout">
      <section className="panel">
        <h2>{t.bill}</h2>
        <div className="field"><label htmlFor="tip-bill">{t.bill}</label><input id="tip-bill" type="number" min="0" step="any" inputMode="decimal" value={bill} onChange={e => setBill(e.target.value)} /></div>
        <div className="field"><label htmlFor="tip-currency">{t.currency}</label><select id="tip-currency" value={currency} onChange={e => setCurrency(e.target.value as Currency)}>{currencies.map(code => <option key={code} value={code}>{code}</option>)}</select></div>
        <div className="field"><label>{t.tipRate} (%)</label>
          <div className="tabs">{[10, 15, 18, 20, 25].map(value => <button type="button" key={value} className={Number(tipRate) === value && !customMode ? "tab active" : "tab"} onClick={() => { setTipRate(String(value)); setCustomMode(false); }}>{value}%</button>)}
          <button type="button" className={customMode ? "tab active" : "tab"} onClick={() => setCustomMode(true)}>{t.custom}</button></div>
          {customMode && <input aria-label={t.tipRate} type="number" min="0" max="100" step="0.1" value={tipRate} onChange={e => setTipRate(e.target.value)} />}
        </div>
        <div className="field"><label htmlFor="tip-people">{t.people}</label><input id="tip-people" type="number" min="1" step="1" inputMode="numeric" value={people} onChange={e => setPeople(e.target.value)} /></div>
        <p className="hint">{t.split}</p>
      </section>
      <section className="panel">
        <h2>{t.result}</h2>
        <div className="result"><small>{t.total}</small><strong>{format(total)}</strong>
          <div className="result-row"><span>{t.bill}</span><b>{format(amount)}</b></div>
          <div className="result-row"><span>{t.totalTip} ({rate}%)</span><b>{format(tip)}</b></div>
          <div className="result-row"><span>{t.tipPerPerson}</span><b>{format(tip / count)}</b></div>
          <div className="result-row"><span>{t.perPerson} ({count})</span><b>{format(total / count)}</b></div>
        </div>
      </section>
    </div>
    <section className="volume-guide">
      <h2>{t.guide}</h2><p>{t.formula}</p><p>{t.totalFormula}</p><p>{t.split}</p>
      <h3>{lang === "ko" ? "계산 예시" : "Example"}</h3><p>{t.example}</p>
      <h3>{t.faq}</h3><p><b>Q. {t.q1}</b><br />{t.a1}</p><p><b>Q. {t.q2}</b><br />{t.a2}</p><p><b>Q. {t.q3}</b><br />{t.a3}</p>
      <div className="notice">{t.note}</div>
    </section>
  </div>;
}
