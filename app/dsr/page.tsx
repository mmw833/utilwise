import type { Metadata } from "next";
import { DSR, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "DSR 계산기 | 총부채원리금상환비율·대출 여력 - UTILWISE",
  description: "연소득과 기존 대출 원리금, 신규 대출 조건으로 DSR과 예상 대출 여력을 시뮬레이션하세요. 실제 금융기관의 심사 결과를 보장하지 않는 참고용 계산기입니다.",
  alternates: { canonical: "/dsr", languages: { "ko-KR": "/dsr", en: "/en/dsr" } },
  openGraph: { title: "DSR 계산하기", description: "연소득과 대출 상환액을 입력해 총부채원리금상환비율을 계산해 보세요.", url: "https://utilwise.kr/dsr", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="DSR 대출 한도 계산기" desc="연소득과 기존 대출 상환액을 바탕으로 예상 DSR을 확인하세요."><DSR /></CalculatorShell>;
}
