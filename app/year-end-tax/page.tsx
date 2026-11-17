import type { Metadata } from "next";
import { CalculatorShell } from "../tools";
import YearEndTaxCalculator from "@/components/YearEndTaxCalculator";

export const metadata: Metadata = {
  title: "연말정산 환급액 계산기 | 2026년 예상 환급금 간편 계산 - UTILWISE",
  description: "2026년 귀속 연말정산 예상 환급액을 간단히 계산해 보세요. 연봉, 미리 낸 소득세, 부양가족, 연금저축 정보를 입력하면 예상 세액을 확인할 수 있습니다.",
  alternates: { canonical: "/year-end-tax", languages: { "ko-KR": "/year-end-tax" } },
  openGraph: {
    title: "연말정산 환급액 간편 계산기",
    description: "복잡한 자료 없이 기본 정보로 예상 환급액을 간편하게 확인하세요.",
    url: "https://utilwise.kr/year-end-tax",
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website",
  },
};

export default function Page() {
  return <CalculatorShell title="연말정산 환급액 계산기" desc="간단한 급여 정보로 2026년 귀속 예상 환급액을 확인하세요.">
    <YearEndTaxCalculator />
  </CalculatorShell>;
}
