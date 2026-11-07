import type {Metadata} from "next";import BigFiveExperience from "../../../../components/BigFiveExperience";
export const metadata:Metadata={
 title:"View Your Big Five Personality Test Result | UTILWISE",
 description:"View your Big Five personality test result across openness, conscientiousness, extraversion, agreeableness and emotional stability.",
 alternates:{canonical:"/en/big-five/result"},
 robots:{index:false,follow:true},
 openGraph:{
  title:"View Your Big Five Personality Test Result",
  description:"Explore your Big Five personality profile and discover your five personality dimensions on UTILWISE.",
  url:"https://utilwise.kr/en/big-five/result",
  siteName:"UTILWISE",
  locale:"en_US",
  type:"website"
 },
 twitter:{
  card:"summary",
  title:"View Your Big Five Personality Test Result",
  description:"Explore your Big Five personality profile on UTILWISE."
 }
};
export default function Page(){return <BigFiveExperience mode="result" locale="en"/>}
