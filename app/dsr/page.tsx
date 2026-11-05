import type { Metadata } from "next";
import { DSR, CalculatorShell } from "../tools";
export default function Page() { return <CalculatorShell title="DSR 대출 한도 계산기" desc="연소득과 기존 대출 상환액을 바탕으로 예상 DSR을 확인하세요."><DSR /></CalculatorShell>; }

export const metadata: Metadata = { title: "DSR 대출 한도 계산기 | UTILWISE", description: "연소득과 기존 대출 상환액을 바탕으로 DSR과 예상 대출 여력을 간편하게 추정합니다." };
