import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ImageToTextOCR from "../../components/ImageToTextOCR";

export const metadata: Metadata = {
 title: "이미지 텍스트 추출 무료 OCR | 사진·스크린샷 글자 인식 - UTILWISE",
 description: "사진, 스크린샷, 스캔 이미지에서 한국어와 영어 글자를 추출하는 무료 온라인 OCR입니다. 이미지 속 문자를 복사하거나 TXT 파일로 저장하세요. 브라우저에서 처리합니다.",
 alternates: { canonical: "/image-to-text", languages: { "ko-KR": "/image-to-text", en: "/en/image-to-text" } },
 openGraph: { title: "무료 이미지 텍스트 추출기 | 한국어·영어 OCR - UTILWISE", description: "사진과 스크린샷의 글자를 편집 가능한 텍스트로 추출하고 복사하거나 TXT로 저장하세요.", url: "https://utilwise.kr/image-to-text", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};
const faq = [
 { question: "한국어와 영어를 함께 인식할 수 있나요?", answer: "네. 한국어+영어, 한국어만, 영어만 선택할 수 있습니다. 두 언어가 섞인 이미지에는 한국어+영어 옵션을 선택하세요." },
 { question: "이미지가 서버에 업로드되나요?", answer: "아니요. OCR은 브라우저에서 실행되며 이미지 파일은 UTILWISE 서버로 업로드되지 않습니다. 최초 사용 시 OCR 엔진과 언어 데이터 파일을 외부 CDN에서 내려받습니다." },
 { question: "지원하는 이미지 파일 크기는 얼마인가요?", answer: "이미지 파일은 최대 15MB까지 선택할 수 있습니다. 크거나 복잡한 이미지는 기기 성능과 메모리에 따라 처리 시간이 길어질 수 있습니다." },
 { question: "손글씨나 표도 정확하게 인식하나요?", answer: "인식 결과는 이미지 품질과 글자 모양에 따라 달라집니다. 흐릿한 사진, 작은 글자, 손글씨, 기울어진 문서와 표에서는 오류가 생길 수 있으므로 원본과 대조해 주세요." },
 { question: "PDF 파일도 바로 인식할 수 있나요?", answer: "현재는 이미지 파일을 지원합니다. PDF 페이지를 이미지로 변환한 다음 업로드해 이용할 수 있습니다." }
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
 return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/text-tools">문서·텍스트 도구</Link><LanguageSwitcher/></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE TEXT TOOLS</div><h1>이미지 텍스트 추출기 (무료 OCR)</h1><p className="sub">사진, 스크린샷, 스캔 이미지에 있는 한국어·영어 글자를 편집 가능한 텍스트로 변환하세요.</p><ImageToTextOCR lang="ko"/><article className="image-tool-guide">
 <h2>이미지 텍스트 추출(OCR)이란?</h2><p>OCR(광학 문자 인식)은 사진이나 스크린샷 속 문자를 분석해 복사하고 편집할 수 있는 텍스트로 바꾸는 기술입니다. 촬영한 문서, 화면 캡처, 안내문과 인쇄물에서 글자를 옮길 때 활용할 수 있습니다.</p>
 <h2>사진에서 글자 추출하는 방법</h2><ol><li>이미지 파일을 선택하거나 업로드 영역에 끌어다 놓습니다.</li><li>한국어+영어, 한국어 또는 영어 중 인식할 언어를 선택합니다.</li><li>글자 추출하기를 누르고 처리가 끝날 때까지 기다립니다.</li><li>결과를 확인하고 필요한 부분을 수정한 뒤 복사하거나 TXT로 저장합니다.</li></ol>
 <h2>OCR 인식 정확도를 높이는 방법</h2><p>글자가 선명하고 배경과 대비가 뚜렷한 이미지를 사용하세요. 문서를 정면에서 촬영하고 글자가 잘리지 않도록 하세요. 도구는 작은 이미지 확대, 회색조·명암 보정과 여러 문서 배치 인식 결과 비교를 적용하지만 흐릿하거나 기울어진 사진, 손글씨, 표와 복잡한 배경에서는 오인식이 발생할 수 있습니다. 중요한 내용은 원본과 대조해 주세요.</p>
 <h2>지원 범위와 개인정보</h2><ul><li>인식 언어: 한국어+영어, 한국어, 영어</li><li>이미지 파일: 최대 15MB</li><li>결과: 텍스트 편집, 복사, TXT 다운로드</li><li>처리: 브라우저 내 OCR, 이미지 서버 업로드 없음</li></ul><p>최초 사용 시 OCR 엔진과 언어 데이터를 외부 CDN에서 내려받으므로 인터넷 연결이 필요합니다. 인식 정확도와 처리 시간은 이미지 품질 및 기기 성능에 따라 달라집니다.</p>
 <h2>자주 묻는 질문</h2>{faq.map(item=><div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
 <h2>함께 사용하면 좋은 도구</h2><p><Link href="/image-converter">이미지 파일 변환기</Link>에서 사진 형식을 바꾸거나 <Link href="/text-tools">문서·텍스트 도구</Link>에서 추출한 글자를 정리해 보세요.</p>
 </article></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd).replace(/</g,"\\u003c")}} /></main>;
}
