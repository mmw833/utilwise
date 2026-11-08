import type { Metadata } from "next";
import { Area, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "평수 계산기 | 제곱미터(㎡) 평 변환 - UTILWISE",
  description: "제곱미터(㎡)를 평으로, 평을 제곱미터로 간편하게 변환하세요. 아파트 전용면적과 공급면적 등 부동산 면적 확인에 활용할 수 있습니다.",
  alternates: { canonical: "/area", languages: { "ko-KR": "/area", en: "/en/area" } },
  openGraph: { title: "평수·면적 변환하기", description: "제곱미터(㎡)와 평을 간편하게 변환해 보세요.", url: "https://utilwise.kr/area", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="평수·면적 변환 계산기" desc="제곱미터(㎡)를 평으로, 평을 제곱미터로 간편하게 변환하세요."><Area /></CalculatorShell>;
}
