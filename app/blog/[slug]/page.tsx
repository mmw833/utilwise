import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/BlogArticle";
import BlogViewTracker from "@/components/BlogViewTracker";
import { getPublishedPostBySlug } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug("ko", slug);
  if (!post) return { title: "게시글을 찾을 수 없습니다 | UTILWISE" };
  return {
    title: post.seo_title || `${post.title} | UTILWISE 블로그`,
    description: post.seo_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.seo_title || post.title, description: post.seo_description || post.excerpt, url: `https://utilwise.kr/blog/${post.slug}`, siteName: "UTILWISE", locale: "ko_KR", type: "article", publishedTime: new Date(post.published_at * 1000).toISOString() },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug("ko", slug);
  if (!post) notFound();
  return <><BlogArticle post={post} language="ko" /><BlogViewTracker language="ko" slug={slug} /></>;
}
