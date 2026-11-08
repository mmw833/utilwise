import type {Metadata} from "next";
import TextTools from "../../../../components/TextTools";
export const metadata:Metadata={title:"Duplicate Sentence Remover | UTILWISE",description:"Remove repeated sentences from your text while keeping the first occurrence.",alternates:{canonical:"/en/text-tools/remove-duplicates"},openGraph:{title:"Duplicate Sentence Remover | UTILWISE",description:"Clean up repeated sentences in your text.",url:"https://utilwise.kr/en/text-tools/remove-duplicates",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <TextTools mode="dedupe" english/>}
