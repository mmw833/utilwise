import type {Metadata} from "next";
import EQExperienceEnglish from "../../../components/EQExperienceEnglish";
export const metadata:Metadata={title:"Free Emotional Intelligence Test | EQ Self-Assessment - UTILWISE",description:"Take a free 36-question EQ self-assessment covering emotional awareness, self-regulation, empathy, relationships, motivation, and conflict.",alternates:{canonical:"/en/eq",languages:{"en":"/en/eq","ko-KR":"/eq"}},openGraph:{title:"Free Emotional Intelligence (EQ) Test | UTILWISE",description:"Explore six dimensions of emotional intelligence with 36 questions.",url:"https://utilwise.kr/en/eq",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <EQExperienceEnglish mode="intro"/>}
