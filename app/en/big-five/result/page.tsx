import type {Metadata} from "next";import BigFiveExperience from "../../../../components/BigFiveExperience";
export const metadata:Metadata={title:"My Big Five Personality Results | UTILWISE",description:"Review your scores and descriptions across five personality dimensions.",robots:{index:false,follow:true}};
export default function Page(){return <BigFiveExperience mode="result" locale="en"/>}
