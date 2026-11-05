import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UTILWISE | 일상에 필요한 스마트 계산기",
  description: "부동산, 금융, 직장인 생활에 필요한 무료 계산기를 한곳에서 간편하게 이용하세요.",
  metadataBase: new URL("https://utilwise.kr"),
  verification: {
    other: {
      "naver-site-verification": "9768ab8d71b09c1ea9daa35e9442e8bfcf0d442b"
    }
  },
  openGraph: {
    title: "UTILWISE | Simple Tools for Everyday Life",
    description: "일상에 필요한 계산과 도구를 한곳에서.",
    url: "https://utilwise.kr",
    siteName: "UTILWISE",
    locale: "ko_KR",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
