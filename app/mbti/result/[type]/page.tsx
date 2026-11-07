import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {resultCopy} from "../../data";
import MbtiResult from "./MbtiResult";
type Props={params:Promise<{type:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {type}=await params;const item=resultCopy[type];return {title:item?`${type} ${item.name} · MBTI 검사 결과 확인 | UTILWISE`:"MBTI 검사 결과 확인 | UTILWISE",description:item?`UTILWISE MBTI 검사 결과: ${type} ${item.name}. 성격 특징과 강점, 관계 및 업무 성향을 확인해 보세요.`:"UTILWISE MBTI 성격유형 검사 결과입니다.",alternates:{canonical:`/mbti/result/${type}`},openGraph:{title:item?`${type} ${item.name} · MBTI 검사 결과 확인`:"MBTI 검사 결과 확인",description:item?`UTILWISE에서 ${type} ${item.name} 유형의 성격 특징과 결과를 확인해 보세요.`:"나의 MBTI 검사 결과를 확인해 보세요.",url:`https://utilwise.kr/mbti/result/${type}`,siteName:"UTILWISE",locale:"ko_KR",type:"website"}};}
export default async function ResultPage({params}:Props){const {type}=await params;if(!resultCopy[type])notFound();return <MbtiResult type={type}/>;}
