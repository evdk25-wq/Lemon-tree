CREATE TABLE IF NOT EXISTS channels (
  id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  name TEXT NOT NULL,
  archived INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (team_id, id),
  UNIQUE (team_id, name)
);
INSERT OR IGNORE INTO channels (id, team_id, name) VALUES
('general','team-leadership','general'),
('announcements','team-leadership','annonces'),
('general','team-frontend','general'),
('ui','team-frontend','ui'),
('design-system','team-frontend','design-system'),
('general','team-backend','general'),
('api','team-backend','api'),
('database','team-backend','database'),
('incidents','team-backend','incidents');
