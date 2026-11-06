import type { Metadata } from "next";
import { Severance, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "퇴직금 계산기 | 예상 퇴직금 계산 - UTILWISE",
  description: "퇴직 전 평균임금과 계속근로기간을 기준으로 세전 예상 퇴직금을 계산하세요. 실제 지급액은 평균임금과 근로기간 산정에 따라 달라질 수 있습니다.",
  alternates: { canonical: "/severance" },
  openGraph: { title: "퇴직금 계산기 - UTILWISE", description: "근속기간과 평균임금으로 예상 퇴직금을 간편하게 계산하세요.", url: "https://utilwise.kr/severance", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="퇴직금 계산기" desc="퇴직 전 평균임금과 근속기간으로 예상 퇴직금을 계산하세요."><Severance /></CalculatorShell>;
}
