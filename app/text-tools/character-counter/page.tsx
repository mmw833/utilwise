import type {Metadata} from "next";
import TextTools from "../../../components/TextTools";
export const metadata:Metadata={title:"자소서 글자수 세기 | 공백 포함·제외 글자 수·단어 수 계산 - UTILWISE",description:"자기소개서와 이력서 글자수를 공백 포함 또는 제외 기준으로 실시간 계산하세요. 단어 수도 함께 확인할 수 있는 무료 온라인 글자수 세기 도구입니다.",alternates:{canonical:"/text-tools/character-counter",languages:{"ko-KR":"/text-tools/character-counter","en":"/en/text-tools/character-counter"}},openGraph:{title:"글자 수 세기 | UTILWISE",description:"공백 포함·제외 글자 수와 단어 수를 실시간으로 계산합니다.",url:"https://utilwise.kr/text-tools/character-counter",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="counter"/>}
