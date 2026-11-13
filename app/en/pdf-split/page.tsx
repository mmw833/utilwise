import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import PDFTools from "../../../components/PDFTools";

export const metadata: Metadata = {
  title: "Split PDF Online | Extract Pages from a PDF File - UTILWISE",
  description: "Split a PDF by selecting page numbers or page ranges, then save the selected pages as a new PDF file. Free browser-based PDF page extractor.",
  alternates: { canonical: "/en/pdf-split", languages: { "ko-KR": "/pdf-split", en: "/en/pdf-split" } },
  openGraph: { title: "Split PDF | UTILWISE", description: "Extract selected page ranges from a PDF and save them as a new document.", url: "https://utilwise.kr/en/pdf-split", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>Split PDF</h1><p className="sub">Extract selected page ranges from a PDF and save them as a new document.</p><PDFTools mode="split" lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div><section className="text-tool-guide"><h2>Private PDF processing</h2><p>Your files stay on your device. PDF operations run locally in your browser; UTILWISE does not receive or store your documents. Processing large files may require available device memory.</p></section></section></main>;
}
