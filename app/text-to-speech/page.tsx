import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import TextToSpeechTool from "../../components/TextToSpeechTool";

export const metadata: Metadata = {
  title: "무료 텍스트 음성 변환기 | 한국어·영어 TTS WAV 다운로드 - UTILWISE",
  description: "텍스트를 한국어·영어 AI 음성으로 변환하고 목소리를 미리 들어보세요. 무료 온라인 TTS로 WAV 저장이 가능하며 입력 문장은 브라우저에서 처리됩니다.",
  alternates: { canonical: "/text-to-speech", languages: { "ko-KR": "/text-to-speech", en: "/en/text-to-speech" } },
  openGraph: { title: "무료 텍스트 음성 변환기 | UTILWISE", description: "한국어·영어 문장을 AI 음성으로 듣고 WAV 파일로 저장하세요.", url: "https://utilwise.kr/text-to-speech", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};

const faq = [
  { question: "한국어와 영어를 모두 지원하나요?", answer: "네. 한국어와 영어를 포함해 한국어, 영어, 일본어, 스페인어, 프랑스어, 독일어를 선택할 수 있습니다. 발음과 품질은 언어와 문장에 따라 다를 수 있습니다." },
  { question: "입력한 문장이 서버로 전송되나요?", answer: "아니요. 음성 추론과 입력 문장 처리는 브라우저에서 실행됩니다. 최초 실행 시 음성 모델 파일을 외부 저장소에서 다운로드합니다." },
  { question: "음성 파일은 어떤 형식으로 저장되나요?", answer: "현재 생성한 음성은 WAV 형식으로 다운로드할 수 있습니다." },
  { question: "처음 사용할 때 시간이 오래 걸리는 이유는 무엇인가요?", answer: "최초 실행 시 약 398MB의 음성 모델을 다운로드하고 브라우저에서 실행 환경을 준비하기 때문입니다. 이후에는 브라우저 캐시가 활용될 수 있습니다." }
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
  return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/text-tools">문서·텍스트 도구</Link><LanguageSwitcher/></nav></header>
    <section className="wrap section tts-page">
      <div className="eyebrow">UTILWISE TEXT TOOLS</div>
      <h1>무료 텍스트 음성 변환기</h1>
      <p className="sub">한국어와 영어 텍스트를 AI 음성으로 변환하고, 목소리를 미리 들은 뒤 WAV 파일로 저장하세요.</p>
      <TextToSpeechTool lang="ko"/>
      <article className="text-tool-guide">
        <h2>텍스트 음성 변환(TTS)이란?</h2>
        <p>텍스트 음성 변환(Text-to-Speech)은 글자를 컴퓨터가 읽어주는 음성으로 바꾸는 기술입니다. 외국어 발음과 듣기 연습, 문서 청취, 발표 원고 확인, 개인용 음성 자료 제작 등에 활용할 수 있습니다.</p>
        <h2>텍스트를 음성 파일로 만드는 방법</h2>
        <ol><li>음성으로 바꿀 문장을 입력하거나 붙여넣습니다. 최대 입력 길이는 3,000자입니다.</li><li>한국어·영어 등 언어와 목소리, 말하기 속도, 생성 품질을 선택합니다.</li><li>음성 엔진을 불러온 뒤 선택한 목소리를 미리 들어봅니다.</li><li>음성 생성 버튼을 누르고 결과를 재생하거나 WAV 파일로 저장합니다.</li></ol>
        <h2>지원 언어와 음성 파일</h2>
        <p>한국어, 영어, 일본어, 스페인어, 프랑스어, 독일어를 선택할 수 있습니다. 목소리와 문장에 따라 발음 및 자연스러움이 달라질 수 있으며, 다운로드 형식은 WAV입니다.</p>
        <h2>개인정보 보호와 최초 모델 다운로드</h2>
        <p>입력 문장과 음성 생성 처리는 브라우저에서 수행하며 UTILWISE 서버로 문장을 전송하지 않습니다. 최초 실행 시 약 398MB의 음성 모델을 외부 저장소에서 다운로드해야 하므로 Wi-Fi 환경을 권장합니다. 다운로드와 생성 속도는 기기 메모리 및 브라우저 성능에 영향을 받습니다.</p>
        <h2>자주 묻는 질문</h2>
        {faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
        <h2>함께 사용하면 좋은 텍스트 도구</h2>
        <p>원고 길이를 확인하려면 <Link href="/text-tools/character-counter">글자 수 세기</Link>, 발표에 필요한 시간을 예상하려면 <Link href="/text-tools/speech-time">발표 시간 계산기</Link>를 이용해 보세요.</p>
      </article>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}