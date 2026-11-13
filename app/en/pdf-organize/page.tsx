import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import PDFTools from "../../../components/PDFTools";

export const metadata: Metadata = {
  title: "Reorder PDF Pages | Organize and Remove PDF Pages - UTILWISE",
  description: "Change the order of PDF pages or remove unwanted pages, then save an organized PDF. Arrange page sequences with this free browser-based PDF tool.",
  alternates: { canonical: "/en/pdf-organize", languages: { "ko-KR": "/pdf-organize", en: "/en/pdf-organize" } },
  openGraph: { title: "Organize PDF Pages | UTILWISE", description: "Reorder PDF pages or remove unwanted pages by entering the page sequence.", url: "https://utilwise.kr/en/pdf-organize", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE PDF TOOLS</div><h1>Organize PDF Pages</h1><p className="sub">Reorder PDF pages or remove unwanted pages by entering the page sequence.</p><PDFTools mode="organize" lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div><section className="text-tool-guide"><h2>Private PDF processing</h2><p>Your files stay on your device. PDF operations run locally in your browser; UTILWISE does not receive or store your documents. Processing large files may require available device memory.</p></section></section></main>;
}
