import type {Metadata} from "next";import BigFiveExperience from "../../../../components/BigFiveExperience";
export const metadata:Metadata={title:"View Your Big Five Personality Test Result | UTILWISE",description:"Explore your UTILWISE Big Five personality test result across openness, conscientiousness, extraversion, agreeableness and emotional stability.",robots:{index:false,follow:true}};
export default function Page(){return <BigFiveExperience mode="result" locale="en"/>}
