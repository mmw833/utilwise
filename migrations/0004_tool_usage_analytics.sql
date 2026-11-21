-- Aggregate-only usage events. Never store answers, form values, IPs, or visitor identifiers.
CREATE TABLE IF NOT EXISTS tool_usage_events (
  event_id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('calculator','online-tool','personality-test','psychology-test')),
  locale TEXT NOT NULL CHECK (locale IN ('ko','en')),
  event_type TEXT NOT NULL CHECK (event_type IN ('run','start','complete')),
  event_date TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_tool_usage_events_date ON tool_usage_events(event_date);
CREATE INDEX IF NOT EXISTS idx_tool_usage_events_tool_date ON tool_usage_events(tool_id,event_date);
CREATE INDEX IF NOT EXISTS idx_tool_usage_events_category_date ON tool_usage_events(category,event_date);
