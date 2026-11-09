import type {Metadata} from "next";import ZombieExperience from "../../../../components/ZombieExperience";
export const metadata:Metadata={title:"좀비 생존 테스트 결과 | UTILWISE",description:"나의 좀비 아포칼립스 생존 유형과 성향별 해석을 확인해 보세요.",robots:{index:false,follow:true}};
export default function Page(){return <ZombieExperience mode="result"/>}