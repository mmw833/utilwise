import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import PDFTools from "../../../components/PDFTools";

export const metadata: Metadata = {
  title: "Free PDF Merger | Combine PDF Files Online - UTILWISE",
  description: "Combine multiple PDF files into one document. Files are processed locally in your browser.",
  alternates: { canonical: "/en/pdf-merge", languages: { "ko-KR": "/pdf-merge", en: "/en/pdf-merge" } },
  openGraph: { title: "Merge PDF | UTILWISE", description: "Combine multiple PDF files into one document. Files are processed locally in your browser.", url: "https://utilwise.kr/en/pdf-merge", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>Merge PDF</h1><p className="sub">Combine multiple PDF files into one document. Files are processed locally in your browser.</p><PDFTools mode="merge" lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div><section className="text-tool-guide"><h2>Private PDF processing</h2><p>Your files stay on your device. PDF operations run locally in your browser; UTILWISE does not receive or store your documents. Processing large files may require available device memory.</p></section></section></main>;
}
