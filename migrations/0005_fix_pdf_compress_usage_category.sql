-- Correct PDF compression events recorded before its online-tool category mapping was fixed.
UPDATE tool_usage_events
SET category = 'online-tool'
WHERE tool_id = 'pdf-compress' AND category = 'calculator';
