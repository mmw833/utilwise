import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ImageFormatConverter from "../../components/ImageFormatConverter";

export const metadata: Metadata = {
  title: "무료 이미지 변환기 | HEIC·JPG·PNG·WebP 파일 변환 - UTILWISE",
  description: "아이폰 HEIC·HEIF 사진과 JPG, PNG, WebP 이미지를 원하는 형식으로 무료 변환하세요. 여러 파일을 한 번에 처리하고 브라우저에서 안전하게 다운로드할 수 있습니다.",
  alternates: { canonical: "/image-converter", languages: { "ko-KR": "/image-converter", en: "/en/image-converter" } },
  openGraph: { title: "무료 이미지 파일 변환기 | HEIC·JPG·PNG·WebP - UTILWISE", description: "아이폰 HEIC 사진과 JPG, PNG, WebP 이미지 형식을 브라우저에서 간편하게 변환하세요.", url: "https://utilwise.kr/image-converter", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};
const faq = [
  { question: "HEIC와 HEIF 파일도 변환할 수 있나요?", answer: "네. 아이폰 등에서 촬영한 HEIC·HEIF 이미지를 JPG, PNG 또는 WebP로 변환할 수 있습니다. 최초 HEIC 변환 시 브라우저가 변환 모듈을 외부 CDN에서 불러올 수 있습니다." },
  { question: "여러 이미지를 한 번에 변환할 수 있나요?", answer: "네. 여러 파일을 선택해 일괄 변환할 수 있습니다. 파일당 최대 20MB, 가로·세로 각각 최대 12,000px까지 지원합니다." },
  { question: "이미지가 서버에 업로드되나요?", answer: "아니요. 이미지 변환은 브라우저에서 처리되며 사진 파일은 UTILWISE 서버로 업로드되지 않습니다." },
  { question: "투명 배경이 유지되나요?", answer: "PNG와 WebP는 투명도를 유지할 수 있습니다. JPG는 투명도를 지원하지 않아 투명한 영역이 흰색으로 채워집니다." },
  { question: "사진의 촬영 정보도 유지되나요?", answer: "HEIC·HEIF 변환 시 촬영 날짜나 GPS 등 EXIF 메타데이터는 보존되지 않을 수 있습니다." }
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function Page() {
 return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher/></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1>무료 이미지 파일 변환기</h1><p className="sub">아이폰 HEIC·HEIF 사진과 JPG, PNG, WebP 이미지를 필요한 파일 형식으로 간편하게 변환하세요.</p><ImageFormatConverter lang="ko"/><article className="image-tool-guide">
 <h2>이미지 파일 변환이란?</h2><p>이미지 변환은 사진이나 그래픽의 파일 형식을 바꾸는 작업입니다. 기기 호환성, 투명 배경, 웹사이트 업로드와 파일 크기 등 목적에 맞는 형식을 선택할 수 있습니다.</p>
 <h2>지원하는 이미지 형식</h2><ul><li><strong>HEIC·HEIF:</strong> 아이폰 등에서 자주 사용하는 고효율 사진 형식으로 JPG, PNG, WebP로 변환할 수 있습니다.</li><li><strong>JPG:</strong> 사진에 적합하지만 투명 배경은 지원하지 않습니다.</li><li><strong>PNG:</strong> 투명 배경과 선명한 그래픽을 보존하는 데 적합합니다.</li><li><strong>WebP:</strong> 웹에서 효율적으로 사용하기 좋은 이미지 형식입니다.</li></ul>
 <h2>이미지 변환 방법</h2><ol><li>이미지 파일을 선택하거나 업로드 영역에 끌어다 놓습니다.</li><li>JPG, PNG 또는 WebP 중 출력 형식을 선택하고 필요한 경우 품질을 조절합니다.</li><li>변환 결과를 확인하고 파일을 다운로드합니다.</li></ol>
 <h2>지원 범위와 개인정보</h2><ul><li>입력: JPG, PNG, WebP, HEIC·HEIF</li><li>출력: JPG, PNG, WebP</li><li>파일당 최대 20MB, 가로·세로 각각 최대 12,000px</li><li>브라우저 내 처리, 사진 파일 서버 업로드 없음</li></ul><p>여러 이미지를 한 번에 변환할 수 있습니다. HEIC·HEIF 변환 시 최초 1회 외부 CDN에서 변환 모듈을 내려받을 수 있으며 EXIF 촬영 정보는 보존되지 않을 수 있습니다.</p>
 <h2>자주 묻는 질문</h2>{faq.map(item=><div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
 <h2>함께 사용하면 좋은 이미지 도구</h2><p><Link href="/image-compressor">이미지 압축기</Link>로 용량을 줄이거나 <Link href="/image-resizer">이미지 크기 조절기</Link>로 픽셀 크기를 변경할 수 있습니다. 사진에서 글자를 추출하려면 <Link href="/image-to-text">이미지 텍스트 추출기(OCR)</Link>를 이용해 보세요.</p>
 </article></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd).replace(/</g,"\\u003c")}} /></main>;
}
