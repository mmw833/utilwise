import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogTagArchive from "@/components/BlogTagArchive";
import { listPublishedPostsByTag } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const posts = await listPublishedPostsByTag("ko", tag, 500);
  if (posts.length === 0) return { title: "태그를 찾을 수 없습니다 | UTILWISE", robots: { index: false, follow: true } };
  return {
    title: `#${tag} 관련 글 | UTILWISE 블로그`,
    description: `${tag} 주제와 관련된 UTILWISE의 실용적인 정보와 가이드를 모았습니다.`,
    robots: posts.length < 2 ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
  };
}

export default async function BlogTagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await listPublishedPostsByTag("ko", tag, 500);
  if (posts.length === 0) notFound();
  return <BlogTagArchive tag={tag} posts={posts} language="ko" />;
}
