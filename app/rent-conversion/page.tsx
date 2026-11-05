import type { Metadata } from "next";
import { RentConversion, CalculatorShell } from "../tools";
export default function Page() { return <CalculatorShell title="전월세 전환 계산기" desc="보증금과 월세를 입력해 전월세 전환 금액을 비교하세요."><RentConversion /></CalculatorShell>; }

export const metadata: Metadata = { title: "전월세 전환 계산기 | UTILWISE", description: "보증금과 월세, 전월세 전환율을 입력해 예상 전환 금액을 비교합니다." };
