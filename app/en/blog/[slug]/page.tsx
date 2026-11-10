import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/BlogArticle";
import { getPublishedPostBySlug } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug("en", slug);
  if (!post) return { title: "Article not found | UTILWISE" };
  return {
    title: post.seo_title || `${post.title} | UTILWISE Blog`,
    description: post.seo_description || post.excerpt,
    alternates: { canonical: `/en/blog/${post.slug}` },
    openGraph: { title: post.seo_title || post.title, description: post.seo_description || post.excerpt, url: `https://utilwise.kr/en/blog/${post.slug}`, siteName: "UTILWISE", locale: "en_US", type: "article", publishedTime: new Date(post.published_at * 1000).toISOString() },
  };
}

export default async function EnglishBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug("en", slug);
  if (!post) notFound();
  return <><BlogArticle post={post} language="en" /><script dangerouslySetInnerHTML={{ __html: `fetch("/api/blog/view",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({language:"en",slug:${JSON.stringify(slug)}})}).catch(()=>{});` }} /></>;
}
