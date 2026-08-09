CREATE TABLE IF NOT EXISTS mention_notifications (
  id TEXT PRIMARY KEY NOT NULL,
  recipient_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_unread_mentions ON mention_notifications(recipient_id, read_at);
