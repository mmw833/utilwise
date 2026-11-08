import type {Metadata} from "next";
import TextTools from "../../../../components/TextTools";
export const metadata:Metadata={title:"Text Comparison Tool | Compare Documents - UTILWISE",description:"Compare two versions of a document and find added or removed lines. A free online text comparison tool for drafts, revisions, notes, and lists.",alternates:{canonical:"/en/text-tools/text-compare",languages:{"en":"/en/text-tools/text-compare","ko-KR":"/text-tools/text-compare"}},openGraph:{title:"Text Comparison Tool | UTILWISE",description:"Find differences between two text blocks.",url:"https://utilwise.kr/en/text-tools/text-compare",siteName:"UTILWISE",locale:"en_US",type:"website"}};
export default function Page(){return <TextTools mode="compare" english/>}
