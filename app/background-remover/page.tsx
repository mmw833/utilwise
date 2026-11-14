import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import BackgroundRemover from "../../components/BackgroundRemover";

export const metadata: Metadata = {
  title: "무료 AI 이미지 배경 제거 | 사진 배경 지우기 - UTILWISE",
  description: "사진을 업로드해 AI로 배경을 자동 제거하고 투명 PNG로 무료 다운로드하세요. 회원가입 없이 브라우저에서 처리하며 이미지 파일은 서버에 업로드되지 않습니다.",
  alternates: { canonical: "/background-remover", languages: { "ko-KR": "/background-remover", en: "/en/background-remover" } },
  openGraph: { title: "무료 AI 이미지 배경 제거", description: "사진 배경을 브라우저에서 자동으로 제거하고 투명 PNG로 저장하세요.", url: "https://utilwise.kr/background-remover", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

export default function Page() {
  return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher/></nav></header>
    <section className="wrap section image-tool-page background-remover-page">
      <div className="eyebrow">UTILWISE ONLINE TOOLS</div>
      <h1>무료 AI 이미지 배경 제거</h1>
      <p className="sub">사진을 선택하면 AI가 배경을 자동으로 지우고 투명 PNG로 만들어 줍니다.</p>
      <BackgroundRemover lang="ko"/>
      <div className="image-tool-guide">
        <h2>이미지 배경 제거 도구란?</h2>
        <p>AI 이미지 배경 제거 도구는 사진 속 주요 피사체와 배경을 구분해 배경을 투명하게 만드는 기능입니다. 프로필 사진, 상품 이미지, 발표 자료와 디자인 작업에 활용할 수 있습니다.</p>
        <h2>사용 방법</h2>
        <ol><li>JPG, PNG 또는 WebP 이미지를 선택하거나 업로드 영역에 끌어다 놓습니다.</li><li>배경 제거하기를 누르고 AI 처리가 끝날 때까지 기다립니다.</li><li>투명 배경 또는 미리보기 배경색을 선택해 결과를 확인합니다.</li><li>투명 PNG 다운로드를 눌러 저장합니다.</li></ol>
        <p>이미지 파일은 브라우저에서 처리되며 UTILWISE 서버로 전송되지 않습니다. AI 모델은 최초 사용 시 다운로드되며, 이후 브라우저 캐시를 통해 재사용될 수 있습니다. 현재 모델은 인물 사진에 최적화되어 있으며 모든 사진에서 완벽한 가장자리 분리를 보장하지 않습니다.</p>
        <h2>자주 묻는 질문</h2>
        <h3>무료로 이용할 수 있나요?</h3><p>네. 회원가입이나 결제 없이 무료로 사용할 수 있습니다. 이미지 처리용 외부 API 요금은 발생하지 않습니다.</p>
        <h3>사진이 서버에 저장되나요?</h3><p>아니요. 사진은 이용자의 브라우저에서 처리됩니다. AI 모델 파일을 내려받기 위해 외부 모델 저장소에 연결하지만 사진 자체는 전송하지 않습니다.</p>
        <h3>어떤 이미지 형식을 지원하나요?</h3><p>JPG, PNG, WebP를 지원하며 파일당 최대 20MB까지 선택할 수 있습니다. 결과는 투명 배경을 지원하는 PNG로 저장됩니다.</p>
        <h3>머리카락이나 복잡한 배경도 제거할 수 있나요?</h3><p>AI가 가장자리를 부드럽게 분리하도록 설계되어 있지만 원본 이미지의 조명, 배경, 피사체에 따라 결과가 달라질 수 있습니다.</p>
        <h2>관련 이미지 도구</h2><p><Link href="/image-compressor">이미지 압축기</Link>와 <Link href="/image-resizer">이미지 크기 조절기</Link>도 함께 이용해 보세요.</p>
      </div>
    </section>
  </main>;
}
