import type { Metadata } from "next";
import BlogFeed from "@/components/BlogFeed";
import { getBlogVisitorStats, getFeaturedPost, listPopularPosts, listPublishedPosts } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "UTILWISE Blog | Ideas for Everyday Life",
  description: "Useful insights, practical guides, and thoughtful reads from UTILWISE.",
  alternates: { canonical: "/en/blog", languages: { "ko-KR": "/blog", en: "/en/blog" } },
  openGraph: { title: "UTILWISE Blog", description: "Useful insights and practical guides for everyday life.", url: "https://utilwise.kr/en/blog", siteName: "UTILWISE", locale: "en_US", type: "website" },
};

export default async function EnglishBlogPage() {
  const [popular, posts, featured, visitorStats] = await Promise.all([listPopularPosts("en", 8), listPublishedPosts("en", 30), getFeaturedPost("en"), getBlogVisitorStats()]);
  return <BlogFeed popular={popular} posts={posts} featured={featured} visitorStats={visitorStats} language="en" />;
}
