import type {Metadata} from "next";import ZombieExperience from "../../../../components/ZombieExperience";
export const metadata:Metadata={title:"좀비 생존 테스트 시작 | UTILWISE",description:"12가지 좀비 아포칼립스 상황에 답하고 나의 생존 유형을 확인해 보세요.",robots:{index:false,follow:true}};
export default function Page(){return <ZombieExperience mode="test"/>}