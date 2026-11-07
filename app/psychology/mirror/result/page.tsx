import type {Metadata} from "next";
import PsychologyCollection from "../../../../components/PsychologyCollection";
export const metadata:Metadata={title:"사람들이 보는 나 vs 진짜 나 | UTILWISE",description:"12가지 질문으로 타인에게 보이는 모습과 나의 속마음을 가볍게 들여다보세요.",alternates:{canonical:"/psychology/mirror/result"},robots:{index:false,follow:true},openGraph:{title:"사람들이 보는 나 vs 진짜 나",description:"12가지 질문으로 타인에게 보이는 모습과 나의 속마음을 가볍게 들여다보세요.",url:"https://utilwise.kr/psychology/mirror/result",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <PsychologyCollection id="mirror" mode="result" locale="ko"/>}
