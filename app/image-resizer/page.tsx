import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ImageTools from "../../components/ImageTools";
export const metadata: Metadata = {
  title: "무료 이미지 크기 조절기 | 사진 픽셀·해상도 변경 - UTILWISE",
  description: "JPG, PNG, WebP 이미지의 가로와 세로 픽셀을 원하는 크기로 변경하세요. 비율 유지와 여러 이미지 처리 기능을 제공하며 파일은 브라우저에서 처리됩니다.",
  alternates: { canonical: "/image-resizer", languages: { "ko-KR": "/image-resizer", en: "/en/image-resizer" } },
  openGraph: { title: "무료 이미지 크기 조절기", description: "이미지의 가로·세로 픽셀을 원하는 크기로 간편하게 변경하세요.", url: "https://utilwise.kr/image-resizer", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};
export default function Page(){return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher/></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1>무료 이미지 크기 조절기</h1><p className="sub">이미지의 가로·세로 픽셀을 원하는 크기로 변경하고 저장하세요.</p><ImageTools mode="resize" lang="ko"/><div className="image-tool-guide"><h2>이미지 크기 조절이란?</h2><p>이미지 크기 조절은 사진이나 그래픽의 픽셀 너비와 높이를 변경하는 기능입니다. 웹페이지, 블로그, 문서 또는 온라인 게시물에 맞는 크기로 조정할 수 있습니다.</p><h2>사용 방법</h2><ol><li>크기를 변경할 이미지를 선택합니다.</li><li>원하는 가로와 세로 픽셀을 입력합니다.</li><li>비율 유지 옵션을 켜면 이미지가 원래 비율에 맞게 조정됩니다.</li><li>저장 형식을 선택하고 변환된 이미지를 다운로드합니다.</li></ol><p>한 번에 선택한 여러 이미지에 동일한 크기 설정이 적용됩니다. 이미지를 확대하면 원본보다 선명도가 낮아질 수 있습니다. 파일은 브라우저에서 처리되며 서버로 업로드되지 않습니다.</p><h2>관련 온라인 도구</h2><p><Link href="/image-compressor">이미지 압축기</Link>로 파일 용량을 줄일 수 있습니다.</p></div></section></main>}