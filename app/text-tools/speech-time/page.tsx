import type {Metadata} from "next";
import SpeechTimeCalculator from "../../../../components/SpeechTimeCalculator";
export const metadata:Metadata={title:"발표시간 계산기 | 원고 글자 수로 발표시간 계산 - UTILWISE",description:"발표 원고를 입력하고 말하기 속도와 목표 시간을 설정해 예상 발표시간을 계산하세요. 기본·고급 모드와 도입·본론·마무리 시간 관리 기능을 제공합니다.",alternates:{canonical:"/text-tools/speech-time"},openGraph:{title:"발표시간 계산기 | UTILWISE",description:"원고 글자 수와 말하기 속도로 예상 발표시간을 계산하세요.",url:"https://utilwise.kr/text-tools/speech-time",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <SpeechTimeCalculator/>}
