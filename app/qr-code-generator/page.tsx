import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import QRCodeGenerator from "../../components/QRCodeGenerator";

export const metadata: Metadata = {
  title: "와이파이 QR코드 만들기 | URL·텍스트 무료 QR 생성기 - UTILWISE",
  description: "Wi-Fi 접속용 QR코드와 웹사이트 URL, 텍스트, 이메일, 전화번호 QR코드를 무료로 만드세요. PNG로 다운로드할 수 있으며 입력 정보는 브라우저에서 처리됩니다.",
  alternates: { canonical: "/qr-code-generator", languages: { "ko-KR": "/qr-code-generator", en: "/en/qr-code-generator" } },
  openGraph: { title: "무료 QR 코드 생성기", description: "URL, 텍스트, Wi-Fi, 이메일, 전화번호 QR 코드를 만들고 PNG로 저장하세요.", url: "https://utilwise.kr/qr-code-generator", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher /></nav></header><section className="wrap section"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1 className="qr-title">QR 코드 생성기</h1><p className="sub">URL, 텍스트, Wi-Fi, 이메일, 전화번호를 QR 코드로 만들고 PNG 이미지로 다운로드하세요.</p><QRCodeGenerator lang="ko"/><div className="qr-back"><Link href="/online-tools">온라인 도구 더 보기 →</Link></div></section></main>;
}
