import { listPublishedPostsForFeed, type BlogLanguage } from "@/lib/blog/posts";

const siteUrl = "https://utilwise.kr";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function cdata(value: string): string {
  return "<![CDATA[" + value.replace(/]]>/g, "]]]]><![CDATA[>") + "]]>";
}
export async function createBlogRss(language: BlogLanguage): Promise<Response> {
  const posts = await listPublishedPostsForFeed(language, 30);
  const isEnglish = language === "en";
  const title = isEnglish ? "UTILWISE Blog" : "UTILWISE 블로그";
  const description = isEnglish ? "Practical guides and useful ideas for everyday life." : "일상에 도움이 되는 실용적인 정보와 가이드";
  const items = posts.map((post) => {
    const url = `${siteUrl}/${isEnglish ? "en/" : ""}blog/${post.slug}`;
    const tags = (() => { try { return JSON.parse(post.tags_json || "[]") as string[]; } catch { return []; } })();
    const body = [post.excerpt, post.content_md].filter(Boolean).join("\n\n");
    return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${cdata(post.excerpt || post.title)}</description>
      <content:encoded>${cdata(body)}</content:encoded>
      <pubDate>${new Date(post.published_at * 1000).toUTCString()}</pubDate>
      <category>${escapeXml(post.category_name || (isEnglish ? "Article" : "아티클"))}</category>
      ${tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
      ${post.cover_image_key ? `<enclosure url="${siteUrl}/api/blog/images/${post.cover_image_key.split("/").map(encodeURIComponent).join("/")}" type="image/jpeg" />` : ""}
    </item>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}/${isEnglish ? "en/blog" : "blog"}</link>
    <description>${escapeXml(description)}</description>
    <language>${isEnglish ? "en-US" : "ko-KR"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
