import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "서비스 소개 | UTILWISE",
  description: "UTILWISE가 제공하는 생활 계산기와 테스트, 서비스 운영 방향을 소개합니다.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "서비스 소개 | UTILWISE",
    description: "일상에 필요한 계산과 정보 확인, 다양한 테스트를 제공하는 무료 생활 도구 플랫폼 UTILWISE를 소개합니다.",
    url: "https://utilwise.kr/about",
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="wrap header">
        <Link href="/" className="logo">UTIL<span>WISE</span>.</Link>
        <nav className="nav" aria-label="주요 메뉴">
          <Link href="/#calculators">유용한 계산기</Link>
          <Link href="/#tests">테스트 모음</Link>
          <Link href="/about" aria-current="page">서비스 소개</Link>
          <LanguageSwitcher/>
        </nav>
      </header>

      <section className="about-hero">
        <div className="about-page-inner">
          <Link href="/" className="about-back">← 홈으로 돌아가기</Link>
          <div className="about-brand">UTIL<span>WISE</span></div>
          <h1>일상에 필요한 모든 도구</h1>
          <p className="about-tagline">Simple Tools for Everyday Life.</p>
          <div className="about-divider" />

          <div className="about-message">
            <p>
              UTILWISE는 일상에 필요한 계산과 정보 확인,
              <strong> 다양한 테스트를 쉽고 빠르게 이용하는 무료 생활 도구 플랫폼</strong>입니다.
            </p>
            <p>
              <strong>평수·면적 변환, 대출 이자, 부동산 중개수수료,</strong>
              <br className="desktop-break" />
              연봉 실수령액과 퇴직금까지.
              <br />
              생활에 유용한 계산기를 한곳에 모았습니다.
            </p>
            <p>
              MBTI를 비롯한 <strong>가볍게 즐기는 테스트</strong>도
              <br className="desktop-break" />
              간편하게 이용할 수 있습니다.
            </p>
            <p>
              별도의 회원가입 없이 누구나 이용할 수 있으며,
              <br className="desktop-break" />
              정확하고 편리한 서비스를 위해 꾸준히 개선합니다.
            </p>
            <p>
              앞으로 날짜·시간 계산과 단위 변환 등
              <br className="desktop-break" />
              <strong>더 다양한 생활 도구를 추가</strong>해 나가겠습니다.
            </p>
          </div>

          <div className="about-contact">
            <span className="about-contact-label">CONTACT</span>
            <a className="contact-email" href="mailto:mmw833@gmail.com">
              <span aria-hidden="true">✉</span>
              <span>mmw833@gmail.com</span>
            </a>
          </div>
          <p className="about-note">
            계산 결과는 참고용이며, 중요한 금융·세금·부동산 결정 전에는
            관련 기관의 공식 정보를 확인해 주세요.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-bottom">
          <Link href="/" className="footer-about-link">홈으로</Link>
          <div className="copyright">© 2026 UTILWISE. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
