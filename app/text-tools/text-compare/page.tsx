import type {Metadata} from "next";
import TextTools from "../../../components/TextTools";
export const metadata:Metadata={title:"텍스트 비교 | UTILWISE",description:"두 텍스트를 비교해 한쪽에만 존재하는 문장과 수정된 부분을 확인하세요.",alternates:{canonical:"/text-tools/text-compare"},openGraph:{title:"텍스트 비교 | UTILWISE",description:"두 문서의 차이를 줄 단위로 비교합니다.",url:"https://utilwise.kr/text-tools/text-compare",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="compare"/>}
