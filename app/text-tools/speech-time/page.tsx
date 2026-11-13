import type {Metadata} from "next";
import SpeechTimeCalculator from "../../../components/SpeechTimeCalculator";
export const metadata:Metadata={title:"발표시간 계산기 | 5분·10분 발표 원고 시간 계산 - UTILWISE",description:"발표 원고 글자 수와 말하기 속도로 3분·5분·10분 발표 시간을 예상하세요. 목표 시간 비교, 도입·본론·마무리 분리와 발표 연습 녹음을 지원합니다.",alternates:{canonical:"/text-tools/speech-time",languages:{"ko-KR":"/text-tools/speech-time","en":"/en/text-tools/speech-time"}},openGraph:{title:"발표시간 계산기 | UTILWISE",description:"원고 글자 수와 말하기 속도로 예상 발표시간을 계산하세요.",url:"https://utilwise.kr/text-tools/speech-time",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <SpeechTimeCalculator/>}
