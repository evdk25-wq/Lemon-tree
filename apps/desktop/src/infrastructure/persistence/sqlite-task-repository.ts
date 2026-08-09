import Database from "@tauri-apps/plugin-sql";
import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";

interface TaskRow {
  id: string;
  project_id: string;
  team_id: string | null;
  assignee_id: string | null;
  title: string;
  status: Task["status"];
  priority: Task["priority"];
  created_at: string;
  updated_at: string;
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    teamId: row.team_id,
    assigneeId: row.assignee_id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SQLiteTaskRepository implements TaskRepository {
  private readonly database = Database.get("sqlite:lemon-tree.db");

  async findById(id: string): Promise<Task | null> {
    const rows = await this.database.select<TaskRow[]>(
      "SELECT * FROM tasks WHERE id = $1",
      [id],
    );
    return rows[0] ? toTask(rows[0]) : null;
  }

  async listByProject(projectId: string): Promise<readonly Task[]> {
    const rows = await this.database.select<TaskRow[]>(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at",
      [projectId],
    );
    return rows.map(toTask);
  }

  async save(task: Task): Promise<void> {
    await this.database.execute(
      "INSERT INTO tasks (id, project_id, team_id, assignee_id, title, status, priority, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(id) DO UPDATE SET team_id=$3, assignee_id=$4, title=$5, status=$6, priority=$7, updated_at=$9",
      [
        task.id,
        task.projectId,
        task.teamId,
        task.assigneeId,
        task.title,
        task.status,
        task.priority,
        task.createdAt,
        task.updatedAt,
      ],
    );
  }
  async delete(id: string): Promise<void> {
    await this.database.execute("DELETE FROM tasks WHERE id = $1", [id]);
  }
}
