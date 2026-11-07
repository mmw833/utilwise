import type { Metadata } from "next";
import { Severance, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "퇴직금 계산기 | 예상 퇴직금 계산 - UTILWISE",
  description: "퇴직 전 3개월 임금과 실제 일수, 연간 상여금·연차수당, 재직기간을 반영해 세전 예상 퇴직금을 계산하세요.",
  alternates: { canonical: "/severance" },
  openGraph: { title: "퇴직금 계산하기", description: "평균임금과 근속기간을 바탕으로 예상 퇴직금을 계산해 보세요.", url: "https://utilwise.kr/severance", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="퇴직금 계산기" desc="퇴직 전 평균임금과 근속기간으로 예상 퇴직금을 계산하세요."><Severance /></CalculatorShell>;
}
