import type { Metadata } from "next";
import { Fuel, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "자동차 유류비 계산기 | 연비·주유비 계산 - UTILWISE",
  description: "주행 거리, 자동차 연비(km/L), 리터당 유가를 입력해 1회 주행과 월간·연간 예상 유류비를 계산하세요.",
  alternates: { canonical: "/fuel" },
  openGraph: { title: "자동차 유류비 계산하기", description: "주행 거리와 연비, 유가를 입력해 예상 주유비를 계산해 보세요.", url: "https://utilwise.kr/fuel", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="자동차 유류비 계산기" desc="주행 거리와 연비, 유가를 입력해 예상 주유비를 계산하세요."><Fuel /></CalculatorShell>;
}
