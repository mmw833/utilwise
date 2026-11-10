import Link from "next/link";
import type { BlogPost } from "@/lib/blog/posts";
import BlogMarkdown from "@/components/BlogMarkdown";

export default function BlogArticle({ post, language }: { post: BlogPost; language: "ko" | "en" }) {
  const en = language === "en";
  const date = new Intl.DateTimeFormat(en ? "en-US" : "ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(post.published_at * 1000));
  return <main className="blog-shell blog-article-shell">
    <header className="blog-article-top"><Link href={en ? "/en/blog" : "/blog"}>← {en ? "All articles" : "블로그 전체 글"}</Link><Link href={en ? "/en" : "/"}>UTILWISE</Link></header>
    <article className="blog-article"><div className="blog-article-meta">{post.category_name && <span className="blog-tag">{post.category_name}</span>}<time>{date}</time><span>{post.view_count.toLocaleString(en ? "en-US" : "ko-KR")} {en ? "views" : "조회"}</span></div><h1>{post.title}</h1><p className="blog-article-excerpt">{post.excerpt}</p><div className="blog-article-divider" /><BlogMarkdown content={post.content_md} /></article>
    <footer className="blog-article-bottom"><Link href={en ? "/en/blog" : "/blog"}>{en ? "← Back to articles" : "← 전체 글로 돌아가기"}</Link></footer>
  </main>;
}
