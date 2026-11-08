import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import PDFTools from "../../components/PDFTools";

export const metadata: Metadata = {
  title: "무료 PDF 회전 | PDF 페이지 방향 변경 - UTILWISE",
  description: "PDF 페이지를 90도, 180도, 270도로 회전하고 새 파일로 저장하세요.",
  alternates: { canonical: "/pdf-rotate", languages: { "ko-KR": "/pdf-rotate", en: "/en/pdf-rotate" } },
  openGraph: { title: "PDF 회전 | UTILWISE", description: "PDF 페이지를 90도, 180도, 270도로 회전하고 새 파일로 저장하세요.", url: "https://utilwise.kr/pdf-rotate", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main ><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>PDF 회전</h1><p className="sub">PDF 페이지를 90도, 180도, 270도로 회전하고 새 파일로 저장하세요.</p><PDFTools mode="rotate" lang="ko"/><div className="qr-back"><Link href="/online-tools">다른 온라인 도구 보기 →</Link></div><section className="text-tool-guide"><h2>개인정보 보호를 위한 브라우저 처리</h2><p>파일은 이용자의 기기 안에 머뭅니다. PDF 작업은 브라우저에서 처리되며 UTILWISE 서버로 문서를 전송하거나 저장하지 않습니다. 용량이 큰 파일은 기기의 메모리 상황에 따라 처리 시간이 길어질 수 있습니다.</p></section></section></main>;
}
