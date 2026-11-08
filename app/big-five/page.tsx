import type {Metadata} from "next";import BigFiveExperience from "../../components/BigFiveExperience";
export const metadata:Metadata={title:"무료 빅파이브 성격검사 50문항 | UTILWISE",description:"50개의 질문으로 개방성, 성실성, 외향성, 우호성, 정서적 안정성 등 다섯 가지 성격 차원을 알아보세요.",alternates:{canonical:"/big-five",languages:{"ko-KR":"/big-five","en":"/en/big-five"}},openGraph:{title:"빅5 성격검사하기",description:"50개의 질문으로 나의 다섯 가지 성격 차원을 알아보세요.",url:"https://utilwise.kr/big-five",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <BigFiveExperience mode="intro"/>}
