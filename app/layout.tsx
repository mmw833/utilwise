import type { Metadata } from "next";
import "./globals.css";
import BlogVisitorTracker from "@/components/BlogVisitorTracker";

const siteUrl = "https://utilwise.kr";

export const metadata: Metadata = {
  title: "유틸와이즈 UTILWISE | 무료 계산기·온라인 도구",
  description: "유틸와이즈(UTILWISE)에서 생활 계산기, 무료 온라인 도구, 이미지·PDF 변환과 심리테스트를 이용하세요.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
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
    title: "유틸와이즈 UTILWISE | 무료 계산기·온라인 도구",
    description: "유틸와이즈(UTILWISE)에서 생활 계산기, 무료 온라인 도구, 이미지·PDF 변환과 심리테스트를 이용하세요.",
    url: siteUrl,
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "유틸와이즈 UTILWISE | 무료 계산기·온라인 도구",
    description: "유틸와이즈(UTILWISE)에서 생활 계산기, 무료 온라인 도구, 이미지·PDF 변환과 심리테스트를 이용하세요.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><BlogVisitorTracker />{children}</body></html>;
}
