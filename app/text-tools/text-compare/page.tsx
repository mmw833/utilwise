import type {Metadata} from "next";
import TextTools from "../../../components/TextTools";
export const metadata:Metadata={title:"텍스트 비교 도구 | 두 문서 차이·변경된 줄 찾기 - UTILWISE",description:"수정 전후 문서나 두 개의 글을 붙여넣고 서로 다른 줄을 비교하세요. 추가되거나 삭제된 텍스트를 브라우저에서 찾는 무료 텍스트 비교 도구입니다.",alternates:{canonical:"/text-tools/text-compare",languages:{"ko-KR":"/text-tools/text-compare","en":"/en/text-tools/text-compare"}},openGraph:{title:"텍스트 비교 | UTILWISE",description:"두 문서의 차이를 줄 단위로 비교합니다.",url:"https://utilwise.kr/text-tools/text-compare",siteName:"UTILWISE",locale:"ko_KR",type:"website"}};
export default function Page(){return <TextTools mode="compare"/>}
