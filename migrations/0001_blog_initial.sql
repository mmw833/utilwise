-- UTILWISE native blog foundation
-- All timestamps are Unix seconds (UTC).
-- Post content is stored as Markdown source; rendering must sanitize any generated HTML.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS blog_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ko TEXT NOT NULL,
  name_en TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  translation_group_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ko', 'en')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_md TEXT NOT NULL DEFAULT '',
  cover_image_key TEXT,
  category_id TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  published_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (language, slug),
  UNIQUE (translation_group_id, language),
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_public_feed
  ON blog_posts(language, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category
  ON blog_posts(category_id, language, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_translation
  ON blog_posts(translation_group_id);

-- A random first-party visitor token is stored in a secure, HttpOnly cookie.
-- Store only its server-side hash here; never store raw IP addresses.
CREATE TABLE IF NOT EXISTS blog_view_dedup (
  post_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  last_viewed_at INTEGER NOT NULL,
  PRIMARY KEY (post_id, visitor_hash),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_blog_view_dedup_last_viewed
  ON blog_view_dedup(last_viewed_at);

-- The application performs an UPSERT only when at least 86,400 seconds have
-- elapsed since the previous counted view. Triggers keep the aggregate count
-- in sync for both first views and eligible repeat views.
CREATE TRIGGER IF NOT EXISTS trg_blog_view_insert_count
AFTER INSERT ON blog_view_dedup
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_blog_view_repeat_count
AFTER UPDATE OF last_viewed_at ON blog_view_dedup
WHEN NEW.last_viewed_at >= OLD.last_viewed_at + 86400
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
END;
