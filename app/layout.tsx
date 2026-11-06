import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://utilwise.kr";

export const metadata: Metadata = {
  title: "UTILWISE | 일상에 필요한 모든 도구",
  description: "일상에 필요한 다양한 계산기와 테스트를 한곳에서 쉽고 간편하게 이용하세요.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    other: { "naver-site-verification": "9768ab8d71b09c1ea9daa35e9442e8bfcf0d442b" },
  },
  openGraph: {
    title: "UTILWISE | 일상에 필요한 모든 도구",
    description: "다양한 생활 계산기와 테스트를 한곳에서 간편하게 이용하세요.",
    url: siteUrl,
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UTILWISE | 일상에 필요한 모든 도구",
    description: "일상에 필요한 다양한 계산기와 테스트를 한곳에서 간편하게 이용하세요.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
