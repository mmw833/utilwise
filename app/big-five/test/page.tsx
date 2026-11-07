import type {Metadata} from "next";import BigFiveExperience from "../../../components/BigFiveExperience";
export const metadata:Metadata={title:"빅파이브 성격검사 시작 | UTILWISE",description:"50문항에 답하고 나의 다섯 가지 성격 차원을 확인해 보세요.",robots:{index:false,follow:true}};
export default function Page(){return <BigFiveExperience mode="test"/>}
