import type { Metadata } from "next";
import { Brokerage, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "부동산 중개수수료 계산기 | 복비 계산 - UTILWISE",
  description: "주택 매매와 전세·월세 거래의 부동산 중개보수 예상 상한액을 계산하세요. 거래금액과 거래 유형에 따른 참고용 계산 결과를 제공합니다.",
  alternates: { canonical: "/brokerage" },
  openGraph: { title: "부동산 중개수수료 계산기 - UTILWISE", description: "매매·전월세 부동산 복비를 간편하게 계산하세요.", url: "https://utilwise.kr/brokerage", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="부동산 중개수수료 계산기" desc="주택 매매·임대차 거래의 중개보수 상한을 계산하세요."><Brokerage /></CalculatorShell>;
}
