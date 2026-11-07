import type {Metadata} from "next";
import EQExperience from "../../../components/EQExperience";
export const metadata:Metadata={title:"나의 감성지능(EQ) 결과 심층 분석 | UTILWISE",description:"나의 EQ 6개 영역별 점수와 강점, 성장 포인트, 관계·업무·스트레스 대응 및 7일 실천 가이드를 확인해 보세요.",robots:{index:false,follow:true},alternates:{canonical:"/eq/result"},openGraph:{title:"감성지능(EQ) 테스트 결과보기",description:"나의 감성지능 6개 영역별 분석과 맞춤형 성장 가이드를 확인해 보세요.",url:"https://utilwise.kr/eq/result",siteName:"UTILWISE",locale:"ko_KR",type:"website"},twitter:{card:"summary",title:"감성지능(EQ) 테스트 결과보기",description:"나의 EQ 영역별 분석과 성장 가이드를 확인해 보세요."}};
export default function Page(){return <EQExperience mode="result"/>}
