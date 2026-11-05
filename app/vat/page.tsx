import type { Metadata } from "next";
import { VAT, CalculatorShell } from "../tools";
export default function Page() { return <CalculatorShell title="부가세 계산기" desc="공급가액 또는 합계금액을 입력해 부가세를 계산하세요."><VAT /></CalculatorShell>; }

export const metadata: Metadata = { title: "부가세 계산기 | UTILWISE", description: "공급가액 또는 부가세 포함 금액으로 공급가액과 부가세를 계산합니다." };
