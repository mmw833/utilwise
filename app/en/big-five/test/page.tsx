import type {Metadata} from "next";import BigFiveExperience from "../../../../components/BigFiveExperience";
export const metadata:Metadata={title:"Big Five Personality Test | UTILWISE",description:"Answer 50 questions to explore your five-factor personality profile.",robots:{index:false,follow:true}};
export default function Page(){return <BigFiveExperience mode="test" locale="en"/>}
