import type {Metadata} from "next";import PsychologyExperience from "../../../components/PsychologyExperience";
export const metadata:Metadata={title:"심리테스트 결과보기 | UTILWISE",description:"나도 몰랐던 나의 진짜 모습 심리테스트 결과를 확인해 보세요.",alternates:{canonical:"/psychology/result"},robots:{index:false,follow:true},openGraph:{title:"나의 심리테스트 결과보기",description:"UTILWISE에서 나의 심리테스트 결과를 확인해 보세요.",url:"https://utilwise.kr/psychology/result",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <PsychologyExperience mode="result"/>}
