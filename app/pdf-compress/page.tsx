import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import PDFTools from "../../components/PDFTools";

export const metadata: Metadata = {
  title: "PDF 압축 온라인 무료 | PDF 파일 용량 줄이기 - UTILWISE",
  description: "PDF 문서를 브라우저에서 다시 저장하고 문서 메타데이터를 제거해 파일 구조를 최적화하세요. 파일은 서버에 업로드되지 않습니다.",
  alternates: { canonical: "/pdf-compress", languages: { "ko-KR": "/pdf-compress", en: "/en/pdf-compress" } },
  openGraph: { title: "PDF 압축 | UTILWISE", description: "브라우저에서 PDF 문서 구조를 최적화하고 결과 파일 크기를 확인하세요.", url: "https://utilwise.kr/pdf-compress", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>PDF 압축</h1><p className="sub">PDF 문서를 다시 저장해 불필요한 메타데이터를 제거하고 파일 구조를 최적화합니다.</p><PDFTools mode="compress" lang="ko"/><div className="qr-back"><Link href="/online-tools">다른 온라인 도구 보기 →</Link></div><section className="text-tool-guide"><h2>압축 결과 안내</h2><p>현재 기능은 문서 메타데이터 제거와 PDF 구조 최적화를 수행합니다. 스캔 이미지나 사진 자체를 다시 인코딩하지 않으므로 이미지가 많은 PDF는 용량이 거의 줄지 않을 수 있습니다. 원본과 결과 파일 크기를 비교하고, 용량 감소가 없으면 원본을 사용하세요. 파일은 브라우저에서 처리되며 서버로 전송되지 않습니다.</p></section></section></main>;
}
