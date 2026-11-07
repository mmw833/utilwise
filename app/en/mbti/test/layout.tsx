import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start the MBTI Personality Test | UTILWISE",
  description: "Answer 24 questions to explore your personality preferences.",
  alternates: { canonical: "/en/mbti/test" },
  robots: { index: false, follow: true },
};

export default function EnglishMbtiTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
