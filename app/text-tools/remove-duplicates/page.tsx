import type {Metadata} from "next";
import TextTools from "../../../components/TextTools";
export const metadata:Metadata={title:"중복 문장 제거기 | 반복 문장·중복 텍스트 정리 - UTILWISE",description:"글이나 문서에 반복해서 들어간 문장을 찾아 첫 번째 문장만 남기세요. 복사한 메모와 원고의 중복 문장을 브라우저에서 정리하는 무료 도구입니다.",alternates:{canonical:"/text-tools/remove-duplicates",languages:{"ko-KR":"/text-tools/remove-duplicates","en":"/en/text-tools/remove-duplicates"}},openGraph:{title:"중복 문장 제거 | UTILWISE",description:"반복 문장을 브라우저에서 간편하게 제거합니다.",url:"https://utilwise.kr/text-tools/remove-duplicates",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="dedupe"/>}
