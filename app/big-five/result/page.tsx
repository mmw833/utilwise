import type {Metadata} from "next";import BigFiveExperience from "../../../components/BigFiveExperience";
export const metadata:Metadata={
 title:"빅5 성격검사 결과보기 | UTILWISE",
 description:"나의 빅5 성격검사 결과를 확인해 보세요. 개방성, 성실성, 외향성, 우호성, 정서 안정성의 다섯 가지 성격 특성을 알아볼 수 있습니다.",
 alternates:{canonical:"/big-five/result"},
 robots:{index:false,follow:true},
 openGraph:{
  title:"빅5 성격검사 결과보기",
  description:"UTILWISE에서 나의 빅5 성격검사 결과와 다섯 가지 성격 특성을 확인해 보세요.",
  url:"https://utilwise.kr/big-five/result",
  siteName:"UTILWISE",
  locale:"ko_KR",
  type:"website"
 },
 twitter:{
  card:"summary",
  title:"빅5 성격검사 결과보기",
  description:"UTILWISE에서 나의 빅5 성격검사 결과를 확인해 보세요."
 }
};
export default function Page(){return <BigFiveExperience mode="result"/>}
