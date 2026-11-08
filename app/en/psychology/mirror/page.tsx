import type {Metadata} from "next";
import PsychologyCollection from "../../../../components/PsychologyCollection";
export const metadata:Metadata={title:"How Others See Me vs. Who I Really Am | UTILWISE",description:"Explore the difference between how others see you and how you feel inside through 12 questions.",alternates:{canonical:"/en/psychology/mirror",languages:{"en":"/en/psychology/mirror","ko-KR":"/psychology/mirror"}},openGraph:{title:"How Others See Me vs. Who I Really Am",description:"Explore the difference between how others see you and how you feel inside through 12 questions.",url:"https://utilwise.kr/en/psychology/mirror",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <PsychologyCollection id="mirror" mode="intro" locale="en"/>}
