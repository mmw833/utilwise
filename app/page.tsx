"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

const tools = [
  { icon:"⌂", title:"평수·면적 변환", desc:"㎡와 평을 빠르고 정확하게 변환해요.", href:"/area" },
  { icon:"₩", title:"대출 이자 계산기", desc:"월 상환금과 총 이자 부담을 비교해요.", href:"/loan" },
  { icon:"⌂", title:"부동산 중개수수료", desc:"매매·전세·월세 중개보수 상한을 확인해요.", href:"/brokerage" },
  { icon:"▤", title:"연봉 실수령액", desc:"4대 보험과 세금을 고려한 예상 금액을 확인해요.", href:"/salary" },
  { icon:"◷", title:"퇴직금 계산기", desc:"근속기간과 평균임금으로 예상 퇴직금을 계산해요.", href:"/severance" },
  { icon:"₩", title:"예금·적금 이자 계산기", desc:"저축 만기 이자와 세후 수령액을 계산해요.", href:"/savings" },
  { icon:"▣", title:"DSR 대출 한도 계산기", desc:"소득과 대출 상환액으로 DSR을 추정해요.", href:"/dsr" },
  { icon:"⌂", title:"전월세 전환 계산기", desc:"보증금과 월세 전환 금액을 비교해요.", href:"/rent-conversion" },
  { icon:"⛽", title:"자동차 유류비 계산기", desc:"주행 거리와 연비로 예상 주유비를 계산해요.", href:"/fuel" },
  { icon:"％", title:"부가세 계산기", desc:"공급가액과 부가세 포함 금액을 계산해요.", href:"/vat" }
];

export default function Home(){
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTools = useMemo(() => tools.filter(t =>
    `${t.title} ${t.desc}`.toLowerCase().includes(normalizedQuery)
  ), [normalizedQuery]);
  const showTest = "MBTI 성격유형 검사 재미 테스트".toLowerCase().includes(normalizedQuery);
  return <main>
    <header className="wrap header">
      <Link href="/" className="logo">UTIL<span>WISE</span>.</Link>
      <nav className="nav" aria-label="주요 메뉴">
        <a href="#calculators">유용한 계산기</a>
        <a href="#tests">테스트 모음</a>
        <a href="#about">서비스 소개</a>
      </nav>
    </header>
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow">SIMPLE TOOLS FOR EVERYDAY LIFE</div>
        <h1>일상에 필요한 모든 도구,<br/>더 쉽고 간편하게.</h1>
        <div className="hero-english">All the tools you need, made simple.</div>
        <p>복잡한 계산은 UTILWISE가 대신할게요.</p>
        <div className="search">
          <input aria-label="도구 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="어떤 도구를 찾으시나요? (예: 대출 이자, 단위 변환)"/>
          <button type="button" onClick={()=>document.getElementById("calculators")?.scrollIntoView({behavior:"smooth"})}>도구 찾기</button>
        </div>
      </div>
    </section>
    <section className="wrap section" id="calculators">
      <div className="section-head"><div><h2>유용한 계산기</h2><div className="sub">일상에서 자주 사용하는 계산 도구를 간편하게 이용해 보세요.</div></div></div>
      <div className="grid">
        {filteredTools.map(t=><Link href={t.href} className="tool" key={t.href}><div className="tool-icon">{t.icon}</div><h3>{t.title}</h3><p>{t.desc}</p><div className="tool-link-label">계산하기　→</div></Link>)}
      </div>
      {filteredTools.length===0 && !showTest && <p className="sub">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</p>}
    </section>
    <section className="test-section" id="tests">
      <div className="wrap section">
        <div className="test-heading">
          <div className="eyebrow">DISCOVER YOURSELF</div>
          <h2>테스트 모음</h2>
          <p>가볍게 즐기며 나에 대해 알아보는 다양한 테스트를 만나보세요.</p>
        </div>
        {showTest ? <div className="grid test-grid">
          <Link href="/mbti" className="tool test-tool"><div className="tool-icon">✦</div><h3>MBTI 성격유형 검사</h3><p>24개의 질문으로 나의 성향과 성격을 알아봐요.</p><div className="tool-link-label">테스트 시작하기　→</div></Link>
        </div> : <p className="sub test-empty">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</p>}
      </div>
    </section>
    <footer className="footer" id="about">
      <div className="wrap about-content">
        <div className="about-brand">UTIL<span>WISE</span></div>
        <h2>일상에 필요한 모든 도구</h2>
        <p className="about-tagline">Simple Tools for Everyday Life.</p>
        <div className="about-divider"/>
        <p className="about-copy">UTILWISE는 일상생활에 필요한 계산과 정보 확인, 다양한 테스트를 쉽고 빠르게 이용할 수 있는 <strong>무료 생활 도구 플랫폼</strong>입니다.</p>
        <p className="about-copy">평수·면적 변환, 대출 이자, 부동산 중개수수료, 연봉 실수령액, 퇴직금 등 <strong>실용적인 계산기</strong>와 MBTI를 비롯한 <strong>다양한 테스트</strong>를 제공합니다.</p>
        <p className="about-copy">별도의 회원가입 없이 누구나 간편하게 이용할 수 있으며, 정확하고 편리한 서비스 제공을 위해 지속적으로 개선합니다.</p>
        <p className="about-copy">앞으로 날짜·시간 계산과 단위 변환 등 <strong>다양한 생활 도구를 꾸준히 추가</strong>해 나가겠습니다.</p>
        <a className="contact-email" href="mailto:mmw833@gmail.com"><span aria-hidden="true">✉</span><span>mmw833@gmail.com</span></a>
        <p className="about-note">계산 결과는 참고용이며 실제 계약·세금·금융 판단 전에는 관련 기관 또는 전문가에게 확인하세요.</p>
        <div className="copyright">© 2026 UTILWISE. All rights reserved.</div>
      </div>
    </footer>
  </main>;
}
