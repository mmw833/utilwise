import type {Metadata} from "next";
import TextTools from "../../../components/TextTools";
export const metadata:Metadata={title:"글자 수 세기 | 공백 포함·제외 글자 수·단어 수 계산 - UTILWISE",description:"자기소개서 글자 수, 이력서 분량, 블로그 글자 수를 확인하세요. 공백 포함·제외 글자 수와 단어 수를 실시간으로 계산하는 무료 글자 수 세기 도구입니다.",alternates:{canonical:"/text-tools/character-counter",languages:{"ko-KR":"/text-tools/character-counter","en":"/en/text-tools/character-counter"}},openGraph:{title:"글자 수 세기 | UTILWISE",description:"공백 포함·제외 글자 수와 단어 수를 실시간으로 계산합니다.",url:"https://utilwise.kr/text-tools/character-counter",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="counter"/>}
