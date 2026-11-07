import type { Metadata } from "next";
import VolumeCalculator from "../../components/VolumeCalculator";
import { CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "부피 계산기 | 직육면체·원기둥 부피 및 리터 변환 - UTILWISE",
  description: "가로·세로·높이 또는 원기둥 지름과 높이를 입력해 부피를 계산하고 ㎥, ㎤, 리터(L), 밀리리터(mL)로 변환하세요.",
  alternates: { canonical: "/volume" },
  openGraph: {
    title: "부피 계산하기",
    description: "직육면체와 원기둥의 부피를 계산하고 리터와 세제곱 단위로 변환하세요.",
    url: "https://utilwise.kr/volume",
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website"
  }
};

export default function Page() {
  return <CalculatorShell title="부피 계산기" desc="가로·세로·높이 또는 원기둥의 지름과 높이로 부피를 계산하고 다양한 단위로 변환하세요.">
    <VolumeCalculator lang="ko" />
  </CalculatorShell>;
}
