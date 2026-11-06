import type { Metadata } from "next";
import { RentConversion, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 | 보증금·월세 환산 - UTILWISE",
  description: "보증금 차액과 월세, 전월세 전환율을 입력해 월세 환산액과 보증금 환산액을 계산하세요. 법정 전환율과 실제 계약 조건은 별도로 확인해야 합니다.",
  alternates: { canonical: "/rent-conversion" },
  openGraph: { title: "전월세 전환 계산기 - UTILWISE", description: "보증금과 월세 전환 금액을 간편하게 비교하세요.", url: "https://utilwise.kr/rent-conversion", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="전월세 전환 계산기" desc="보증금과 월세를 입력해 전월세 전환 금액을 비교하세요."><RentConversion /></CalculatorShell>;
}
