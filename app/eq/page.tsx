import type {Metadata} from "next";
import EQExperience from "../../components/EQExperience";
export const metadata:Metadata={title:"감성지능(EQ) 테스트 36문항 | UTILWISE",description:"36개 질문으로 자기 감정 인식, 감정 조절, 공감, 대인관계, 자기 동기부여, 갈등 대응을 살펴보고 심층 결과를 확인해 보세요.",alternates:{canonical:"/eq",languages:{"ko-KR":"/eq","en":"/en/eq"}},openGraph:{title:"감성지능(EQ) 테스트하기",description:"6개 영역으로 나의 감정 이해와 관계 습관을 알아보세요.",url:"https://utilwise.kr/eq",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <EQExperience mode="intro"/>}
