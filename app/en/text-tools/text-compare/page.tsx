import type {Metadata} from "next";
import TextTools from "../../../../../components/TextTools";
export const metadata:Metadata={title:"Text Comparison Tool | UTILWISE",description:"Compare two texts and find lines that appear only on one side.",alternates:{canonical:"/en/text-tools/text-compare"},openGraph:{title:"Text Comparison Tool | UTILWISE",description:"Find differences between two text blocks.",url:"https://utilwise.kr/en/text-tools/text-compare",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <TextTools mode="compare" english/>}
