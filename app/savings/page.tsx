import type { Metadata } from "next";
import { Savings, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "예금·적금 이자 계산기 | 세후 만기 수령액 - UTILWISE",
  description: "예금과 적금의 납입액, 금리, 기간을 입력해 세전 이자와 이자 세금, 세후 만기 수령액을 비교하세요.",
  alternates: { canonical: "/savings", languages: { "ko-KR": "/savings", en: "/en/savings" } },
  openGraph: { title: "예금·적금 이자 계산하기", description: "저축 금액과 금리, 기간을 입력해 예상 이자와 만기 수령액을 계산해 보세요.", url: "https://utilwise.kr/savings", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="예금·적금 이자 계산기" desc="저축 금액과 금리, 기간을 입력해 만기 수령액을 계산하세요."><Savings /></CalculatorShell>;
}
