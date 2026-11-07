import type {Metadata} from "next";
import PsychologyCollection from "../../../../components/PsychologyCollection";
export const metadata:Metadata={title:"내 마음속 진짜 욕망은 무엇일까? | UTILWISE",description:"12가지 상황에서 더 끌리는 선택을 골라 나의 핵심 가치와 마음속 우선순위를 발견해 보세요.",alternates:{canonical:"/psychology/desire/result"},robots:{index:false,follow:true},openGraph:{title:"내 마음속 진짜 욕망은 무엇일까?",description:"12가지 상황에서 더 끌리는 선택을 골라 나의 핵심 가치와 마음속 우선순위를 발견해 보세요.",url:"https://utilwise.kr/psychology/desire/result",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <PsychologyCollection id="desire" mode="result" locale="ko"/>}
