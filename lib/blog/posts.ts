import "server-only";

import { getBlogDatabase } from "./db";

export type BlogLanguage = "ko" | "en";

export interface BlogPostSummary {
  id: string;
  translation_group_id: string;
  language: BlogLanguage;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_key: string | null;
  category_name: string | null;
  category_slug: string | null;
  view_count: number;
  published_at: number;
}

export interface BlogPost extends BlogPostSummary {
  content_md: string;
  seo_title: string | null;
  seo_description: string | null;
  created_at: number;
  updated_at: number;
}

const POST_SUMMARY_SELECT = `
  SELECT
    p.id,
    p.translation_group_id,
    p.language,
    p.slug,
    p.title,
    p.excerpt,
    p.cover_image_key,
    CASE WHEN p.language = 'en' THEN COALESCE(c.name_en, c.name_ko) ELSE c.name_ko END AS category_name,
    c.slug AS category_slug,
    p.view_count,
    p.published_at
  FROM blog_posts p
  LEFT JOIN blog_categories c ON c.id = p.category_id
`;

/** Returns the newest published posts for one locale. */
export async function listPublishedPosts(
  language: BlogLanguage,
  limit = 20,
): Promise<BlogPostSummary[]> {
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const db = getBlogDatabase();
  const result = await db
    .prepare(`
      ${POST_SUMMARY_SELECT}
      WHERE p.language = ? AND p.status = 'published'
      ORDER BY p.published_at DESC, p.created_at DESC
      LIMIT ?
    `)
    .bind(language, safeLimit)
    .all<BlogPostSummary>();

  return result.results ?? [];
}

/** Returns popular published posts, ordered by the deduplicated view counter. */
export async function listPopularPosts(
  language: BlogLanguage,
  limit = 5,
): Promise<BlogPostSummary[]> {
  const safeLimit = Math.min(20, Math.max(1, Math.floor(limit)));
  const db = getBlogDatabase();
  const result = await db
    .prepare(`
      ${POST_SUMMARY_SELECT}
      WHERE p.language = ? AND p.status = 'published'
      ORDER BY p.view_count DESC, p.published_at DESC
      LIMIT ?
    `)
    .bind(language, safeLimit)
    .all<BlogPostSummary>();

  return result.results ?? [];
}

/** Drafts and archived posts are intentionally never returned by this query. */
export async function getPublishedPostBySlug(
  language: BlogLanguage,
  slug: string,
): Promise<BlogPost | null> {
  const db = getBlogDatabase();
  return db
    .prepare(`
      SELECT
        p.id,
        p.translation_group_id,
        p.language,
        p.slug,
        p.title,
        p.excerpt,
        p.content_md,
        p.cover_image_key,
        CASE WHEN p.language = 'en' THEN COALESCE(c.name_en, c.name_ko) ELSE c.name_ko END AS category_name,
        c.slug AS category_slug,
        p.seo_title,
        p.seo_description,
        p.view_count,
        p.published_at,
        p.created_at,
        p.updated_at
      FROM blog_posts p
      LEFT JOIN blog_categories c ON c.id = p.category_id
      WHERE p.language = ? AND p.slug = ? AND p.status = 'published'
      LIMIT 1
    `)
    .bind(language, slug)
    .first<BlogPost>();
}

/**
 * Counts one view per post/visitor every 24 hours.
 * visitorHash must be generated and hashed on the server; never accept it from
 * a browser request. The database UPSERT and trigger perform atomic deduping.
 */
export async function recordPostView(
  postId: string,
  visitorHash: string,
  viewedAt = Math.floor(Date.now() / 1000),
): Promise<void> {
  if (!postId || !/^[a-f0-9]{64}$/i.test(visitorHash)) {
    throw new Error("Invalid post view identity.");
  }

  const db = getBlogDatabase();
  await db
    .prepare(`
      INSERT INTO blog_view_dedup (post_id, visitor_hash, last_viewed_at)
      VALUES (?, ?, ?)
      ON CONFLICT(post_id, visitor_hash) DO UPDATE
      SET last_viewed_at = excluded.last_viewed_at
      WHERE excluded.last_viewed_at >= blog_view_dedup.last_viewed_at + 86400
    `)
    .bind(postId, visitorHash, viewedAt)
    .run();
}
