"use client";

import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/posts";

function dateLabel(timestamp: number, locale: "ko-KR" | "en-US") {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(timestamp * 1000));
}

export default function BlogFeed({ popular, posts, language }: { popular: BlogPostSummary[]; posts: BlogPostSummary[]; language: "ko" | "en" }) {
  const en = language === "en";
  const locale = en ? "en-US" : "ko-KR";
  const base = en ? "/en/blog" : "/blog";
  const home = en ? "/en" : "/";
  const tools = en ? "/en/online-tools" : "/online-tools";
  const card = (post: BlogPostSummary, index: number, featured = false) => (
    <article className={`journal-card journal-card-tone-${index % 4}${featured ? " journal-card-featured" : ""}`} key={post.id}>
      <Link href={`${base}/${post.slug}`} className="journal-card-link">
        <div className="journal-card-art" aria-hidden="true">
          {post.cover_image_key ? <img src={`/api/blog/images/${post.cover_image_key.split("/").map(encodeURIComponent).join("/")}`} alt="" loading="lazy" /> : <><span className="journal-art-kicker">UTILWISE JOURNAL</span><span className="journal-art-symbol">{["U.", "✳", "↗", "◎"][index % 4]}</span><span className="journal-art-index">{String(index + 1).padStart(2, "0")}</span></>}
        </div>
        <div className="journal-card-copy">
          <div className="journal-card-meta">{post.category_name && <span className="blog-tag">{post.category_name}</span>}<time dateTime={new Date(post.published_at * 1000).toISOString()}>{dateLabel(post.published_at, locale)}</time></div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <span className="journal-read">{en ? "Read article" : "글 읽기"} <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );

  return <main className="journal-page">
    <header className="journal-header">
      <Link href={home} className="journal-brand" aria-label="UTILWISE home">UTIL<span>WISE</span></Link>
      <nav className="journal-nav" aria-label={en ? "Main navigation" : "주요 메뉴"}>
        <Link href={home}>{en ? "Home" : "홈"}</Link>
        <span aria-current="page">{en ? "Journal" : "블로그"}</span>
        <Link href={tools}>{en ? "Explore tools" : "도구 둘러보기"}</Link>
      </nav>
      <div className="journal-language"><Link href="/blog" aria-current={!en ? "page" : undefined}>KO</Link><span>/</span><Link href="/en/blog" aria-current={en ? "page" : undefined}>EN</Link></div>
    </header>

    <section className="journal-hero">
      <div className="journal-hero-copy">
        <span className="journal-eyebrow">UTILWISE JOURNAL <i /></span>
        <h1>{en ? <>Ideas that make<br />everyday life easier.</> : <>일상을 더 편리하게 만드는<br /><em>유용한 이야기</em></>}</h1>
        <p>{en ? "Useful perspectives, practical guides and fresh ideas for a smarter everyday." : "생활과 디지털, 일과 취미까지. 더 나은 일상을 위한 정보와 실용적인 가이드를 전합니다."}</p>
        <div className="journal-hero-actions">
          <a href="#latest" className="journal-primary-link">{en ? "Explore articles" : "콘텐츠 둘러보기"} <span>↓</span></a>
          <Link href={tools} className="journal-secondary-link">{en ? "Discover useful tools" : "유용한 도구 살펴보기"} ↗</Link>
        </div>
      </div>
      <div className="journal-hero-art" aria-hidden="true">
        <div className="journal-art-orbit journal-art-orbit-one" />
        <div className="journal-art-orbit journal-art-orbit-two" />
        <div className="journal-art-paper"><span>U.</span><small>MAKE EVERYDAY<br />A LITTLE EASIER</small><i>✳</i></div>
        <div className="journal-art-caption">TOOLS · IDEAS · EVERYDAY</div>
      </div>
    </section>

    <section className="journal-section journal-popular">
      <div className="journal-section-heading"><div><span className="journal-eyebrow">{en ? "READER FAVORITES" : "READERS' PICKS"}</span><h2>{en ? "Popular reads" : "인기글"}</h2></div><p>{en ? "The articles readers come back to." : "많이 읽힌 콘텐츠를 모아 보여드립니다."}</p></div>
      {popular.length > 0 ? <div className="journal-feature-grid">{popular.slice(0, 3).map((post, index) => card(post, index, index === 0))}</div> : <div className="journal-section-empty">{en ? "Popular articles will appear here as readers discover the journal." : "게시글이 발행되고 독자들의 조회가 쌓이면 인기글을 이곳에 보여드립니다."}</div>}
    </section>

    <section className="journal-section journal-latest" id="latest">
      <div className="journal-section-heading"><div><span className="journal-eyebrow">{en ? "FRESH FROM THE JOURNAL" : "FRESH FROM THE JOURNAL"}</span><h2>{en ? "Latest articles" : "최신글"}</h2></div><p>{en ? "New ideas, guides and useful reads." : "새롭게 업데이트되는 정보와 가이드"}</p></div>
      {posts.filter((post) => !popular.some((item) => item.id === post.id)).length > 0 ? <div className="journal-latest-grid">{posts.filter((post) => !popular.some((item) => item.id === post.id)).map((post, index) => card(post, index + 3))}</div> : <div className="journal-empty">
        <div className="journal-empty-art" aria-hidden="true"><span>U.</span><i>✳</i></div>
        <div><span className="journal-eyebrow">{en ? "GOOD THINGS TAKE A LITTLE TIME" : "COMING SOON"}</span><h3>{en ? "Something useful is on its way." : "유용한 이야기를 준비하고 있어요."}</h3><p>{en ? "We’re preparing practical stories and guides for your everyday. In the meantime, discover the tools that make life a little easier." : "일상에 도움이 되는 실용적인 콘텐츠를 준비하고 있습니다. 그동안 UTILWISE의 다양한 도구를 둘러보세요."}</p><Link href={tools}>{en ? "Explore UTILWISE tools" : "UTILWISE 도구 둘러보기"} ↗</Link></div>
      </div>}
    </section>

    <footer className="journal-footer"><Link href={home} className="journal-brand">UTIL<span>WISE</span></Link><p>{en ? "Useful tools and thoughtful ideas for everyday life." : "일상에 필요한 유용한 도구와 더 나은 아이디어."}</p><div><Link href={home}>{en ? "Home" : "홈"}</Link><Link href={tools}>{en ? "Tools" : "도구"}</Link><Link href="/about">{en ? "About" : "소개"}</Link></div><small>© {new Date().getFullYear()} UTILWISE · Simple Tools for Everyday Life.</small></footer>
  </main>;
}
