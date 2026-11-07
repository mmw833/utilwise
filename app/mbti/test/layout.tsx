import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI 검사 시작 | UTILWISE",
  description: "24개 질문에 답하고 나의 성격유형을 확인해 보세요.",
  alternates: { canonical: "/mbti/test" },
  robots: { index: false, follow: true },
};

export default function MbtiTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
