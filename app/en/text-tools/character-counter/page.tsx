import type {Metadata} from "next";
import TextTools from "../../../../../components/TextTools";
export const metadata:Metadata={title:"Character & Word Counter | UTILWISE",description:"Count characters with or without spaces and words in your text in real time.",alternates:{canonical:"/en/text-tools/character-counter"},openGraph:{title:"Character & Word Counter | UTILWISE",description:"Count characters and words instantly as you type.",url:"https://utilwise.kr/en/text-tools/character-counter",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <TextTools mode="counter" english/>}
