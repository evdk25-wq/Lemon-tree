import Database from "@tauri-apps/plugin-sql";
import type { Team, TeamColor } from "../../domain/entities/project";
import type { TeamRepository } from "../../domain/repositories/team-repository";

interface TeamRow {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: TeamColor;
}

export class SQLiteTeamRepository implements TeamRepository {
  private readonly database = Database.get("sqlite:lemon-tree.db");

  async listByProject(projectId: string): Promise<readonly Team[]> {
    const rows = await this.database.select<TeamRow[]>(
      "SELECT id,name,description,progress,color FROM teams WHERE project_id=$1 ORDER BY created_at",
      [projectId],
    );
    return rows.map((row) => ({ ...row, members: [] }));
  }

  async save(projectId: string, team: Team): Promise<void> {
    await this.database.execute(
      "INSERT INTO teams (id,project_id,name,description,progress,color,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET name=$3,description=$4,progress=$5,color=$6",
      [
        team.id,
        projectId,
        team.name,
        team.description,
        team.progress,
        team.color,
        new Date().toISOString(),
      ],
    );
  }
}
