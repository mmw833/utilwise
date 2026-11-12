-- Featured article selection and privacy-preserving blog visitor counters.
ALTER TABLE blog_posts ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1));
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_one_featured_per_language ON blog_posts(language) WHERE is_featured = 1;
CREATE TABLE IF NOT EXISTS blog_site_visitors (visitor_hash TEXT PRIMARY KEY, first_seen_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS blog_site_visits (visitor_hash TEXT NOT NULL, visit_date INTEGER NOT NULL, PRIMARY KEY(visitor_hash, visit_date), FOREIGN KEY(visitor_hash) REFERENCES blog_site_visitors(visitor_hash) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS idx_blog_site_visits_date ON blog_site_visits(visit_date);
