import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import PDFTools from "../../../components/PDFTools";

export const metadata: Metadata = {
  title: "Image to PDF Converter | JPG and PNG to PDF - UTILWISE",
  description: "Convert JPG, PNG, and WebP images into a single PDF document.",
  alternates: { canonical: "/en/image-to-pdf", languages: { "ko-KR": "/image-to-pdf", en: "/en/image-to-pdf" } },
  openGraph: { title: "Image to PDF | UTILWISE", description: "Convert JPG, PNG, and WebP images into a single PDF document.", url: "https://utilwise.kr/en/image-to-pdf", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>Image to PDF</h1><p className="sub">Convert JPG, PNG, and WebP images into a single PDF document.</p><PDFTools mode="images" lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div><section className="text-tool-guide"><h2>Private PDF processing</h2><p>Your files stay on your device. PDF operations run locally in your browser; UTILWISE does not receive or store your documents. Processing large files may require available device memory.</p></section></section></main>;
}
