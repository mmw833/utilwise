import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import QRCodeGenerator from "../../../components/QRCodeGenerator";

export const metadata: Metadata = {
  title: "Wi-Fi QR Code Generator | Free URL, Text & Email QR Codes - UTILWISE",
  description: "Create a Wi-Fi QR code to share network access, or generate QR codes for URLs, text, email, and phone numbers. Download PNG files. Content stays in your browser.",
  alternates: { canonical: "/en/qr-code-generator", languages: { en: "/en/qr-code-generator", "ko-KR": "/qr-code-generator" } },
  openGraph: { title: "Free QR Code Generator", description: "Generate and download QR codes for websites, text, Wi-Fi, email, and phone numbers.", url: "https://utilwise.kr/en/qr-code-generator", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en/online-tools">Online Tools</Link><LanguageSwitcher /></nav></header><section className="wrap section"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1 className="qr-title">QR Code Generator</h1><p className="sub">Create QR codes for URLs, text, Wi-Fi, email, and phone numbers, then download them as PNG images.</p><QRCodeGenerator lang="en"/><div className="qr-back"><Link href="/en/online-tools">Explore more online tools →</Link></div></section></main>;
}
