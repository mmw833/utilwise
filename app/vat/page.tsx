import type { Metadata } from "next";
import { VAT, CalculatorShell } from "../tools";

export const metadata: Metadata = {
  title: "부가세 계산기 | 공급가액·부가세 포함 금액 - UTILWISE",
  description: "공급가액 또는 부가세 포함 금액을 입력해 공급가액과 부가가치세를 계산하세요. 기본 세율 10% 외의 적용 여부는 거래 유형에 따라 확인해야 합니다.",
  alternates: { canonical: "/vat" },
  openGraph: { title: "부가세 계산기 - UTILWISE", description: "공급가액과 부가세 포함 합계금액을 간편하게 계산하세요.", url: "https://utilwise.kr/vat", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default function Page() {
  return <CalculatorShell title="부가세 계산기" desc="공급가액 또는 합계금액을 입력해 부가세를 계산하세요."><VAT /></CalculatorShell>;
}
