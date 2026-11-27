import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import PDFTools from "../../../components/PDFTools";

export const metadata: Metadata = {
  title: "Compress PDF Online for Free | Optimize PDF File - UTILWISE",
  description: "Optimize a PDF by removing document metadata and re-saving its structure in your browser. Files stay on your device.",
  alternates: { canonical: "/en/pdf-compress", languages: { en: "/en/pdf-compress", "ko-KR": "/pdf-compress" } },
  openGraph: { title: "Compress PDF | UTILWISE", description: "Optimize a PDF document in your browser and compare the resulting file size.", url: "https://utilwise.kr/en/pdf-compress", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>Compress PDF</h1><p className="sub">Re-save a PDF to remove document metadata and optimize its structure.</p><PDFTools mode="compress" lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div><section className="text-tool-guide"><h2>About the result</h2><p>This tool removes document metadata and optimizes the PDF structure. It does not re-encode scanned images or photos, so image-heavy PDFs may show little or no size reduction. Compare the original and output sizes; keep the original if the file does not get smaller. Files are processed locally in your browser.</p></section></section></main>;
}
