import type { ReactNode } from "react";

function safeHref(value: string): string | null {
  const href = value.trim();
  if (/^(https?:\/\/|mailto:)/i.test(href)) return href;
  return null;
}

function safeImageSrc(value: string): string | null {
  const src = value.trim();
  return /^\/api\/blog\/images\/blog\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/i.test(src) ? src : null;
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const image = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const src = safeImageSrc(image[2]);
      if (!src) return null;
      const meta = image[1].match(/^(.*?)\|width=(100%|80%|60%|40%)\|align=(left|center|right)$/);
      const alt = (meta ? meta[1] : image[1]).slice(0, 180);
      const width = meta ? meta[2] : "100%";
      const align = meta ? meta[3] : "center";
      return <span key={index} className={`blog-markdown-image is-${align}`} style={{ width }}><img src={src} alt={alt} loading="lazy" /></span>;
    }
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      return href ? <a key={index} href={href} rel="nofollow noopener noreferrer" target="_blank">{link[1]}</a> : link[1];
    }
    return part;
  });
}

/** Small safe Markdown subset for editorial posts. Raw HTML is rendered as text, never injected. */
export default function BlogMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  const flushParagraph = () => {
    if (paragraph.length) { blocks.push(<p key={`p-${blocks.length}`}>{inline(paragraph.join(" "))}</p>); paragraph = []; }
  };
  const flushList = () => {
    if (list.length) { blocks.push(<ul key={`ul-${blocks.length}`}>{list.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>); list = []; }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); continue; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const level = heading[1].length;
      const contentNode = inline(heading[2]);
      blocks.push(level === 1 ? <h2 key={blocks.length}>{contentNode}</h2> : level === 2 ? <h3 key={blocks.length}>{contentNode}</h3> : <h4 key={blocks.length}>{contentNode}</h4>);
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) { flushParagraph(); list.push(trimmed.replace(/^[-*]\s+/, "")); continue; }
    flushList();
    if (/^>\s?/.test(trimmed)) { flushParagraph(); blocks.push(<blockquote key={blocks.length}>{inline(trimmed.replace(/^>\s?/, ""))}</blockquote>); continue; }
    paragraph.push(trimmed);
  }
  flushParagraph(); flushList();
  return <div className="blog-markdown">{blocks}</div>;
}
