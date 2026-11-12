import type { Metadata } from "next";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ImageTools from "../../components/ImageTools";
export const metadata: Metadata = {
  title: "사진 용량 줄이기 | JPG·PNG·WebP 이미지 무료 압축 - UTILWISE",
  description: "JPG, PNG, WebP 사진과 이미지 파일 용량을 무료로 줄이세요. 압축 품질과 저장 형식을 선택하고 여러 이미지를 한 번에 처리할 수 있습니다. 파일은 브라우저에서만 처리됩니다.",
  alternates: { canonical: "/image-compressor", languages: { "ko-KR": "/image-compressor", en: "/en/image-compressor" } },
  openGraph: { title: "무료 이미지 압축기", description: "JPG, PNG, WebP 이미지 용량을 브라우저에서 간편하게 줄이세요.", url: "https://utilwise.kr/image-compressor", siteName: "UTILWISE", locale: "ko_KR", type: "website" }
};
export default function Page(){return <main><header className="wrap header"><Link href="/" className="logo">UTIL<span>WISE</span>.</Link><nav className="nav"><Link href="/online-tools">온라인 도구</Link><LanguageSwitcher/></nav></header><section className="wrap section image-tool-page"><div className="eyebrow">UTILWISE ONLINE TOOLS</div><h1>무료 이미지 압축기</h1><p className="sub">JPG, PNG, WebP 이미지의 용량을 줄이고 웹과 문서에 가볍게 사용하세요.</p><ImageTools mode="compress" lang="ko"/><div className="image-tool-guide"><h2>이미지 압축이란?</h2><p>이미지 압축은 이미지의 시각적 품질과 파일 크기 사이의 균형을 조절해 저장 공간과 웹페이지 전송량을 줄이는 작업입니다. 압축 품질을 낮추면 파일이 작아질 수 있지만 세부 표현이 손실될 수 있습니다.</p><h2>이미지 압축기 사용 방법</h2><ol><li>JPG, PNG 또는 WebP 이미지를 선택합니다.</li><li>압축 품질을 조절하고 저장 형식을 선택합니다.</li><li>압축 결과와 원본 용량을 비교한 뒤 파일을 다운로드합니다.</li></ol><p>이미지는 브라우저 안에서 처리되며 UTILWISE 서버로 업로드되지 않습니다. 변환 결과는 원본 파일과 이미지 내용에 따라 달라질 수 있습니다.</p><h2>함께 사용하면 좋은 도구</h2><p><Link href="/image-resizer">이미지 크기 조절기</Link>로 픽셀 크기를 변경하거나 <Link href="/qr-code-generator">QR 코드 생성기</Link>를 이용할 수 있습니다.</p></div></section></main>}