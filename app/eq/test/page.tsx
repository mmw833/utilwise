import type {Metadata} from "next";
import EQExperience from "../../../components/EQExperience";
export const metadata:Metadata={title:"감성지능(EQ) 테스트 진행 | UTILWISE",robots:{index:false,follow:true},alternates:{canonical:"/eq/test"}};
export default function Page(){return <EQExperience mode="test"/>}
