import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {resultCopy} from "../../data";
import MbtiResult from "./MbtiResult";
type Props={params:Promise<{type:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {type}=await params;const item=resultCopy[type];return {title:item?`${type} ${item.name} | UTILWISE MBTI`:"MBTI 검사 결과 | UTILWISE",description:item?item.intro:"UTILWISE MBTI 성격유형 검사 결과입니다.",alternates:{canonical:`/mbti/result/${type}`},openGraph:{title:item?`${type} · ${item.name}`:"UTILWISE MBTI 결과",description:item?.intro??"나의 성격유형 결과를 확인해 보세요.",url:`https://utilwise.kr/mbti/result/${type}`,siteName:"UTILWISE",locale:"ko_KR",type:"website"}};}
export default async function ResultPage({params}:Props){const {type}=await params;if(!resultCopy[type])notFound();return <MbtiResult type={type}/>;}
