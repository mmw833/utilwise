import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
export const metadata: Metadata = {
  title: "온라인 도구 모음 | 무료 QR 코드 생성기 및 생활 도구 - UTILWISE",
  description: "QR 코드 생성기 등 일상에서 유용한 무료 온라인 도구를 이용하세요. 회원가입 없이 브라우저에서 간편하게 사용할 수 있습니다.",
  alternates: { canonical: "/online-tools", languages: { "ko-KR": "/online-tools", en: "/en/online-tools" } },
  openGraph: { title: "온라인 도구 모음 | UTILWISE", description: "QR 코드 생성기와 다양한 무료 온라인 도구를 한곳에서 이용하세요.", url: "https://utilwise.kr/online-tools", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};
export default function Page(){return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/">홈</Link><LanguageSwitcher/></nav></header><section className="wrap section"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1>온라인 도구</h1><p className="sub">일상과 업무에 유용한 무료 온라인 도구를 이용하세요.</p><div className="grid text-tool-grid"><Link href="/qr-code-generator" className="tool"><div className="tool-icon">▦</div><h2>QR 코드 생성기</h2><p>URL, 텍스트, Wi-Fi, 이메일, 전화번호를 QR 코드로 만들고 PNG로 저장하세요.</p><div className="tool-link-label">QR 코드 만들기 →</div></Link></div><section className="text-tool-guide"><h2>무료 온라인 도구</h2><p>UTILWISE 온라인 도구는 별도 프로그램 설치나 회원가입 없이 브라우저에서 바로 사용할 수 있도록 설계합니다. 새로운 도구는 실제 기능과 개인정보 처리 방식을 확인한 뒤 순차적으로 추가합니다.</p></section></section></main>}
