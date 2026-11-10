import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/posts";

function dateLabel(timestamp: number, locale: "ko-KR" | "en-US") {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(timestamp * 1000));
}

export default function BlogFeed({ popular, posts, language }: { popular: BlogPostSummary[]; posts: BlogPostSummary[]; language: "ko" | "en" }) {
  const en = language === "en";
  const locale = en ? "en-US" : "ko-KR";
  const base = en ? "/en/blog" : "/blog";
  const empty = en ? "New articles are coming soon." : "새로운 글을 준비하고 있습니다.";
  const card = (post: BlogPostSummary, index: number, featured = false) => (
    <article className={`blog-card${featured ? " blog-card-featured" : ""}`} key={post.id}>
      <Link href={`${base}/${post.slug}`} className="blog-card-link">
        <div className="blog-card-image">{post.cover_image_key ? <span>{en ? "UTILWISE BLOG" : "UTILWISE 블로그"}</span> : <span className="blog-image-mark">U.</span>}</div>
        <div className="blog-card-copy">
          <div className="blog-card-meta">{post.category_name && <span className="blog-tag">{post.category_name}</span>}<time dateTime={new Date(post.published_at * 1000).toISOString()}>{dateLabel(post.published_at, locale)}</time></div>
          <h3>{post.title}</h3><p>{post.excerpt}</p>
          <span className="blog-read">{en ? "Read article" : "글 읽기"} <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
  return <main className="blog-shell">
    <section className="blog-hero"><Link href={en ? "/en" : "/"} className="blog-back">← {en ? "UTILWISE home" : "UTILWISE 홈"}</Link><div className="blog-eyebrow">UTILWISE JOURNAL</div><h1>{en ? "Ideas for everyday life" : "일상에 도움이 되는 이야기"}</h1><p>{en ? "Useful insights, practical guides, and thoughtful reads." : "생활에 유용한 정보와 실용적인 가이드를 전합니다."}</p></section>
    {popular.length > 0 && <section className="blog-section"><div className="blog-section-heading"><div><span>{en ? "MOST READ" : "POPULAR"}</span><h2>{en ? "Popular articles" : "인기글"}</h2></div></div><div className="blog-grid blog-grid-popular">{popular.map((post, i) => card(post, i, true))}</div></section>}
    <section className="blog-section"><div className="blog-section-heading"><div><span>{en ? "THE LATEST" : "LATEST"}</span><h2>{en ? "All articles" : "전체 글"}</h2></div><p>{en ? "Latest first" : "최신순으로 정렬됩니다"}</p></div>
      {posts.length ? <div className="blog-grid">{posts.map((post, i) => card(post, i))}</div> : <div className="blog-empty">{empty}</div>}
    </section>
    <footer className="blog-footer">© {new Date().getFullYear()} UTILWISE · Simple Tools for Everyday Life.</footer>
  </main>;
}
