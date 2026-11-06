import type { Metadata } from "next";
import { Salary, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 | 월급 세후 금액 - UTILWISE",
  description: "세전 연봉과 비과세 급여, 월 소득세·지방소득세를 입력해 2026년 4대 보험을 반영한 예상 실수령액을 확인하세요.",
  alternates: { canonical: "/salary" },
  openGraph: { title: "연봉 실수령액 계산기 - UTILWISE", description: "연봉 기준 월 예상 실수령액과 공제 항목을 확인하세요.", url: "https://utilwise.kr/salary", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="연봉 실수령액 계산기" desc="연봉을 기준으로 4대 보험과 세금을 고려한 예상 월 실수령액을 확인하세요."><Salary /></CalculatorShell>;
}
