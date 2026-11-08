import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import TipCalculator from "../../../components/TipCalculator";

export const metadata: Metadata = {
  title: "Tip Calculator | Calculate Tips and Split the Bill - UTILWISE",
  description: "Calculate a tip from your bill and percentage, then split the tip-inclusive total evenly among people. Supports multiple currency formats.",
  alternates: { canonical: "/en/tip", languages: { en: "/en/tip", "ko-KR": "/tip" } },
  openGraph: { title: "Free Tip Calculator | Calculate and Split a Tip", description: "Choose a tip percentage, calculate the total, and split the bill per person.", url: "https://utilwise.kr/en/tip", siteName: "UTILWISE", locale: "en_US", type: "website" }
};

export default function Page() {
  return <main lang="en">
    <header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en">All tools</Link><LanguageSwitcher /></nav></header>
    <section className="wrap section">
      <div className="eyebrow">UTILWISE CALCULATOR</div>
      <h1 style={{fontSize:32,letterSpacing:"-1px",margin:"12px 0 8px"}}>Tip Calculator</h1>
      <p className="sub">Calculate a tip and split the bill among friends, with flexible percentages and currency formatting.</p>
      <TipCalculator lang="en" />
      <div className="footer"><Link href="/en">← Back to all tools</Link></div>
    </section>
  </main>;
}
