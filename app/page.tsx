"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
const tools=[
{icon:"⌂",title:"평수·면적 변환",desc:"㎡와 평을 빠르고 정확하게 변환해요.",href:"/area"},
{icon:"▦",title:"날짜 계산기",desc:"기간, 디데이, 근무일과 만 나이를 계산해요.",href:"/date"},
{icon:"₩",title:"대출 이자 계산기",desc:"월 상환금과 총 이자 부담을 비교해요.",href:"/loan"},
{icon:"⌂",title:"부동산 중개수수료",desc:"매매·전세·월세 중개보수 상한을 확인해요.",href:"/brokerage"},
{icon:"▤",title:"연봉 실수령액",desc:"4대 보험과 세금을 고려한 예상 금액을 확인해요.",href:"/salary"},
{icon:"◷",title:"퇴직금 계산기",desc:"근속기간과 평균임금으로 예상 퇴직금을 계산해요.",href:"/severance"},
{icon:"₩",title:"예금·적금 이자 계산기",desc:"저축 만기 이자와 세후 수령액을 계산해요.",href:"/savings"},
{icon:"▣",title:"DSR 대출 한도 계산기",desc:"소득과 대출 상환액으로 DSR을 추정해요.",href:"/dsr"},
{icon:"⌂",title:"전월세 전환 계산기",desc:"보증금과 월세 전환 금액을 비교해요.",href:"/rent-conversion"},
{icon:"⛽",title:"자동차 유류비 계산기",desc:"주행 거리와 연비로 예상 주유비를 계산해요.",href:"/fuel"},
{icon:"％",title:"부가세 계산기",desc:"공급가액과 부가세 포함 금액을 계산해요.",href:"/vat"},
{icon:"▣",title:"부피 계산기",desc:"직육면체와 원기둥의 부피를 계산하고 리터로 변환해요.",href:"/volume"}];
const personality=[{title:"MBTI 성격유형 검사",desc:"24개의 질문으로 나의 성향과 성격을 알아봐요.",href:"/mbti",label:"테스트 시작하기　→"},{title:"빅파이브 성격검사",desc:"50문항으로 다섯 가지 성격 차원을 분석해요.",href:"/big-five",label:"검사 시작하기　→"},{title:"감성지능(EQ) 테스트",desc:"36문항으로 감정 인식·조절·공감과 관계 능력을 살펴봐요.",href:"/eq",label:"테스트 시작하기　→"}];
const psychology=[{title:"나도 몰랐던 나의 진짜 모습",desc:"18가지 일상 속 선택으로 숨겨진 성향과 매력을 발견해 보세요.",href:"/psychology",label:"심리테스트 시작하기　→"},{title:"내 마음속 진짜 욕망은 무엇일까?",desc:"12가지 선택으로 나의 핵심 가치와 마음속 우선순위를 알아봐요.",href:"/psychology/desire",label:"심리테스트 시작하기　→"},{title:"사람들이 보는 나 vs 진짜 나",desc:"겉으로 보이는 모습과 속마음의 차이를 살펴봐요.",href:"/psychology/mirror",label:"심리테스트 시작하기　→"}];
export default function Home(){
const [query,setQuery]=useState("");const q=query.trim().toLowerCase();
const filteredTools=useMemo(()=>tools.filter(t=>`${t.title} ${t.desc}`.toLowerCase().includes(q)),[q]);
const filterTests=(items:{title:string;desc:string;href:string;label:string}[])=>items.filter(t=>`${t.title} ${t.desc}`.toLowerCase().includes(q));
const personalityShown=filterTests(personality),psychologyShown=filterTests(psychology);
return <main>
<header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav" aria-label="주요 메뉴"><a href="#calculators">유용한 계산기</a><a href="#personality">성격테스트</a><a href="#psychology">심리테스트</a><Link href="/about">서비스 소개</Link><LanguageSwitcher/></nav></header>
<section className="hero"><div className="wrap"><div className="eyebrow">SIMPLE TOOLS FOR EVERYDAY LIFE</div><h1>일상에 필요한 모든 도구,<br/>더 쉽고 간편하게.</h1><div className="hero-english">All the tools you need, made simple.</div><p>복잡한 계산은 UTILWISE가 대신할게요.</p><div className="search"><input aria-label="도구 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="어떤 도구를 찾으시나요? (예: 대출 이자, 심리테스트)"/><button type="button" onClick={()=>document.getElementById(filteredTools.length?"calculators":personalityShown.length?"personality":"psychology")?.scrollIntoView({behavior:"smooth"})}>도구 찾기</button></div></div></section>
<section className="wrap section" id="calculators"><div className="section-head"><div><h2>유용한 계산기</h2><div className="sub">일상에서 자주 사용하는 계산 도구를 간편하게 이용해 보세요.</div></div></div><div className="grid">{filteredTools.map(t=><Link href={t.href} className="tool" key={t.href}><div className="tool-icon">{t.icon}</div><h3>{t.title}</h3><p>{t.desc}</p><div className="tool-link-label">계산하기　→</div></Link>)}</div>{filteredTools.length===0&&<p className="sub">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</p>}</section>
<section className="test-section" id="personality"><div className="wrap section"><div className="test-heading"><div className="eyebrow">UNDERSTAND YOURSELF</div><h2>성격테스트</h2><p>나의 성격과 비교적 지속적인 성향을 체계적으로 살펴보세요.</p></div><div className="grid test-grid">{personalityShown.map(t=><Link href={t.href} className="tool test-tool" key={t.href}><div className="tool-icon">✦</div><h3>{t.title}</h3><p>{t.desc}</p><div className="tool-link-label">{t.label}</div></Link>)}</div>{personalityShown.length===0&&<p className="sub test-empty">검색 결과가 없습니다.</p>}</div></section>
<section className="test-section" id="psychology"><div className="wrap section"><div className="test-heading"><div className="eyebrow">FUN SELF-DISCOVERY</div><h2>심리테스트</h2><p>가벼운 질문과 선택으로 나의 새로운 모습을 재미있게 발견해 보세요.</p></div><div className="grid test-grid">{psychologyShown.map(t=><Link href={t.href} className="tool test-tool" key={t.href}><div className="tool-icon">♡</div><h3>{t.title}</h3><p>{t.desc}</p><div className="tool-link-label">{t.label}</div></Link>)}</div>{psychologyShown.length===0&&<p className="sub test-empty">검색 결과가 없습니다.</p>}</div></section>
<footer className="footer"><div className="wrap"><strong>UTILWISE</strong><br/>일상에 필요한 계산과 도구를 한곳에서.<br/><br/>계산 결과는 참고용이며 실제 계약·세금·금융 판단 전에는 관련 기관 또는 전문가에게 확인하세요.<br/><div className="footer-legal-links"><Link href="/about" className="footer-about-link">서비스 소개</Link><Link href="/privacy" className="footer-about-link">개인정보처리방침</Link><Link href="/terms" className="footer-about-link">이용약관</Link></div><div className="footer-copyright">© 2026 UTILWISE. All rights reserved.</div></div></footer>
</main>}
