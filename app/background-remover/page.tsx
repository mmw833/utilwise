import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import BackgroundRemover from "../../components/BackgroundRemover";

export const metadata: Metadata = {
  title: "무료 AI 배경 제거 | 사진 배경 지우기·투명 PNG 만들기 - UTILWISE",
  description: "사진 배경을 AI로 자동 제거하고 투명 PNG로 저장하세요. 무료 배경 제거 도구로 회원가입 없이 브라우저에서 처리하며 원본 이미지는 서버에 업로드되지 않습니다.",
  alternates: { canonical: "/background-remover", languages: { "ko-KR": "/background-remover", en: "/en/background-remover" } },
  openGraph: { title: "무료 AI 배경 제거 | 사진 배경 지우기", description: "사진 배경을 자동으로 지우고 투명 PNG로 저장하세요. 무료·브라우저 내 처리.", url: "https://utilwise.kr/background-remover", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

const faq = [
  { question: "무료로 이용할 수 있나요?", answer: "네. 회원가입이나 결제 없이 무료로 사용할 수 있습니다. 이미지 처리는 브라우저에서 실행됩니다." },
  { question: "사진이 서버에 업로드되나요?", answer: "아니요. 선택한 사진은 브라우저에서 처리되며 UTILWISE 서버로 업로드되지 않습니다. 최초 이용 시 AI 모델 파일을 외부 저장소에서 다운로드합니다." },
  { question: "어떤 이미지 형식을 지원하나요?", answer: "JPG, PNG, WebP를 지원합니다. 파일당 최대 20MB, 가로와 세로 각각 최대 4,096px까지 처리할 수 있으며 결과는 투명 PNG로 저장됩니다." },
  { question: "머리카락이나 복잡한 배경도 제거할 수 있나요?", answer: "AI가 피사체와 배경을 분리하지만 조명, 배경 복잡도, 피사체의 형태에 따라 가장자리 결과가 달라질 수 있습니다." }
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
  return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher/></nav></header>
    <section className="wrap section image-tool-page background-remover-page">
      <div className="eyebrow">UTILWISE ONLINE TOOLS</div>
      <h1>무료 AI 이미지 배경 제거</h1>
      <p className="sub">사진 배경을 자동으로 지우고 투명 PNG로 저장하세요. 회원가입 없이 무료로 이용할 수 있습니다.</p>
      <BackgroundRemover lang="ko"/>
      <div className="image-tool-guide">
        <h2>사진 배경 지우기란?</h2>
        <p>AI 이미지 배경 제거는 사진에서 사람, 제품, 사물 등 주요 피사체와 배경을 구분해 배경을 투명하게 만드는 기능입니다. 상품 상세 이미지, 프로필 사진, 온라인 쇼핑몰 상품 컷, 발표 자료와 디자인용 이미지 제작에 활용할 수 있습니다.</p>
        <h2>이미지 배경 제거 방법</h2>
        <ol><li>JPG, PNG 또는 WebP 사진을 선택하거나 업로드 영역에 끌어다 놓습니다.</li><li>AI가 분석한 예상 제거 영역을 확인합니다.</li><li>고화질 배경 제거를 실행하고 결과를 확인합니다.</li><li>투명 배경 PNG 다운로드를 눌러 저장합니다.</li></ol>
        <h2>무료 배경 제거 도구의 지원 범위</h2>
        <ul><li>지원 형식: JPG, PNG, WebP</li><li>파일 크기: 파일당 최대 20MB</li><li>이미지 크기: 가로·세로 각각 최대 4,096px</li><li>결과 형식: 투명 배경 PNG</li><li>처리 방식: 브라우저 내 AI 처리</li></ul>
        <p>최초 사용 시 AI 모델 파일을 외부 저장소에서 다운로드하며 이후에는 브라우저 캐시를 활용할 수 있습니다. 사진 자체는 UTILWISE 서버로 전송되지 않습니다. 원본의 조명, 배경, 피사체 가장자리와 해상도에 따라 결과가 달라질 수 있으므로 다운로드 전에 미리보기를 확인해 주세요.</p>
        <h2>자주 묻는 질문</h2>
        {faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
        <p>AI 모델: BiRefNet Lite ONNX (MIT License), ZhengPeng7/BiRefNet_lite 기반 모델.</p>
        <h2>함께 사용하면 좋은 이미지 도구</h2>
        <p>배경을 제거한 다음 <Link href="/image-compressor">이미지 용량 줄이기</Link>, <Link href="/image-resizer">사진 크기 조절</Link>, <Link href="/image-converter">JPG·PNG·WebP 이미지 변환</Link>을 이용해 파일을 정리할 수 있습니다.</p>
      </div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}