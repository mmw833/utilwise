import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://utilwise.kr";

export const metadata: Metadata = {
  title: "UTILWISE | 무료 생활 계산기·텍스트 도구·심리테스트",
  description: "평수·날짜·대출·연봉·퇴직금 계산기부터 글자 수 세기, 텍스트 비교, 발표시간 계산과 성격·심리테스트까지 무료로 이용하세요.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/", languages: { "ko-KR": "/", en: "/en" } },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    other: { "naver-site-verification": "9768ab8d71b09c1ea9daa35e9442e8bfcf0d442b" },
  },
  openGraph: {
    title: "UTILWISE | 무료 생활 계산기·텍스트 도구·심리테스트",
    description: "평수·대출·연봉·퇴직금 계산, 문서 텍스트 도구와 무료 성격·심리테스트를 한곳에서 이용하세요.",
    url: siteUrl,
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UTILWISE | 무료 생활 계산기·텍스트 도구·심리테스트",
    description: "평수·날짜·대출·연봉·퇴직금 계산기, 문서 텍스트 도구와 성격·심리테스트를 무료로 이용하세요.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
