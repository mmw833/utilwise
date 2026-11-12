import Link from "next/link";
import type { BlogPost } from "@/lib/blog/posts";
import BlogMarkdown from "@/components/BlogMarkdown";

export default function BlogArticle({ post, language }: { post: BlogPost; language: "ko" | "en" }) {
  const en = language === "en";
  const base = en ? "/en/blog" : "/blog";
  const home = en ? "/en" : "/";
  const tools = en ? "/en/online-tools" : "/online-tools";
  const date = new Intl.DateTimeFormat(en ? "en-US" : "ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(post.published_at * 1000));
  return <main className="journal-page journal-article-page">
    <header className="journal-header">
      <Link href={home} className="journal-brand" aria-label="UTILWISE home">UTIL<span>WISE</span></Link>
      <nav className="journal-nav" aria-label={en ? "Main navigation" : "주요 메뉴"}>
        <Link href={home}>{en ? "Home" : "홈"}</Link>
        <Link href={base}>{en ? "Journal" : "블로그"}</Link>
        <Link href={tools}>{en ? "Explore tools" : "도구 둘러보기"}</Link>
      </nav>
      <div className="journal-language"><Link href="/blog" aria-current={!en ? "page" : undefined}>KO</Link><span>/</span><Link href="/en/blog" aria-current={en ? "page" : undefined}>EN</Link></div>
    </header>

    <div className="journal-article-breadcrumb"><Link href={home}>{en ? "Home" : "홈"}</Link><span>/</span><Link href={base}>{en ? "Journal" : "블로그"}</Link><span>/</span><span>{post.category_name || (en ? "Article" : "아티클")}</span></div>

    <article className="journal-article">
      <header className="journal-article-hero">
        <div className="journal-article-heading">
          <div className="journal-article-meta">{post.category_name && <span className="journal-article-category">{post.category_name}</span>}<time dateTime={new Date(post.published_at * 1000).toISOString()}>{date}</time><span>{post.view_count.toLocaleString(en ? "en-US" : "ko-KR")} {en ? "views" : "조회"}</span></div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          {(() => { let tags: string[] = []; try { tags = JSON.parse(post.tags_json || "[]") as string[]; } catch {} return tags.length ? <div className="journal-article-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null; })()}
          <div className="journal-article-byline"><span className="journal-byline-mark">U.</span><div><strong>UTILWISE</strong><small>{en ? "Simple Tools for Everyday Life." : "일상을 더 편리하게 만드는 유용한 정보"}</small></div></div>
        </div>
        <div className="journal-article-cover" aria-hidden="true">{post.cover_image_key ? <img src={`/api/blog/images/${post.cover_image_key.split("/").map(encodeURIComponent).join("/")}`} alt="" /> : <><span>UTILWISE JOURNAL</span><strong>U.</strong><i>✳</i><small>IDEAS FOR EVERYDAY</small></>}</div>
      </header>

      <div className="journal-article-layout">
        <aside className="journal-article-aside"><Link href={base}>← {en ? "All stories" : "전체 글"}</Link><span>{en ? "A USEFUL READ" : "USEFUL READ"}</span></aside>
        <div className="journal-article-content">
          <BlogMarkdown content={post.content_md} />
          <div className="journal-article-end"><span>✳</span><p>{en ? "Make everyday a little easier." : "오늘의 일상을 조금 더 편리하게."}</p></div>
        </div>
      </div>
    </article>

    <section className="journal-article-cta"><div><span className="journal-eyebrow">{en ? "KEEP EXPLORING" : "KEEP EXPLORING"}</span><h2>{en ? "A little tool can make a big difference." : "작은 도구 하나가 일상을 바꿉니다."}</h2><p>{en ? "Discover free, practical tools for your everyday tasks." : "일상에 바로 활용할 수 있는 무료 생활 도구를 만나보세요."}</p></div><Link href={tools}>{en ? "Explore useful tools" : "유용한 도구 둘러보기"} ↗</Link></section>
    <footer className="journal-footer"><Link href={home} className="journal-brand">UTIL<span>WISE</span></Link><p>{en ? "Useful tools and thoughtful ideas for everyday life." : "일상에 필요한 유용한 도구와 더 나은 아이디어."}</p><div><Link href={home}>{en ? "Home" : "홈"}</Link><Link href={base}>{en ? "Journal" : "블로그"}</Link><Link href={tools}>{en ? "Tools" : "도구"}</Link></div><small>© {new Date().getFullYear()} UTILWISE · Simple Tools for Everyday Life.</small></footer>
  </main>;
}
