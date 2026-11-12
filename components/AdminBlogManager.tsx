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

function slugify(value: string) {
  const initial = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
  const vowel = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
  const final = ["","k","k","ks","n","nj","nh","t","l","lk","lm","lb","ls","lt","lp","lh","m","p","ps","t","t","ng","t","t","k","t","p","t"];
  const latin = Array.from(value.normalize("NFC")).map((char) => {
    const code = char.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return char;
    return initial[Math.floor(code / 588)] + vowel[Math.floor((code % 588) / 28)] + final[code % 28];
  }).join("");
  return latin.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120)
    || `post-${new Date().toISOString().slice(0, 10)}`;
}

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editor, setEditor] = useState<Editor>(emptyEditor);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"preview" | "split">("preview");
  const contentRef = useRef<HTMLTextAreaElement>(null);
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
    setNotice("");
    setError("");
    setShowEditor(true);
  }

  function editPost(post: Post) {
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
      tags: (() => { try { return JSON.parse(post.tags_json || "[]") as string[]; } catch { return []; } })(),
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

  async function uploadInlineImage(file?: File) {
    if (!file) return;
    setError(""); setUploadingImage(true);
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/admin/blog-images", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "본문 이미지를 업로드하지 못했습니다.");
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[\[\]|]/g, " ").trim() || "본문 이미지";
      const markdown = `![${alt}|width=${inlineImageWidth}|align=${inlineImageAlign}](/api/blog/images/${data.key})`;
      setEditor((current) => ({ ...current, content_md: current.content_md ? current.content_md + "\n\n" + markdown + "\n\n" : markdown + "\n\n" }));
      setNotice("본문 이미지를 업로드하고 본문에 삽입했습니다. 게시글 저장을 눌러 적용하세요.");
    } catch (e) { setError(e instanceof Error ? e.message : "이미지 업로드 중 오류가 발생했습니다."); }
    finally { setUploadingImage(false); }
  }

  function insertMarkdown(snippet: string) {
    const textarea = contentRef.current;
    const start = textarea?.selectionStart ?? editor.content_md.length;
    const end = textarea?.selectionEnd ?? editor.content_md.length;
    const next = editor.content_md.slice(0, start) + snippet + editor.content_md.slice(end);
    setEditor((current) => ({ ...current, content_md: next }));
    requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  const wordCount = editor.content_md.trim() ? editor.content_md.trim().split(/\\s+/).length : 0;
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
          tags: editor.tags,
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
                setEditor((current) => ({ ...current, title, slug: current.id ? current.slug : slugify(title) }));
              }} />
            </label>
            <label className="blog-admin-full">주소 (slug)
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={120} value={editor.slug} onChange={(e) => setEditor({ ...editor, slug: e.target.value })} />
              <small>영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.</small>
            </label>
            <label>카테고리 (직접 입력)
              <input maxLength={40} value={editor.category_name} onChange={(e) => setEditor({ ...editor, category_name: e.target.value, category_id: "" })} placeholder="예: 생활정보" list="blog-category-suggestions" />
              <datalist id="blog-category-suggestions">{categories.map((category) => <option key={category.id} value={category.name_ko} />)}</datalist>
            </label>
            <label className="blog-admin-full">태그 (쉼표로 구분)
              <input value={editor.tags.join(", ")} maxLength={400} onChange={(e) => setEditor({ ...editor, tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 12) })} placeholder="생활정보, 가이드, 팁" />
              <small>최대 12개까지 입력할 수 있습니다.</small>
            </label>
            <label className="blog-admin-full">대표 이미지 (선택)
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploadingImage} onChange={(e) => { void uploadCoverImage(e.target.files?.[0]); e.currentTarget.value = ""; }} />
              <small>JPG, PNG, WebP, AVIF · 최대 5MB</small>
              {editor.cover_image_key ? <div><img src={`/api/blog/images/${editor.cover_image_key.split("/").map(encodeURIComponent).join("/")}`} alt="대표 이미지 미리보기" style={{ display:"block",width:"100%",maxWidth:360,maxHeight:220,objectFit:"cover",borderRadius:12,marginTop:8 }} /><button type="button" className="blog-admin-text-button" onClick={() => setEditor((current) => ({ ...current, cover_image_key: null }))}>이미지 제거</button></div> : <small>이미지를 선택하면 안전하게 업로드됩니다.</small>}
              {uploadingImage ? <small>이미지 업로드 중...</small> : null}
            </label>
            <label className="blog-admin-full">짧은 소개
              <textarea rows={2} maxLength={500} value={editor.excerpt} onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })} />
            </label>
            <div className="blog-admin-full">
              <div className="blog-admin-editor-head">
                <div><strong>본문 편집</strong><small className="blog-admin-count">{wordCount.toLocaleString("ko-KR")} 단어 · {characterCount.toLocaleString("ko-KR")}자</small></div>
                <div className="blog-admin-view-switch">
                  <button type="button" className={!showPreview ? "is-active" : ""} onClick={() => setShowPreview(false)}>편집</button>
                  <button type="button" className={showPreview && previewMode === "preview" ? "is-active" : ""} onClick={() => { setShowPreview(true); setPreviewMode("preview"); }}>미리보기</button>
                  <button type="button" className={showPreview && previewMode === "split" ? "is-active" : ""} onClick={() => { setShowPreview(true); setPreviewMode("split"); }}>나란히 보기</button>
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
                    {[
                      ["H2", "## 소제목\n\n"], ["H3", "### 작은 제목\n\n"],
                      ["굵게", "**굵은 글씨**"], ["기울임", "*기울임 글씨*"],
                      ["목록", "\n- 목록 항목"], ["번호 목록", "\n1. 첫 번째 항목"],
                      ["인용", "\n> 인용 문구"], ["링크", "[링크 문구](https://example.com)"],
                      ["구분선", "\n\n---\n\n"],
                    ].map(([label, snippet]) => <button type="button" className="blog-admin-secondary" key={label} onClick={() => insertMarkdown(snippet)}>{label}</button>)}
                  </div>
                  <div className="blog-admin-inline-image-tools">
                    <label>이미지 너비<select value={inlineImageWidth} onChange={(e) => setInlineImageWidth(e.target.value)}><option value="100%">100%</option><option value="80%">80%</option><option value="60%">60%</option><option value="40%">40%</option></select></label>
                    <label>정렬<select value={inlineImageAlign} onChange={(e) => setInlineImageAlign(e.target.value)}><option value="center">가운데</option><option value="left">왼쪽</option><option value="right">오른쪽</option></select></label>
                    <label>본문 이미지 삽입<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploadingImage} onChange={(e) => { void uploadInlineImage(e.target.files?.[0]); e.currentTarget.value = ""; }} /></label>
                  </div>
                  <textarea ref={contentRef} aria-label="본문 Markdown 편집" className="blog-admin-content" rows={20} value={editor.content_md} onChange={(e) => setEditor({ ...editor, content_md: e.target.value })} placeholder={"## 소제목\n\n본문을 Markdown 형식으로 작성하세요."} />
                  <small>서식 버튼은 커서 또는 선택한 영역에 삽입됩니다. 미리보기와 나란히 보기를 지원합니다.</small>
                </>
              )}
            </div>
            <label className="blog-admin-full">SEO 설명 (선택)
              <textarea rows={2} maxLength={300} value={editor.seo_description} onChange={(e) => setEditor({ ...editor, seo_description: e.target.value })} />
            </label>
          </div>
          <div className="blog-admin-editor-actions">
            <button className="blog-admin-primary" type="submit" disabled={saving}>{saving ? "저장 중..." : editor.status === "published" ? "저장하고 발행" : "저장"}</button>
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
                    <button type="button" className="blog-admin-secondary" onClick={() => editPost(post)}>수정</button>
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
