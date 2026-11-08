import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import PDFTools from "../../components/PDFTools";

export const metadata: Metadata = {
  title: "무료 PDF 합치기 | 여러 PDF 파일 하나로 병합 - UTILWISE",
  description: "여러 PDF 파일을 하나로 합치고 문서 순서를 선택하세요. 브라우저에서 안전하게 처리됩니다.",
  alternates: { canonical: "/pdf-merge", languages: { "ko-KR": "/pdf-merge", en: "/en/pdf-merge" } },
  openGraph: { title: "PDF 합치기 | UTILWISE", description: "여러 PDF 파일을 하나로 합치고 문서 순서를 선택하세요. 브라우저에서 안전하게 처리됩니다.", url: "https://utilwise.kr/pdf-merge", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main ><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>PDF 합치기</h1><p className="sub">여러 PDF 파일을 하나로 합치고 문서 순서를 선택하세요. 브라우저에서 안전하게 처리됩니다.</p><PDFTools mode="merge" lang="ko"/><div className="qr-back"><Link href="/online-tools">다른 온라인 도구 보기 →</Link></div><section className="text-tool-guide"><h2>개인정보 보호를 위한 브라우저 처리</h2><p>파일은 이용자의 기기 안에 머뭅니다. PDF 작업은 브라우저에서 처리되며 UTILWISE 서버로 문서를 전송하거나 저장하지 않습니다. 용량이 큰 파일은 기기의 메모리 상황에 따라 처리 시간이 길어질 수 있습니다.</p></section></section></main>;
}
