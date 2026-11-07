import type {Metadata} from "next";import PsychologyExperience from "../../../components/PsychologyExperience";
export const metadata:Metadata={title:"심리테스트 시작 | 나도 몰랐던 나의 진짜 모습 - UTILWISE",description:"18개 질문에 답하고 나의 심리테스트 결과를 확인해 보세요.",robots:{index:false,follow:true}};
export default function Page(){return <PsychologyExperience mode="test"/>}
