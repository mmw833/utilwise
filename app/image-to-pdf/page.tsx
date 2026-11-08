import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import PDFTools from "../../components/PDFTools";

export const metadata: Metadata = {
  title: "이미지 PDF 변환 | JPG·PNG를 PDF로 무료 변환 - UTILWISE",
  description: "JPG, PNG, WebP 이미지를 선택한 순서대로 하나의 PDF 파일로 변환하세요.",
  alternates: { canonical: "/image-to-pdf", languages: { "ko-KR": "/image-to-pdf", en: "/en/image-to-pdf" } },
  openGraph: { title: "이미지를 PDF로 변환 | UTILWISE", description: "JPG, PNG, WebP 이미지를 선택한 순서대로 하나의 PDF 파일로 변환하세요.", url: "https://utilwise.kr/image-to-pdf", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main ><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>이미지를 PDF로 변환</h1><p className="sub">JPG, PNG, WebP 이미지를 선택한 순서대로 하나의 PDF 파일로 변환하세요.</p><PDFTools mode="images" lang="ko"/><div className="qr-back"><Link href="/online-tools">다른 온라인 도구 보기 →</Link></div><section className="text-tool-guide"><h2>개인정보 보호를 위한 브라우저 처리</h2><p>파일은 이용자의 기기 안에 머뭅니다. PDF 작업은 브라우저에서 처리되며 UTILWISE 서버로 문서를 전송하거나 저장하지 않습니다. 용량이 큰 파일은 기기의 메모리 상황에 따라 처리 시간이 길어질 수 있습니다.</p></section></section></main>;
}
