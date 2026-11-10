"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  seo_title: string | null;
  seo_description: string | null;
  status: PostStatus;
  view_count: number;
  published_at: number | null;
  updated_at: number;
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
  seo_title: string;
  seo_description: string;
  status: PostStatus;
};

const emptyEditor = (): Editor => ({
  language: "ko",
  slug: "",
  title: "",
  excerpt: "",
  content_md: "",
  category_id: "",
  seo_title: "",
  seo_description: "",
  status: "draft",
});

function dateLabel(timestamp: number | null) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(timestamp * 1000));
}

function slugify(value: string) {
  return value.trim().toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || `post-${new Date().toISOString().slice(0, 10)}`;
}

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editor, setEditor] = useState<Editor>(emptyEditor);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showEditor, setShowEditor] = useState(false);

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
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      status: post.status,
    });
    setNotice("");
    setError("");
    setShowEditor(true);
  }

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
          seo_title: editor.seo_title || null,
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
            <label>카테고리 태그
              <select value={editor.category_id} onChange={(e) => setEditor({ ...editor, category_id: e.target.value })}>
                <option value="">선택 안 함</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name_ko}</option>)}
              </select>
            </label>
            <label>대표 이미지 키 (선택)
              <input value="" placeholder="R2 연결 단계에서 설정" disabled />
            </label>
            <label className="blog-admin-full">짧은 소개
              <textarea rows={2} maxLength={500} value={editor.excerpt} onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })} />
            </label>
            <label className="blog-admin-full">본문 (Markdown)
              <textarea className="blog-admin-content" rows={16} value={editor.content_md} onChange={(e) => setEditor({ ...editor, content_md: e.target.value })} placeholder={"## 소제목\n\n본문을 Markdown 형식으로 작성하세요."} />
              <small>현재는 Markdown 원문을 저장합니다. 공개 페이지 렌더링은 다음 구현 단계에서 연결합니다.</small>
            </label>
            <label className="blog-admin-full">SEO 제목 (선택)
              <input maxLength={180} value={editor.seo_title} onChange={(e) => setEditor({ ...editor, seo_title: e.target.value })} />
            </label>
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
