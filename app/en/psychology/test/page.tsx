import type {Metadata} from "next";import PsychologyExperience from "../../../../components/PsychologyExperience";
export const metadata:Metadata={title:"Start the Psychology Quiz | UTILWISE",description:"Answer 18 questions to discover your playful self-discovery result.",robots:{index:false,follow:true}};
export default function Page(){return <PsychologyExperience mode="test" locale="en"/>}
