import type {Metadata} from "next";import BigFiveExperience from "../../../components/BigFiveExperience";
export const metadata:Metadata={title:"나의 빅파이브 성격검사 결과 | UTILWISE",description:"다섯 가지 성격 차원의 점수와 개인별 해석을 확인해 보세요.",robots:{index:false,follow:true}};
export default function Page(){return <BigFiveExperience mode="result"/>}
