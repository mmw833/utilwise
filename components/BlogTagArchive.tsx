import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/posts";

function formatDate(timestamp: number, en: boolean) {
  return new Intl.DateTimeFormat(en ? "en-US" : "ko-KR", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(timestamp * 1000));
}

export default function BlogTagArchive({ tag, posts, language }: { tag: string; posts: BlogPostSummary[]; language: "ko" | "en" }) {
  const en = language === "en";
  const base = en ? "/en/blog" : "/blog";
  const home = en ? "/en" : "/";
  return <main className="journal-page">
    <header className="journal-header">
      <Link href={home} className="journal-brand">UTIL<span>WISE</span></Link>
      <nav className="journal-nav" aria-label={en ? "Main navigation" : "주요 메뉴"}>
        <Link href={home}>{en ? "Home" : "홈"}</Link>
        <Link href={base}>{en ? "Journal" : "블로그"}</Link>
        <Link href={en ? "/en/online-tools" : "/online-tools"}>{en ? "Explore tools" : "도구 둘러보기"}</Link>
      </nav>
      <div className="journal-language"><Link href="/blog">KO</Link><span>/</span><Link href="/en/blog">EN</Link></div>
    </header>
    <section className="journal-section">
      <div className="journal-section-heading">
        <div><span className="journal-eyebrow">{en ? "TOPIC ARCHIVE" : "태그별 콘텐츠"}</span><h1>{tag}</h1></div>
        <Link href={base}>{en ? "All articles" : "전체 글 보기"} ↗</Link>
      </div>
      <div className="journal-latest-grid">
        {posts.map((post, index) => <article className={"journal-card journal-card-tone-" + (index % 4)} key={post.id}>
          <Link href={base + "/" + post.slug} className="journal-card-link">
            <div className="journal-card-art" aria-hidden="true">
              {post.cover_image_key ? <img src={"/api/blog/images/" + post.cover_image_key.split("/").map(encodeURIComponent).join("/")} alt="" loading="lazy" /> : <span className="journal-art-symbol">U.</span>}
            </div>
            <div className="journal-card-copy"><h2>{post.title}</h2><div className="journal-card-meta">{post.category_name && <span className="blog-tag">{post.category_name}</span>}<time dateTime={new Date(post.published_at * 1000).toISOString()}>{formatDate(post.published_at, en)}</time></div></div>
          </Link>
        </article>)}
      </div>
    </section>
    <footer className="journal-footer"><Link href={home} className="journal-brand">UTIL<span>WISE</span></Link><p>{en ? "Useful tools and thoughtful ideas for everyday life." : "일상에 필요한 유용한 도구와 더 나은 아이디어."}</p></footer>
  </main>;
}
