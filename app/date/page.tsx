import type {Metadata} from "next";
import DateCalculator from "../../components/DateCalculator";
import {CalculatorShell} from "../tools";
export const metadata:Metadata={title:"날짜 차이 계산기 | 디데이·근무일·만 나이 계산 - UTILWISE",description:"두 날짜 사이 며칠인지 계산하고 디데이, 날짜 더하기·빼기, 주말 및 선택 공휴일을 제외한 근무일, 만 나이와 태어난 지 며칠을 확인하세요.",alternates:{canonical:"/date",languages:{"ko-KR":"/date","en":"/en/date"}},openGraph: { title: "날짜 계산하기", description: "날짜 사이 기간과 디데이, 근무일, 만 나이를 간편하게 계산해 보세요.", url:"https://utilwise.kr/date",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <CalculatorShell title="날짜 계산기" desc="날짜 사이 기간부터 D-day, 날짜 더하기·빼기, 근무일, 만 나이까지 간편하게 계산하세요."><DateCalculator lang="ko"/></CalculatorShell>}
