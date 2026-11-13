import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import PDFTools from "../../../components/PDFTools";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online | Turn PDF 90, 180 or 270 Degrees - UTILWISE",
  description: "Rotate PDF pages by 90, 180, or 270 degrees and save the updated document. Use this free browser-based PDF page rotator.",
  alternates: { canonical: "/en/pdf-rotate", languages: { "ko-KR": "/pdf-rotate", en: "/en/pdf-rotate" } },
  openGraph: { title: "Rotate PDF | UTILWISE", description: "Rotate PDF pages by 90, 180, or 270 degrees and save a new file.", url: "https://utilwise.kr/en/pdf-rotate", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>Rotate PDF</h1><p className="sub">Rotate PDF pages by 90, 180, or 270 degrees and save a new file.</p><PDFTools mode="rotate" lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div><section className="text-tool-guide"><h2>Private PDF processing</h2><p>Your files stay on your device. PDF operations run locally in your browser; UTILWISE does not receive or store your documents. Processing large files may require available device memory.</p></section></section></main>;
}
