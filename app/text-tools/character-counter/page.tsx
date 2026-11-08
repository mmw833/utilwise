import type {Metadata} from "next";
import TextTools from "../../../../components/TextTools";
export const metadata:Metadata={title:"글자 수 세기·단어 수 세기 | UTILWISE",description:"자기소개서, 블로그, 문서의 공백 포함·제외 글자 수와 단어 수를 실시간으로 세어보세요.",alternates:{canonical:"/text-tools/character-counter"},openGraph:{title:"글자 수 세기 | UTILWISE",description:"공백 포함·제외 글자 수와 단어 수를 실시간으로 계산합니다.",url:"https://utilwise.kr/text-tools/character-counter",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="counter"/>}
