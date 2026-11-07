import type {Metadata} from "next";import BigFiveExperience from "../../../components/BigFiveExperience";
export const metadata:Metadata={title:"빅파이브 성격검사 결과 확인 | UTILWISE",description:"UTILWISE 빅파이브 성격검사 결과를 확인해 보세요. 개방성, 성실성, 외향성, 우호성, 정서 안정성의 다섯 가지 성격 차원을 살펴봅니다.",robots:{index:false,follow:true}};
export default function Page(){return <BigFiveExperience mode="result"/>}
