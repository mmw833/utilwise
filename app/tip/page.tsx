import type { Metadata } from "next";
import TipCalculator from "../../components/TipCalculator";
import { CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "팁 계산기 | 팁 비율 및 인원별 금액 나누기 - UTILWISE",
  description: "결제 금액과 팁 비율을 입력해 팁 금액과 총액을 계산하세요. 여러 명이 나눠 낼 때 1인당 팁과 결제 금액도 확인할 수 있습니다.",
  alternates: { canonical: "/tip", languages: { "ko-KR": "/tip", en: "/en/tip" } },
  openGraph: { title: "팁 계산하기", description: "팁 비율을 선택하고 여러 명의 1인당 결제 금액을 계산하세요.", url: "https://utilwise.kr/tip", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <CalculatorShell title="팁 계산기" desc="결제 금액, 팁 비율, 인원수를 입력해 팁 포함 총액과 1인당 부담액을 계산하세요.">
    <TipCalculator lang="ko" />
  </CalculatorShell>;
}
