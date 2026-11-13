import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import PDFTools from "../../components/PDFTools";

export const metadata: Metadata = {
  title: "PDF 분할 | PDF 페이지 추출·범위 나누기 무료 도구 - UTILWISE",
  description: "PDF에서 필요한 페이지 번호나 범위를 선택해 별도의 PDF 파일로 추출하세요. 문서 일부만 분리할 때 사용할 수 있으며 파일은 브라우저에서 처리됩니다.",
  alternates: { canonical: "/pdf-split", languages: { "ko-KR": "/pdf-split", en: "/en/pdf-split" } },
  openGraph: { title: "PDF 분할 | UTILWISE", description: "PDF 페이지 범위를 지정해 필요한 페이지만 추출하고 새 PDF로 저장하세요.", url: "https://utilwise.kr/pdf-split", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main ><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>PDF 분할</h1><p className="sub">PDF 페이지 범위를 지정해 필요한 페이지만 추출하고 새 PDF로 저장하세요.</p><PDFTools mode="split" lang="ko"/><div className="qr-back"><Link href="/online-tools">다른 온라인 도구 보기 →</Link></div><section className="text-tool-guide"><h2>개인정보 보호를 위한 브라우저 처리</h2><p>파일은 이용자의 기기 안에 머뭅니다. PDF 작업은 브라우저에서 처리되며 UTILWISE 서버로 문서를 전송하거나 저장하지 않습니다. 용량이 큰 파일은 기기의 메모리 상황에 따라 처리 시간이 길어질 수 있습니다.</p></section></section></main>;
}
