import type {Metadata} from "next";
import SpeechTimeCalculator from "../../../components/SpeechTimeCalculator";
export const metadata:Metadata={title:"발표시간 계산기 | 발표 원고 글자 수·발표 연습 녹음 - UTILWISE",description:"3분·5분·10분 발표 원고의 예상 시간을 글자 수와 말하기 속도로 계산하세요. 목표 시간 비교, 도입·본론·마무리 분리, 발표 연습 녹음과 다운로드를 지원합니다.",alternates:{canonical:"/text-tools/speech-time",languages:{"ko-KR":"/text-tools/speech-time","en":"/en/text-tools/speech-time"}},openGraph:{title:"발표시간 계산기 | UTILWISE",description:"원고 글자 수와 말하기 속도로 예상 발표시간을 계산하세요.",url:"https://utilwise.kr/text-tools/speech-time",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <SpeechTimeCalculator/>}
