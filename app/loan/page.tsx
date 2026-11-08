import type { Metadata } from "next";
import { Loan, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "대출 이자 계산기 | 월 상환금·총이자 계산 - UTILWISE",
  description: "대출 원금, 연 금리, 상환 기간을 입력해 원리금균등·원금균등 방식의 월 상환액과 총 이자를 비교해 보세요.",
  alternates: { canonical: "/loan", languages: { "ko-KR": "/loan", en: "/en/loan" } },
  openGraph: { title: "대출이자 계산하기", description: "대출 원금과 금리, 기간을 입력해 월 상환액과 총 이자를 계산해 보세요.", url: "https://utilwise.kr/loan", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="대출 이자 계산기" desc="대출 원금과 금리, 기간에 따른 월 상환액과 총 이자를 계산하세요."><Loan /></CalculatorShell>;
}
