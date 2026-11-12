import "server-only";

import { getBlogDatabase } from "./db";
import type { BlogLanguage } from "./posts";

export type AdminPostStatus = "draft" | "published" | "archived";

export interface AdminPostInput {
  id?: string;
  translation_group_id?: string;
  language: BlogLanguage;
  slug?: string;
  title: string;
  excerpt?: string;
  content_md?: string;
  cover_image_key?: string | null;
  category_id?: string | null;
  category_name?: string;
  tags?: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  status: AdminPostStatus;
}

export interface AdminPostRecord extends Omit<AdminPostInput, "category_name"> {
  id: string;
  translation_group_id: string;
  view_count: number;
  is_featured: number;
  published_at: number | null;
  created_at: number;
  updated_at: number;
  category_name: string | null;
}

export interface AdminCategoryRecord {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string | null;
}

export async function listAdminPosts(): Promise<AdminPostRecord[]> {
  const db = getBlogDatabase();
  const result = await db.prepare(`
    SELECT p.id, p.translation_group_id, p.language, p.slug, p.title,
      p.excerpt, p.content_md, p.cover_image_key, p.category_id, p.tags_json AS tags_json,
      p.seo_title, p.seo_description, p.status, p.view_count, p.is_featured,
      p.published_at, p.created_at, p.updated_at,
      c.name_ko AS category_name
    FROM blog_posts p
    LEFT JOIN blog_categories c ON c.id = p.category_id
    ORDER BY p.updated_at DESC
    LIMIT 200
  `).all<AdminPostRecord>();
  return result.results ?? [];
}

export async function listAdminCategories(): Promise<AdminCategoryRecord[]> {
  const db = getBlogDatabase();
  const result = await db.prepare(`
    SELECT id, slug, name_ko, name_en
    FROM blog_categories
    ORDER BY name_ko COLLATE NOCASE ASC
  `).all<AdminCategoryRecord>();
  return result.results ?? [];
}

export async function findOrCreateAdminCategory(name: string, language: BlogLanguage): Promise<string | null> {
  const normalized = name.trim();
  if (!normalized) return null;
  const db = getBlogDatabase();
  const existing = await db.prepare(
    "SELECT id FROM blog_categories WHERE lower(name_ko) = lower(?) OR lower(COALESCE(name_en, '')) = lower(?) LIMIT 1"
  ).bind(normalized, normalized).first<{ id: string }>();
  if (existing) return existing.id;
  const slugBase = normalized.toLowerCase().normalize("NFKD")
    .replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50)
    || "category";
  // Different category names can normalize to the same slug. Keep the
  // category table's UNIQUE constraint from turning that into a save error.
  let slug = slugBase;
  const slugExists = await db.prepare(
    "SELECT id FROM blog_categories WHERE slug = ? LIMIT 1"
  ).bind(slug).first<{ id: string }>();
  if (slugExists) slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO blog_categories (id, slug, name_ko, name_en) VALUES (?, ?, ?, ?)")
    .bind(id, slug, normalized, language === "en" ? normalized : null).run();
  return id;
}

function englishSlugWords(title: string, language: BlogLanguage): string {
  if (language === "en") return title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
  const dictionary: Array<[string, string]> = [["퇴직금", "severance-pay"], ["부동산", "real-estate"], ["계산기", "calculator"], ["계산", "calculation"], ["추천", "best"], ["영화", "movies"], ["시간", "time"], ["효율", "productivity"], ["생활", "life"], ["정보", "guide"], ["방법", "how-to"], ["사용", "use"], ["정리", "organize"], ["비교", "comparison"], ["무료", "free"], ["여행", "travel"], ["건강", "health"], ["연봉", "salary"], ["대출", "loan"], ["이자", "interest"], ["팁", "tips"], ["가이드", "guide"], ["오늘", "today"], ["쉽게", "easy"], ["관리", "manage"], ["초보", "beginner"]];
  const words: string[] = [];
  for (const [ko, en] of dictionary) if (title.includes(ko) && !words.includes(en)) words.push(en);
  return words.join("-").slice(0, 90) || "useful-article";
}
async function createUniqueSlug(title: string, language: BlogLanguage, db: any): Promise<string> {
  const base = englishSlugWords(title, language) || "useful-article";
  let candidate = base;
  let suffix = 2;
  while (await db.prepare("SELECT id FROM blog_posts WHERE language = ? AND slug = ? LIMIT 1").bind(language, candidate).first()) candidate = base + "-" + suffix++;
  return candidate;
}
export async function saveAdminPost(input: AdminPostInput): Promise<string> {
  const db = getBlogDatabase();
  const id = input.id || crypto.randomUUID();
  const translationGroupId = input.translation_group_id || crypto.randomUUID();
  const oldPost = input.id ? await db.prepare("SELECT slug FROM blog_posts WHERE id = ? LIMIT 1").bind(input.id).first<{slug:string}>() : null;
  const slug = oldPost?.slug || await createUniqueSlug(input.title, input.language, db);
  await db.prepare(`
    INSERT INTO blog_posts (
      id, translation_group_id, language, slug, title, excerpt, content_md,
      cover_image_key, category_id, tags_json, seo_title, seo_description, status,
      published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      CASE WHEN ? = 'published' THEN unixepoch() ELSE NULL END,
      unixepoch(), unixepoch()
    )
    ON CONFLICT(id) DO UPDATE SET
      language = excluded.language,
      slug = excluded.slug,
      title = excluded.title,
      excerpt = excluded.excerpt,
      content_md = excluded.content_md,
      cover_image_key = excluded.cover_image_key,
      category_id = excluded.category_id,
      tags_json = excluded.tags_json,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      status = excluded.status,
      published_at = CASE
        WHEN excluded.status = 'published'
          THEN COALESCE(blog_posts.published_at, unixepoch())
        ELSE NULL
      END,
      updated_at = unixepoch()
  `).bind(
    id,
    translationGroupId,
    input.language,
    slug,
    input.title,
    (input.excerpt?.trim() || (input.content_md ?? "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/^#{1,3}\s+/gm, "").replace(/[>*_`\[\]()#-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)),
    input.content_md ?? "",
    input.cover_image_key ?? null,
    input.category_id ?? null,
    JSON.stringify((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean).slice(0, 12)),
    input.seo_title ?? null,
    input.seo_description ?? null,
    input.status,
    input.status,
  ).run();
  return id;
}

export async function deleteAdminPost(id: string): Promise<void> {
  const db = getBlogDatabase();
  await db.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
}

export async function createAdminCategory(
  nameKo: string,
  nameEn?: string,
): Promise<void> {
  const normalized = nameKo.trim().toLowerCase()
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const slug = normalized || `category-${crypto.randomUUID().slice(0, 8)}`;
  const db = getBlogDatabase();
  await db.prepare(`
    INSERT INTO blog_categories (id, slug, name_ko, name_en)
    VALUES (?, ?, ?, ?)
  `).bind(crypto.randomUUID(), slug, nameKo.trim(), nameEn?.trim() || null).run();
}
