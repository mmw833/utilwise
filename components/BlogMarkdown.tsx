import type { ReactNode } from "react";

function safeHref(value: string): string | null {
  const href = value.trim();
  if (/^(https?:\/\/|mailto:)/i.test(href)) return href;
  return null;
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
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
