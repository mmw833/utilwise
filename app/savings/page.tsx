import type { Metadata } from "next";
import { Savings, CalculatorShell } from "../tools";
export default function Page() { return <CalculatorShell title="예금·적금 이자 계산기" desc="저축 금액과 금리, 기간을 입력해 만기 수령액을 계산하세요."><Savings /></CalculatorShell>; }

export const metadata: Metadata = { title: "예금·적금 이자 계산기 | UTILWISE", description: "예금과 적금의 예상 이자, 이자 세금, 세후 만기 수령액을 계산합니다." };
