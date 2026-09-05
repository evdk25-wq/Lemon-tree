CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL CHECK (color IN ('blue','green','violet','orange','rose','slate')),
  created_at TEXT NOT NULL,
  UNIQUE (project_id, name)
);
CREATE INDEX IF NOT EXISTS idx_teams_project_id ON teams(project_id);
