-- Optional related calculator/tool IDs selected for each blog article.
ALTER TABLE blog_posts ADD COLUMN related_tools_json TEXT NOT NULL DEFAULT '[]';
