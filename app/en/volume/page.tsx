import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import VolumeCalculator from "../../../components/VolumeCalculator";

export const metadata: Metadata = {
  title: "Volume Calculator | m³, Liters, cm³ & Cylinder Volume - UTILWISE",
  description: "Calculate rectangular prism and cylinder volume from dimensions. Convert results between cubic meters (m³), liters (L), cubic centimeters (cm³), and milliliters (mL).",
  alternates: { canonical: "/en/volume", languages: { en: "/en/volume", "ko-KR": "/volume" } },
  openGraph: {
    title: "Free Volume Calculator | Cuboid & Cylinder",
    description: "Calculate rectangular prism and cylinder volume and convert between common volume units.",
    url: "https://utilwise.kr/en/volume",
    siteName: "UTILWISE",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  return <main lang="en">
    <header className="wrap header"><Link href="/en" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/en">All tools</Link><LanguageSwitcher /></nav></header>
    <section className="wrap section">
      <div className="eyebrow">UTILWISE CALCULATOR</div>
      <h1 style={{fontSize:32,letterSpacing:"-1px",margin:"12px 0 8px"}}>Volume Calculator</h1>
      <p className="sub">Calculate the volume of rectangular prisms and cylinders, then convert the result into common units.</p>
      <VolumeCalculator lang="en" />
      <div className="footer"><Link href="/en">← Back to all tools</Link></div>
    </section>
  </main>;
}
