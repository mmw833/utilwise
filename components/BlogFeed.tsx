"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPostSummary } from "@/lib/blog/posts";

function dateLabel(timestamp: number, locale: "ko-KR" | "en-US") {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(timestamp * 1000));
}

export default function BlogFeed({ popular, posts, featured, visitorStats, language }: { popular: BlogPostSummary[]; posts: BlogPostSummary[]; featured: BlogPostSummary | null; visitorStats: { today: number; total: number }; language: "ko" | "en" }) {
  const en = language === "en";
  const locale = en ? "en-US" : "ko-KR";
  const base = en ? "/en/blog" : "/blog";
  const home = en ? "/en" : "/";
  const tools = en ? "/en/online-tools" : "/online-tools";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest");
  const categories = useMemo(() => Array.from(new Set(posts.map((post) => post.category_name).filter((name): name is string => Boolean(name)))).sort((a, b) => a.localeCompare(b, locale)), [posts, locale]);
  const query = search.trim().toLocaleLowerCase(en ? "en-US" : "ko-KR");
  const matches = (post: BlogPostSummary) => {
    let tags = "";
    try { const parsed = JSON.parse(post.tags_json || "[]"); tags = Array.isArray(parsed) ? parsed.join(" ") : ""; } catch {}
    const haystack = [post.title, post.excerpt, post.category_name || "", tags].join(" ").toLocaleLowerCase(en ? "en-US" : "ko-KR");
    return (!query || haystack.includes(query)) && (selectedCategory === "all" || post.category_name === selectedCategory);
  };
  const filteredPosts = useMemo(() => posts.filter(matches), [posts, query, selectedCategory]);
  const filteredPopular = useMemo(() => popular.filter(matches), [popular, query, selectedCategory]);
  const sortedPosts = useMemo(() => [...filteredPosts].sort((a, b) => sortOrder === "latest" ? b.published_at - a.published_at : b.view_count - a.view_count), [filteredPosts, sortOrder]);
  const visibleLatest = sortedPosts;
  const card = (post: BlogPostSummary, index: number, featured = false) => (
    <article className={`journal-card journal-card-tone-${index % 4}${featured ? " journal-card-featured" : ""}`} key={post.id}>
      <Link href={`${base}/${post.slug}`} className="journal-card-link">
        <div className="journal-card-art" aria-hidden="true">
          {post.cover_image_key ? <img src={`/api/blog/images/${post.cover_image_key.split("/").map(encodeURIComponent).join("/")}`} alt="" loading="lazy" /> : <><span className="journal-art-kicker">UTILWISE JOURNAL</span><span className="journal-art-symbol">{["U.", "✳", "↗", "◎"][index % 4]}</span><span className="journal-art-index">{String(index + 1).padStart(2, "0")}</span></>}
        </div>
        <div className="journal-card-copy">
          <h3>{post.title}</h3>
          <div className="journal-card-meta">{post.category_name && <span className="blog-tag">{post.category_name}</span>}<time dateTime={new Date(post.published_at * 1000).toISOString()}>{dateLabel(post.published_at, locale)}</time><small className="journal-card-views">{post.view_count.toLocaleString(locale)} {en ? "views" : "조회"}</small></div>
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
      <div className="journal-visitor-stats"><span>TODAY <b>{visitorStats.today.toLocaleString(locale)}</b></span><i>·</i><span>TOTAL <b>{visitorStats.total.toLocaleString(locale)}</b></span></div>
      <div className="journal-hero-art" aria-hidden="true">
        <div className="journal-art-orbit journal-art-orbit-one" />
        <div className="journal-art-orbit journal-art-orbit-two" />
        <div className="journal-art-paper"><span>U.</span><small>MAKE EVERYDAY<br />A LITTLE EASIER</small><i>✳</i></div>
        <div className="journal-art-caption">TOOLS · IDEAS · EVERYDAY</div>
      </div>
    </section>

    {(() => { const lead = featured || posts[0] || null; if (!lead) return null; return <section className="journal-featured"><Link href={base + "/" + lead.slug} className="journal-featured-link"><div className="journal-featured-image">{lead.cover_image_key ? <img src={"/api/blog/images/" + lead.cover_image_key.split("/").map(encodeURIComponent).join("/")} alt="" /> : <div className="journal-featured-placeholder"><span>UTILWISE JOURNAL</span><strong>U.</strong></div>}</div><div className="journal-featured-copy"><h2>{lead.title}</h2><div className="journal-featured-meta">{lead.category_name && <span>{lead.category_name}</span>}<time dateTime={new Date(lead.published_at * 1000).toISOString()}>{dateLabel(lead.published_at, locale)}</time><small className="journal-card-views">{lead.view_count.toLocaleString(locale)} {en ? "views" : "조회"}</small></div></div></Link></section>; })()}
    <section className="journal-section journal-discover" id="latest">
      <div className="journal-section-heading"><div><span className="journal-eyebrow">EXPLORE THE JOURNAL</span><h2>{en ? "Find your next read" : "관심 있는 이야기 찾기"}</h2></div><p>{en ? "Search and browse practical articles." : "검색하거나 주제별로 콘텐츠를 둘러보세요."}</p></div>
      <div className="journal-discovery-tools">
        <label className="journal-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={en ? "Search articles, topics, keywords..." : "게시글 제목, 소개, 태그 검색"} aria-label={en ? "Search blog posts" : "블로그 게시글 검색"} />{search && <button type="button" onClick={() => setSearch("")} aria-label={en ? "Clear search" : "검색어 지우기"}>×</button>}</label>
        <label className="journal-sort-label"><span>{en ? "Sort" : "정렬"}</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "latest" | "popular")}><option value="latest">{en ? "Newest" : "최신순"}</option><option value="popular">{en ? "Most viewed" : "인기순"}</option></select></label>
      </div>
      <div className="journal-category-filters" aria-label={en ? "Filter by category" : "카테고리 필터"}>
        <button type="button" className={selectedCategory === "all" ? "is-active" : ""} onClick={() => setSelectedCategory("all")}>{en ? "All articles" : "전체"}</button>
        {categories.map((category) => <button type="button" key={category} className={selectedCategory === category ? "is-active" : ""} onClick={() => setSelectedCategory(category)}>{category}</button>)}
      </div>
      <section className="journal-section journal-popular">
        <div className="journal-section-heading"><div><span className="journal-eyebrow">{en ? "READER FAVORITES" : "READERS' PICKS"}</span><h2>{en ? "Popular reads" : "인기글"}</h2></div><p>{en ? "The articles readers come back to." : "많이 읽힌 콘텐츠를 모아 보여드립니다."}</p></div>
        {filteredPopular.length > 0 ? <div className="journal-popular-scroller">{filteredPopular.slice(0, 8).map((post, index) => card(post, index))}</div> : <div className="journal-section-empty">{query || selectedCategory !== "all" ? (en ? "No popular articles match these filters." : "선택한 조건에 맞는 인기글이 없습니다.") : (en ? "Popular articles will appear here as readers discover the journal." : "게시글이 발행되고 조회가 쌓이면 인기글을 보여드립니다.")}</div>}
      </section>
      <section className="journal-section journal-latest">
        <div className="journal-section-heading"><div><span className="journal-eyebrow">FRESH FROM THE JOURNAL</span><h2>{en ? "All articles" : "전체글"}</h2></div><p>{en ? "New ideas, guides and useful reads." : "새롭게 업데이트되는 정보와 가이드"}</p></div>
      {visibleLatest.length > 0 ? <div className="journal-latest-grid">{visibleLatest.map((post, index) => card(post, index + 3))}</div> : <div className="journal-empty">
        <div className="journal-empty-art" aria-hidden="true"><span>U.</span><i>✳</i></div>
        <div><span className="journal-eyebrow">{query || selectedCategory !== "all" ? (en ? "NO MATCHES" : "검색 결과 없음") : "COMING SOON"}</span><h3>{query || selectedCategory !== "all" ? (en ? "No articles found." : "조건에 맞는 게시글이 없습니다.") : (en ? "Something useful is on its way." : "유용한 이야기를 준비하고 있어요.")}</h3><p>{query || selectedCategory !== "all" ? (en ? "Try another keyword or category." : "검색어를 바꾸거나 전체 카테고리를 선택해 보세요.") : (en ? "We’re preparing practical stories and guides for your everyday. In the meantime, discover the tools that make life a little easier." : "일상에 도움이 되는 실용적인 콘텐츠를 준비하고 있습니다. 그동안 UTILWISE의 다양한 도구를 둘러보세요.")}</p><Link href={tools}>{en ? "Explore UTILWISE tools" : "UTILWISE 도구 둘러보기"} ↗</Link></div>
      </div>}
      </section>
    </section>

    <footer className="journal-footer"><Link href={home} className="journal-brand">UTIL<span>WISE</span></Link><p>{en ? "Useful tools and thoughtful ideas for everyday life." : "일상에 필요한 유용한 도구와 더 나은 아이디어."}</p><div><Link href={home}>{en ? "Home" : "홈"}</Link><Link href={tools}>{en ? "Tools" : "도구"}</Link><Link href="/about">{en ? "About" : "소개"}</Link></div><small>© {new Date().getFullYear()} UTILWISE · Simple Tools for Everyday <Link className="journal-admin-entry" href="/admin/blog/login" aria-label={en ? "Admin login" : "관리자 로그인"}>Life</Link>.</small></footer>
  </main>;
}
