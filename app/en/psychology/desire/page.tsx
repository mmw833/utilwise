import type {Metadata} from "next";
import PsychologyCollection from "../../../../components/PsychologyCollection";
export const metadata:Metadata={title:"What Do I Truly Want? | UTILWISE",description:"Choose what feels closer in 12 everyday situations and discover your core values and inner priorities.",alternates:{canonical:"/en/psychology/desire",languages:{"en":"/en/psychology/desire","ko-KR":"/psychology/desire"}},openGraph:{title:"What Do I Truly Want?",description:"Choose what feels closer in 12 everyday situations and discover your core values and inner priorities.",url:"https://utilwise.kr/en/psychology/desire",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <PsychologyCollection id="desire" mode="intro" locale="en"/>}
