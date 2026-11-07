import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "이용약관 | UTILWISE", description: "UTILWISE 서비스 이용 조건과 계산 결과의 유의사항을 안내합니다.", alternates: { canonical: "/terms" }, openGraph: { title: "이용약관 | UTILWISE", description: "UTILWISE 서비스 이용약관", url: "https://utilwise.kr/terms", siteName: "UTILWISE", locale: "ko_KR", type: "website" } };
const sections = [
["제1조 (목적)",["이 약관은 UTILWISE가 제공하는 생활 계산기, 정보 및 테스트 등 웹서비스의 이용과 관련한 기본 사항을 정합니다."]],
["제2조 (서비스)",["서비스는 평수·면적, 대출 이자, 부동산 중개수수료, 급여·퇴직금, 날짜, 저축, DSR, 전월세, 유류비, 부가가치세 등의 계산 도구와 성격 관련 테스트를 제공합니다.","별도 회원가입 없이 무료 이용을 원칙으로 하며 서비스 내용과 제공 방식은 운영상 필요에 따라 변경될 수 있습니다."]],
["제3조 (계산 결과와 정보의 한계)",["계산 결과와 설명은 일반적인 정보 제공 및 참고를 위한 것이며 금융·세무·법률·부동산·노무 관련 전문 자문이나 공식 심사·견적·판정을 대신하지 않습니다.","결과는 이용자가 입력한 값과 화면에 안내된 가정·산식에 따라 산출됩니다. 실제 결과는 개인별 상황, 금융상품 조건, 거래 내용 및 법령·고시·요율 변경 등에 따라 달라질 수 있습니다.","중요한 의사결정 전에는 관계 기관의 최신 공식 자료 또는 해당 분야 전문가를 통해 확인해야 합니다.","MBTI 및 빅파이브 등 성격 테스트는 자기이해와 재미를 위한 비공식 참고 콘텐츠이며 임상적 진단이나 표준화된 심리평가가 아닙니다."]],
["제4조 (이용자 준수사항)",["이용자는 서비스를 정상적인 방법으로 이용해야 하며 운영 방해, 타인의 권리 침해, 자동화된 과도한 요청, 악성 코드 유포, 취약점 악용, 무단 접근 및 콘텐츠의 무단 복제·재배포를 해서는 안 됩니다."]],
["제5조 (지식재산권)",["서비스의 명칭, 디자인, 문구, 구성 및 자체 제작 콘텐츠의 권리는 별도 표시가 없는 한 해당 권리자에게 있습니다. 관계 법령이 허용하는 범위를 넘어 복제·배포·수정하거나 상업적으로 이용할 수 없습니다."]],
["제6조 (서비스 변경 및 중단)",["서비스는 점검, 장애, 보안, 운영 또는 기술상 사유로 전부 또는 일부를 변경하거나 일시 중단할 수 있습니다. 가능한 경우 사전에 안내하도록 노력합니다."]],
["제7조 (책임의 제한)",["서비스는 정보의 정확성과 최신성을 위해 노력하지만 모든 상황에서 완전성·정확성·최신성을 보증하지 않습니다.","이용자의 입력 오류, 외부 기관의 정책 변경 또는 서비스 정보를 활용한 의사결정으로 발생한 결과에 대한 책임은 관계 법령이 허용하는 범위에서 제한될 수 있습니다. 다만 고의 또는 중대한 과실 등 법령상 제한할 수 없는 책임은 제외됩니다."]],
["제8조 (약관 변경 및 문의)",["약관은 관계 법령을 위반하지 않는 범위에서 변경할 수 있으며 변경 내용은 이 페이지에 게시합니다.","서비스 이용 문의: mmw833@gmail.com"]]
];
export default function TermsPage(){return <main className="about-page"><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/">홈</Link><Link href="/privacy">개인정보처리방침</Link></nav></header><section className="about-hero"><article className="policy-content"><Link href="/" className="about-back">← 홈으로 돌아가기</Link><div className="about-brand">UTIL<span>WISE</span></div><h1>이용약관</h1><p className="policy-updated">시행일: 2026년 11월 7일</p><p className="policy-intro">UTILWISE 서비스를 이용하기 전에 아래 내용을 확인해 주세요.</p>{sections.map(([title,paragraphs])=><section className="policy-section" key={title as string}><h2>{title as string}</h2>{(paragraphs as string[]).map(p=><p key={p}>{p}</p>)}</section>)}</article></section><footer className="footer"><div className="wrap footer-bottom"><Link href="/">홈으로</Link><Link href="/privacy">개인정보처리방침</Link><Link href="/about">서비스 소개</Link><div className="copyright">© 2026 UTILWISE. All rights reserved.</div></div></footer></main>}
