-- Additive blog tags field. Existing posts retain an empty tag list.
ALTER TABLE blog_posts ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]';
