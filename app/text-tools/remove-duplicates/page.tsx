import type {Metadata} from "next";
import TextTools from "../../../components/TextTools";
export const metadata:Metadata={title:"중복 문장 제거 | UTILWISE",description:"텍스트에서 반복된 문장을 찾아 첫 번째 문장만 남기고 정리하세요.",alternates:{canonical:"/text-tools/remove-duplicates"},openGraph:{title:"중복 문장 제거 | UTILWISE",description:"반복 문장을 브라우저에서 간편하게 제거합니다.",url:"https://utilwise.kr/text-tools/remove-duplicates",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="dedupe"/>}
