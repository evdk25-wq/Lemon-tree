ALTER TABLE messages ADD COLUMN channel_id TEXT NOT NULL DEFAULT 'general';
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(team_id, channel_id);
