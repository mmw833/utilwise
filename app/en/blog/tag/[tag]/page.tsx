import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogTagArchive from "@/components/BlogTagArchive";
import { listPublishedPostsByTag } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const posts = await listPublishedPostsByTag("en", tag, 500);
  if (posts.length === 0) return { title: "Tag not found | UTILWISE", robots: { index: false, follow: true } };
  return {
    title: `#${tag} articles | UTILWISE Blog`,
    description: `Explore practical UTILWISE articles and guides about ${tag}.`,
    alternates: { canonical: `/en/blog/tag/${encodeURIComponent(tag)}` },
  };
}

export default async function EnglishBlogTagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await listPublishedPostsByTag("en", tag, 500);
  if (posts.length === 0) notFound();
  return <BlogTagArchive tag={tag} posts={posts} language="en" />;
}
