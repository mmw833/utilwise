import type { Metadata } from "next";
import { Fuel, CalculatorShell } from "../tools";
export default function Page() { return <CalculatorShell title="자동차 유류비 계산기" desc="주행 거리와 연비, 유가를 입력해 예상 주유비를 계산하세요."><Fuel /></CalculatorShell>; }

export const metadata: Metadata = { title: "자동차 유류비 계산기 | UTILWISE", description: "주행 거리, 연비, 유가를 입력해 1회·월간·연간 예상 유류비를 계산합니다." };
