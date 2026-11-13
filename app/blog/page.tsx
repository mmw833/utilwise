import type { Metadata } from "next";
import BlogFeed from "@/components/BlogFeed";
import BlogVisitorTracker from "@/components/BlogVisitorTracker";
import { getBlogVisitorStats, getFeaturedPost, listPopularPosts, listPublishedPosts } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "UTILWISE 블로그 | 일상에 도움이 되는 이야기",
  description: "생활에 유용한 정보와 실용적인 가이드, 일상 속 궁금증을 풀어주는 UTILWISE 블로그입니다.",
  alternates: { canonical: "/blog", languages: { "ko-KR": "/blog", en: "/en/blog" } },
  openGraph: { title: "UTILWISE 블로그", description: "일상에 도움이 되는 정보와 실용적인 가이드", url: "https://utilwise.kr/blog", siteName: "UTILWISE", locale: "ko_KR", type: "website" },
};

export default async function BlogPage() {
  const [popular, posts, featured, visitorStats] = await Promise.all([listPopularPosts("ko", 8), listPublishedPosts("ko", 30), getFeaturedPost("ko"), getBlogVisitorStats()]);
  return <><BlogVisitorTracker /><BlogFeed popular={popular} posts={posts} featured={featured} visitorStats={visitorStats} language="ko" /></>;
}
