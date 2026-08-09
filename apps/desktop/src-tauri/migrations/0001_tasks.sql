CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, project_id TEXT NOT NULL, team_id TEXT, assignee_id TEXT, title TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('todo', 'inProgress', 'done')), priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(team_id);
INSERT OR IGNORE INTO tasks VALUES
('task-auth','project-platform-v2','team-backend','julien-martin','Implémenter Auth OAuth','todo','high','2026-08-09T08:00:00.000Z','2026-08-09T08:00:00.000Z'),
('task-wayland','project-platform-v2','team-frontend','sophie-laurent','Tests Wayland','todo','medium','2026-08-09T08:00:00.000Z','2026-08-09T08:00:00.000Z'),
('task-render','project-platform-v2','team-frontend','emma-chen','Nouveau moteur de rendu','inProgress','high','2026-08-09T08:00:00.000Z','2026-08-09T08:00:00.000Z'),
('task-design','project-platform-v2','team-frontend','marc-dubois','Design system v2','done','medium','2026-08-09T08:00:00.000Z','2026-08-09T08:00:00.000Z');
