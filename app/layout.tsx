import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://utilwise.kr";

export const metadata: Metadata = {
  title: "UTILWISE | 일상에 필요한 스마트 계산기",
  description: "평수 변환, 대출 이자, 부동산 중개수수료, 연봉 실수령액 등 일상에 필요한 무료 계산기를 간편하게 이용하세요.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "9768ab8d71b09c1ea9daa35e9442e8bfcf0d442b",
    },
  },
  openGraph: {
    title: "UTILWISE | Simple Tools for Everyday Life",
    description: "평수, 금융, 부동산, 직장인 생활에 필요한 무료 계산기를 한곳에서 간편하게 이용하세요.",
    url: siteUrl,
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UTILWISE | 일상에 필요한 스마트 계산기",
    description: "일상에 필요한 무료 계산기를 한곳에서 간편하게 이용하세요.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
