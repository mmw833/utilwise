import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
export const metadata: Metadata = {
  title: "Free Online Tools | QR Code Generator & Everyday Utilities - UTILWISE",
  description: "Explore free online tools from UTILWISE, starting with a QR code generator for URLs, text, Wi-Fi, email, and phone numbers. No sign-up required.",
  alternates: { canonical: "/en/online-tools", languages: { en: "/en/online-tools", "ko-KR": "/online-tools" } },
  openGraph: { title: "Free Online Tools | UTILWISE", description: "Use practical free online tools, including a QR code generator, directly in your browser.", url: "https://utilwise.kr/en/online-tools", siteName: "UTILWISE", locale: "en_US", type: "website" }
};
export default function Page(){return <main lang="en"><header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en">Home</Link><LanguageSwitcher/></nav></header><section className="wrap section"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1>Online Tools</h1><p className="sub">Free, practical tools for everyday tasks and work.</p><div className="grid text-tool-grid"><Link href="/en/qr-code-generator" className="tool"><div className="tool-icon">▦</div><h2>QR Code Generator</h2><p>Create QR codes for URLs, text, Wi-Fi, email, and phone numbers, then download them as PNG images.</p><div className="tool-link-label">Create a QR code →</div></Link></div><section className="text-tool-guide"><h2>Free online utilities</h2><p>UTILWISE online tools are designed to work directly in your browser without installing software or creating an account. More tools will be added as their functionality and privacy behavior are ready.</p></section></section></main>}
