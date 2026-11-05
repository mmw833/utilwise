"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
const tools = [
  { icon:"⌂", title:"평수·면적 변환", desc:"㎡와 평을 빠르고 정확하게 변환해요.", href:"/area", tag:"부동산" },
  { icon:"₩", title:"대출 이자 계산기", desc:"월 상환금과 총 이자 부담을 비교해요.", href:"/loan", tag:"금융" },
  { icon:"⌂", title:"부동산 중개수수료", desc:"매매·전세·월세 중개보수 상한을 확인해요.", href:"/brokerage", tag:"부동산" },
  { icon:"▤", title:"연봉 실수령액", desc:"4대 보험과 세금을 고려한 예상 금액을 확인해요.", href:"/salary", tag:"직장인" },
  { icon:"◷", title:"퇴직금 계산기", desc:"근속기간과 평균임금으로 예상 퇴직금을 계산해요.", href:"/severance", tag:"직장인" },
  { icon:"₩", title:"예금·적금 이자 계산기", desc:"저축 만기 이자와 세후 수령액을 계산해요.", href:"/savings", tag:"금융" },
  { icon:"▣", title:"DSR 대출 한도 계산기", desc:"소득과 대출 상환액으로 DSR을 추정해요.", href:"/dsr", tag:"금융" },
  { icon:"⌂", title:"전월세 전환 계산기", desc:"보증금과 월세 전환 금액을 비교해요.", href:"/rent-conversion", tag:"부동산" },
  { icon:"⛽", title:"자동차 유류비 계산기", desc:"주행 거리와 연비로 예상 주유비를 계산해요.", href:"/fuel", tag:"생활 편의" },
  { icon:"％", title:"부가세 계산기", desc:"공급가액과 부가세 포함 금액을 계산해요.", href:"/vat", tag:"생활 편의" }
];
export default function Home(){
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => tools.filter(t => `${t.title} ${t.desc} ${t.tag}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <main>
    <header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><a href="#tools">전체 도구</a><a href="#categories">카테고리</a><a href="#about">서비스 소개</a></nav></header>
    <section className="hero"><div className="wrap"><div className="eyebrow">SIMPLE TOOLS FOR EVERYDAY LIFE</div><h1>일상에 필요한 모든 도구,<br/>더 쉽고 간편하게.</h1><div className="hero-english">All the tools you need, made simple.</div><p>복잡한 계산은 UTILWISE가 대신할게요.</p><div className="search"><input aria-label="도구 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="어떤 도구를 찾으시나요? (예: 대출 이자, 단위 변환)"/><button type="button" onClick={()=>document.getElementById("tools")?.scrollIntoView({behavior:"smooth"})}>도구 찾기</button></div><div className="categories" id="categories" style={{justifyContent:"center"}}><span className="chip">부동산</span><span className="chip">금융</span><span className="chip">직장인</span><span className="chip">생활 편의</span></div></div></section>
    <section className="wrap section" id="tools"><div className="section-head"><div><h2>일상에 유용한 계산기</h2><div className="sub">필요한 도구를 선택해 바로 계산해 보세요.</div></div><span className="sub">무료 · 간편 · 회원가입 없음</span></div><div className="grid">{filtered.map(t=><Link href={t.href} className="tool" key={t.href}><div className="tool-icon">{t.icon}</div><h3>{t.title}</h3><p>{t.desc}</p><div style={{marginTop:16,fontSize:11,color:"#3268a8",fontWeight:700}}>{t.tag}　→</div></Link>)}</div>{filtered.length===0&&<p className="sub">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</p>}</section>
    <footer className="footer" id="about"><div className="wrap"><strong>UTILWISE</strong><br/>일상에 필요한 계산과 도구를 한곳에서.<br/><br/>계산 결과는 참고용이며 실제 계약·세금·금융 판단 전에는 관련 기관 또는 전문가에게 확인하세요.<br/>© 2026 UTILWISE. All rights reserved.</div></footer>
  </main>
}
