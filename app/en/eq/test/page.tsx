import type {Metadata} from "next";
import EQExperienceEnglish from "../../../../components/EQExperienceEnglish";
export const metadata:Metadata={title:"Emotional Intelligence (EQ) Test | UTILWISE",description:"Answer 36 questions about emotional awareness, regulation, empathy, and relationships.",robots:{index:false,follow:true},alternates:{canonical:"/en/eq/test"}};
export default function Page(){return <EQExperienceEnglish mode="test"/>}
