import type {Metadata} from "next";
import SpeechTimeCalculator from "../../../../../components/SpeechTimeCalculator";
export const metadata:Metadata={title:"Speech Time Calculator | Estimate Presentation Length - UTILWISE",description:"Estimate presentation length from your script, speaking pace, target duration, and pauses. Use basic or advanced mode to plan each section.",alternates:{canonical:"/en/text-tools/speech-time"},openGraph:{title:"Speech Time Calculator | UTILWISE",description:"Estimate your presentation time from your script and speaking pace.",url:"https://utilwise.kr/en/text-tools/speech-time",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <SpeechTimeCalculator english/>}
