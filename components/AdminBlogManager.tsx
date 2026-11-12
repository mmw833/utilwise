"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BlogMarkdown from "@/components/BlogMarkdown";

type PostStatus = "draft" | "published" | "archived";
type Category = { id: string; slug: string; name_ko: string; name_en: string | null };
type Post = {
  id: string;
  translation_group_id: string;
  language: "ko" | "en";
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  category_id: string | null;
  category_name: string | null;
  tags_json?: string;
  seo_title: string | null;
  seo_description: string | null;
  status: PostStatus;
  view_count: number;
  is_featured: number;
  published_at: number | null;
  updated_at: number;
  cover_image_key: string | null;
};

type Editor = {
  id?: string;
  translation_group_id?: string;
  language: "ko" | "en";
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  category_id: string;
  category_name: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  status: PostStatus;
  cover_image_key: string | null;
};

const emptyEditor = (): Editor => ({
  language: "ko",
  slug: "",
  title: "",
  excerpt: "",
  content_md: "",
  category_id: "",
  category_name: "",
  tags: [],
  seo_title: "",
  seo_description: "",
  status: "draft",
  cover_image_key: null,
});

function dateLabel(timestamp: number | null) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(timestamp * 1000));
}


function escapeEditorHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function markdownToEditorHtml(markdown: string) {
  const inline = (value: string) => escapeEditorHtml(value)
    .replace(/!\[([^\]]*)\]\((\/api\/blog\/images\/[^)]+)\)/g, (_m, meta, src) => { const match = meta.match(/^(.*?)\|width=((?:3[0-9]|[4-9][0-9]|100)%)\|align=(left|center|right)$/); const alt = match ? match[1] : meta; const width = match ? match[2] : "100%"; const align = match ? match[3] : "center"; return '<img src="' + src + '" alt="' + alt + '" data-width="' + width + '" data-align="' + align + '" />'; })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return markdown.replace(/\r\n?/g, "\n").split(/\n{2,}/).map((block) => {
    const value = block.trim();
    if (!value) return "";
    const heading = value.match(/^(#{1,3})\s+([\s\S]+)$/);
    if (heading) return "<h" + heading[1].length + ">" + inline(heading[2]) + "</h" + heading[1].length + ">";
    if (/^(?:[-*]\s+)/m.test(value)) return "<ul>" + value.split("\n").map((line) => "<li>" + inline(line.replace(/^[-*]\s+/, "")) + "</li>").join("") + "</ul>";
    if (/^>\s?/.test(value)) return "<blockquote>" + inline(value.replace(/^>\s?/, "")) + "</blockquote>";
    return "<p>" + inline(value).replace(/\n/g, "<br>") + "</p>";
  }).join("");
}
function editorHtmlToMarkdown(root: HTMLElement) {
  const inline = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (!(node instanceof HTMLElement)) return "";
    const tag = node.tagName.toLowerCase();
    if (tag === "br") return "\n";
    if (tag === "img") {
      const src = node.getAttribute("src") || "";
      if (!src.startsWith("/api/blog/images/blog/")) return "";
      const alt = (node.getAttribute("alt") || "본문 이미지").replace(/[\[\]]/g, " ");
      const width = node.dataset.width && /^([3-9][0-9]|100)%$/.test(node.dataset.width) ? node.dataset.width : "100%";
      const align = node.dataset.align && ["left", "center", "right"].includes(node.dataset.align) ? node.dataset.align : "center";
      return "![" + alt + "|width=" + width + "|align=" + align + "](" + src + ")";
    }
    const content = Array.from(node.childNodes).map(inline).join("");
    if (tag === "strong" || tag === "b") return "**" + content + "**";
    if (tag === "em" || tag === "i") return "*" + content + "*";
    if (tag === "a") {
      const href = node.getAttribute("href") || "";
      return /^https?:\/\//i.test(href) ? "[" + content + "](" + href + ")" : content;
    }
    return content;
  };
  return Array.from(root.children).map((element) => {
    const tag = element.tagName.toLowerCase();
    if (/^h[1-3]$/.test(tag)) return "#".repeat(Number(tag[1])) + " " + inline(element);
    if (tag === "ul" || tag === "ol") return Array.from(element.children).map((item) => "- " + inline(item)).join("\n");
    if (tag === "blockquote") return "> " + inline(element);
    return inline(element).trim();
  }).filter(Boolean).join("\n\n").trim();
}
export default function AdminBlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editor, setEditor] = useState<Editor>(emptyEditor);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"preview" | "split">("preview");
  const contentRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const imageInsertionMarkerRef = useRef<HTMLSpanElement | null>(null);
  const selectedInlineImageRef = useRef<HTMLImageElement | null>(null);
  const [inlineImageWidth, setInlineImageWidth] = useState("100%");
  const [inlineImageAlign, setInlineImageAlign] = useState("center");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postResponse, categoryResponse] = await Promise.all([
        fetch("/api/admin/posts", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);
      if (postResponse.status === 401 || categoryResponse.status === 401) {
        window.location.assign("/admin/blog/login");
        return;
      }
      if (!postResponse.ok || !categoryResponse.ok) throw new Error("관리자 데이터를 불러오지 못했습니다.");
      const [postData, categoryData] = await Promise.all([postResponse.json(), categoryResponse.json()]);
      setPosts(postData.posts ?? []);
      setCategories(categoryData.categories ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const publishedCount = useMemo(() => posts.filter((post) => post.status === "published").length, [posts]);

  function startNew() {
    setEditor(emptyEditor());
    setTagsInput("");
    setNotice("");
    setError("");
    setShowEditor(true);
  }

  function editPost(post: Post) {
    const existingTags = (() => { try { return JSON.parse(post.tags_json || "[]") as string[]; } catch { return []; } })();
    setTagsInput(existingTags.join(", "));
    setEditor({
      id: post.id,
      translation_group_id: post.translation_group_id,
      language: post.language,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content_md: post.content_md || "",
      category_id: post.category_id || "",
      category_name: post.category_name || "",
      tags: existingTags,
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      status: post.status,
      cover_image_key: post.cover_image_key || null,
    });
    setNotice("");
    setError("");
    setShowEditor(true);
  }


  async function uploadCoverImage(file?: File) {
    if (!file) return;
    setError(""); setNotice(""); setUploadingImage(true);
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/admin/blog-images", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "이미지를 업로드하지 못했습니다.");
      setEditor((current) => ({ ...current, cover_image_key: data.key }));
      setNotice("대표 이미지를 업로드했습니다. 게시글 저장을 눌러 적용하세요.");
    } catch (e) { setError(e instanceof Error ? e.message : "이미지 업로드 중 오류가 발생했습니다."); }
    finally { setUploadingImage(false); }
  }

  function placeImageInsertionMarker(range?: Range | null) {
    const root = contentRef.current;
    if (!root) return null;
    const target = range || savedSelectionRef.current;
    const marker = document.createElement("span");
    marker.dataset.imageInsertionMarker = "true";
    marker.textContent = "\u200b";
    marker.style.display = "inline-block";
    marker.style.width = "1px";
    marker.style.height = "1em";
    if (target && root.contains(target.commonAncestorContainer)) {
      const insertion = target.cloneRange();
      insertion.deleteContents();
      insertion.insertNode(marker);
    } else {
      root.appendChild(marker);
    }
    imageInsertionMarkerRef.current = marker;
    savedSelectionRef.current = null;
    window.getSelection()?.removeAllRanges();
    return marker;
  }

  async function uploadInlineImage(file?: File) {
    if (!file) return;
    setError(""); setNotice(""); setUploadingImage(true);
    const root = contentRef.current;
    const marker = imageInsertionMarkerRef.current?.isConnected
      ? imageInsertionMarkerRef.current
      : placeImageInsertionMarker();
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/admin/blog-images", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "본문 이미지를 업로드하지 못했습니다.");
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[\[\]|]/g, " ").trim() || "본문 이미지";
      const image = document.createElement("img");
      image.src = "/api/blog/images/" + data.key;
      image.alt = alt;
      image.dataset.width = inlineImageWidth;
      image.dataset.align = inlineImageAlign;
      image.style.width = inlineImageWidth;
      image.style.maxWidth = "100%";
      image.style.height = "auto";
      image.style.display = "block";
      image.style.margin = inlineImageAlign === "left" ? "16px auto 16px 0" : inlineImageAlign === "right" ? "16px 0 16px auto" : "16px auto";
      if (marker?.isConnected) {
        marker.replaceWith(image);
        const after = document.createElement("p");
        after.append(document.createElement("br"));
        image.after(after);
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(after);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        root?.focus();
        rememberEditorSelection();
      } else if (root) {
        root.append(image);
      }
      imageInsertionMarkerRef.current = null;
      if (root) setEditor((current) => ({ ...current, content_md: editorHtmlToMarkdown(root) }));
      setNotice("본문 이미지가 지정한 위치에 삽입됐습니다.");
    } catch (e) {
      marker?.remove();
      imageInsertionMarkerRef.current = null;
      setError(e instanceof Error ? e.message : "본문 이미지 업로드 중 오류가 발생했습니다.");
    } finally { setUploadingImage(false); }
  }

  function rememberEditorSelection() {
    const selection = window.getSelection();
    if (selection?.rangeCount && contentRef.current?.contains(selection.anchorNode)) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  }
  function applyEditorCommand(command: string, value?: string) {
    contentRef.current?.focus();
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRef.current);
    }
    document.execCommand(command, false, value);
    rememberEditorSelection();
  }
  function insertEditorBlock(tag: "h2" | "h3" | "blockquote") {
    applyEditorCommand("formatBlock", tag);
  }
  function syncEditorContent() {
    if (contentRef.current) setEditor((current) => ({ ...current, content_md: editorHtmlToMarkdown(contentRef.current!) }));
  }
  function handleEditorDrop(event: React.DragEvent<HTMLDivElement>) {
    const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    event.preventDefault();
    const doc = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null; caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
    let dropRange = doc.caretRangeFromPoint?.(event.clientX, event.clientY) || null;
    if (!dropRange && doc.caretPositionFromPoint) { const pos = doc.caretPositionFromPoint(event.clientX, event.clientY); if (pos) { dropRange = document.createRange(); dropRange.setStart(pos.offsetNode, pos.offset); dropRange.collapse(true); } }
    const selection = window.getSelection();
    if (dropRange && contentRef.current?.contains(dropRange.commonAncestorContainer)) {
      savedSelectionRef.current = dropRange.cloneRange();
    } else if (selection?.rangeCount && contentRef.current?.contains(selection.anchorNode)) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
    placeImageInsertionMarker(savedSelectionRef.current);
    void uploadInlineImage(files[0]);
  }

  const liveContent = contentRef.current ? editorHtmlToMarkdown(contentRef.current) : editor.content_md;
  const wordCount = liveContent.trim() ? liveContent.trim().split(/\\s+/).length : 0;
  const characterCount = editor.content_md.length;

  async function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editor,
          category_id: editor.category_id || null,
          category_name: editor.category_name.trim(),
          tags: tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 12),
          seo_title: null,
          seo_description: editor.seo_description || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "저장하지 못했습니다.");
      await loadData();
      setShowEditor(false);
      setNotice(editor.status === "published" ? "게시글을 발행했습니다." : "게시글을 저장했습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function featurePost(post: Post) {
    if (post.status !== "published") return;
    try {
      const response = await fetch("/api/admin/posts/feature", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post.id, language: post.language }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "대표글을 설정하지 못했습니다.");
      await loadData(); setNotice("대표글을 변경했습니다.");
    } catch (e) { setError(e instanceof Error ? e.message : "대표글 설정 중 오류가 발생했습니다."); }
  }
  async function deletePost(post: Post) {
    if (!window.confirm(`“${post.title}” 게시글을 삭제할까요? 삭제 후 복구할 수 없습니다.`)) return;
    setError("");
    try {
      const response = await fetch(`/api/admin/posts?id=${encodeURIComponent(post.id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "삭제하지 못했습니다.");
      await loadData();
      setNotice("게시글을 삭제했습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 중 오류가 발생했습니다.");
    }
  }

  async function addCategory() {
    if (!categoryName.trim()) return;
    setError("");
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_ko: categoryName.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "카테고리를 추가하지 못했습니다.");
      setCategories(data.categories ?? []);
      setCategoryName("");
      setNotice("카테고리를 추가했습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "카테고리 추가 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="blog-admin-manager">
      <div className="blog-admin-toolbar">
        <div className="blog-admin-stats">
          <span>전체 게시글 <strong>{posts.length}</strong></span>
          <span>발행 중 <strong>{publishedCount}</strong></span>
          <span>카테고리 <strong>{categories.length}</strong></span>
        </div>
        <button className="blog-admin-primary" type="button" onClick={startNew}>+ 새 게시글</button>
      </div>

      {notice ? <p className="blog-admin-notice" role="status">{notice}</p> : null}
      {error ? <p className="blog-admin-error" role="alert">{error}</p> : null}

      {showEditor ? (
        <form className="blog-admin-editor" onSubmit={savePost}>
          <div className="blog-admin-editor-head">
            <h2>{editor.id ? "게시글 수정" : "새 게시글 작성"}</h2>
            <button type="button" className="blog-admin-text-button" onClick={() => setShowEditor(false)}>목록으로</button>
          </div>
          <div className="blog-admin-form-grid">
            <label>언어
              <select value={editor.language} onChange={(e) => setEditor({ ...editor, language: e.target.value as "ko" | "en" })}>
                <option value="ko">한국어</option><option value="en">English</option>
              </select>
            </label>
            <label>상태
              <select value={editor.status} onChange={(e) => setEditor({ ...editor, status: e.target.value as PostStatus })}>
                <option value="draft">임시저장</option><option value="published">발행</option><option value="archived">발행 취소(보관)</option>
              </select>
            </label>
            <label className="blog-admin-full">제목
              <input required maxLength={180} value={editor.title} onChange={(e) => {
                const title = e.target.value;
                setEditor((current) => ({ ...current, title }));
              }} />
            </label>
            <label>카테고리 (직접 입력)
              <input maxLength={40} value={editor.category_name} onChange={(e) => setEditor({ ...editor, category_name: e.target.value, category_id: "" })} placeholder="예: 생활정보" list="blog-category-suggestions" />
              <datalist id="blog-category-suggestions">{categories.map((category) => <option key={category.id} value={category.name_ko} />)}</datalist>
            </label>
            <label className="blog-admin-full">태그 (쉼표로 구분)
              <input value={tagsInput} maxLength={400} onChange={(e) => setTagsInput(e.target.value)} onBlur={() => setEditor((current) => ({ ...current, tags: tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 12) }))} placeholder="생활정보, 가이드, 팁" />
              <small>쉼표(,)를 입력해도 지워지지 않습니다. 예: 생활정보, 가이드, 팁 (최대 12개)</small>
            </label>
            <label className="blog-admin-full">대표 이미지 (선택)
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploadingImage} onChange={(e) => { void uploadCoverImage(e.target.files?.[0]); e.currentTarget.value = ""; }} />
              <small>JPG, PNG, WebP, AVIF · 최대 5MB</small>
              {editor.cover_image_key ? <div><img src={`/api/blog/images/${editor.cover_image_key.split("/").map(encodeURIComponent).join("/")}`} alt="대표 이미지 미리보기" style={{ display:"block",width:"100%",maxWidth:360,maxHeight:220,objectFit:"cover",borderRadius:12,marginTop:8 }} /><button type="button" className="blog-admin-text-button" onClick={() => setEditor((current) => ({ ...current, cover_image_key: null }))}>이미지 제거</button></div> : <small>이미지를 선택하면 안전하게 업로드됩니다.</small>}
              {uploadingImage ? <small>이미지 업로드 중...</small> : null}
            </label>
            
            <div className="blog-admin-full">
              <div className="blog-admin-editor-head">
                <div><strong>본문 편집</strong><small className="blog-admin-count">{wordCount.toLocaleString("ko-KR")} 단어 · {characterCount.toLocaleString("ko-KR")}자</small></div>
                <div className="blog-admin-view-switch">
                  <button type="button" className={!showPreview ? "is-active" : ""} onClick={() => setShowPreview(false)}>편집</button>
                  <button type="button" className={showPreview && previewMode === "preview" ? "is-active" : ""} onClick={() => { syncEditorContent(); setShowPreview(true); setPreviewMode("preview"); }}>미리보기</button>
                  <button type="button" className={showPreview && previewMode === "split" ? "is-active" : ""} onClick={() => { syncEditorContent(); setShowPreview(true); setPreviewMode("split"); }}>나란히 보기</button>
                </div>
              </div>
              {showPreview ? (
                <div className={`blog-admin-preview-layout ${previewMode === "split" ? "is-split" : ""}`}>
                  <div className="blog-admin-preview">
                    <h1>{editor.title || "게시글 제목 미리보기"}</h1>
                    {editor.excerpt ? <p className="blog-admin-preview-excerpt">{editor.excerpt}</p> : null}
                    <BlogMarkdown content={editor.content_md || "본문을 입력하면 여기에 미리 표시됩니다."} />
                  </div>
                  {previewMode === "split" ? <textarea aria-label="본문 Markdown 편집" className="blog-admin-content blog-admin-content-split" rows={20} value={editor.content_md} onChange={(e) => setEditor({ ...editor, content_md: e.target.value })} /> : null}
                </div>
              ) : (
                <>
                  <div className="blog-admin-format-tools" role="toolbar" aria-label="본문 서식 도구">
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => insertEditorBlock("h2")}>큰 제목</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => insertEditorBlock("h3")}>소제목</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => applyEditorCommand("bold")}>굵게</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => applyEditorCommand("italic")}>기울임</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => applyEditorCommand("insertUnorderedList")}>글머리 목록</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => insertEditorBlock("blockquote")}>인용</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => { const url = window.prompt("링크 주소를 입력하세요."); if (url && /^https?:\/\//i.test(url)) applyEditorCommand("createLink", url); }}>링크</button>
                    <button type="button" className="blog-admin-secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => applyEditorCommand("removeFormat")}>서식 지우기</button>
                  </div>
                  <div className="blog-admin-inline-image-tools">
                    <label>이미지 너비 <strong>{inlineImageWidth}</strong><input type="range" min="30" max="100" step="5" value={parseInt(inlineImageWidth, 10) || 100} onChange={(e) => resizeSelectedInlineImage(e.target.value + "%")} /></label>
                    <label>정렬<select value={inlineImageAlign} onChange={(e) => { const align = e.target.value; setInlineImageAlign(align); const image = selectedInlineImageRef.current; if (image) { image.dataset.align = align; image.style.margin = align === "left" ? "16px auto 16px 0" : align === "right" ? "16px 0 16px auto" : "16px auto"; syncEditorContent(); } }}><option value="center">가운데</option><option value="left">왼쪽</option><option value="right">오른쪽</option></select></label>
                    <label>본문 이미지 삽입<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploadingImage} onClick={rememberEditorSelection} onChange={(e) => { placeImageInsertionMarker(); void uploadInlineImage(e.currentTarget.files?.[0]); e.currentTarget.value = ""; }} /></label>
                  </div>
                  <div
                    key={editor.id || "new-post"}
                    ref={contentRef}
                    className="blog-admin-content blog-admin-wysiwyg"
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-label="본문 편집 영역"
                    aria-multiline="true"
                    data-placeholder="여기에 글을 작성하세요. 서식 버튼을 누르면 입력한 글에 바로 적용됩니다."
                    dangerouslySetInnerHTML={{ __html: markdownToEditorHtml(editor.content_md) }}
                    onBlur={syncEditorContent}
                    onKeyUp={rememberEditorSelection}
                    onMouseUp={rememberEditorSelection}
                    onFocus={rememberEditorSelection}
                    onClick={(event) => { const target = event.target; if (target instanceof HTMLImageElement) { selectedInlineImageRef.current = target; setInlineImageWidth(target.dataset.width || "100%"); setInlineImageAlign(target.dataset.align || "center"); } }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleEditorDrop}
                  />
                  <small>굵게·제목 등은 작성 영역에 바로 표시됩니다. 이미지 삽입 버튼을 누르면 마지막 커서 위치에 들어갑니다. 파일을 본문 원하는 위치에 끌어다 놓아도 됩니다. 업로드 중에는 저장할 수 없습니다.</small>
                </>
              )}
            </div>
            <label className="blog-admin-full">SEO 설명 (선택)
              <textarea rows={2} maxLength={300} value={editor.seo_description} onChange={(e) => setEditor({ ...editor, seo_description: e.target.value })} />
            </label>
          </div>
          <div className="blog-admin-editor-actions">
            <button className="blog-admin-primary" type="submit" disabled={saving || uploadingImage}>{saving ? "저장 중..." : editor.status === "published" ? "저장하고 발행" : "저장"}</button>
            <button type="button" className="blog-admin-secondary" onClick={() => setShowEditor(false)}>취소</button>
          </div>
        </form>
      ) : (
        <>
          <section className="blog-admin-category-box">
            <div><strong>카테고리 태그</strong><small>글에 표시할 태그만 관리합니다. 별도 카테고리별 피드는 만들지 않습니다.</small></div>
            <div className="blog-admin-category-add">
              <input aria-label="새 카테고리 이름" value={categoryName} maxLength={40} onChange={(e) => setCategoryName(e.target.value)} placeholder="새 카테고리 이름" />
              <button type="button" className="blog-admin-secondary" onClick={addCategory} disabled={!categoryName.trim()}>추가</button>
            </div>
          </section>
          <div className="blog-admin-list-head"><h2>게시글 목록</h2><button className="blog-admin-text-button" type="button" onClick={() => void loadData()}>새로고침</button></div>
          {loading ? <p className="blog-admin-empty">불러오는 중...</p> : posts.length === 0 ? <p className="blog-admin-empty">아직 게시글이 없습니다. 새 게시글을 작성해 보세요.</p> : (
            <div className="blog-admin-post-list">
              {posts.map((post) => (
                <article className="blog-admin-post" key={post.id}>
                  <div className="blog-admin-post-main">
                    <div className="blog-admin-post-meta">
                      <span className={`blog-admin-status is-${post.status}`}>{post.status === "published" ? "발행" : post.status === "draft" ? "임시저장" : "보관"}</span>
                      <span>{post.language.toUpperCase()}</span>
                      {post.category_name ? <span>{post.category_name}</span> : null}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt || "소개 문구 없음"}</p>
                    <small>수정 {dateLabel(post.updated_at)} · 조회수 {post.view_count.toLocaleString("ko-KR")}</small>
                  </div>
                  <div className="blog-admin-post-actions">
                    <button type="button" className="blog-admin-secondary" onClick={() => void featurePost(post)} disabled={post.status !== "published"}>{post.is_featured ? "대표글 지정됨" : "대표글 설정"}</button><button type="button" className="blog-admin-secondary" onClick={() => editPost(post)}>수정</button>
                    <button type="button" className="blog-admin-danger" onClick={() => void deletePost(post)}>삭제</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
