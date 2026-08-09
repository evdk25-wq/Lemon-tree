import Database from "@tauri-apps/plugin-sql";
import type { Decision } from "../../domain/entities/decision";
import type { DecisionRepository } from "../../domain/repositories/decision-repository";

interface DecisionRow {
  id: string;
  project_id: string;
  team_id: string;
  channel_id: string;
  source_message_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export class SQLiteDecisionRepository implements DecisionRepository {
  private readonly database = Database.get("sqlite:lemon-tree.db");

  async listByChannel(
    teamId: string,
    channelId: string,
  ): Promise<readonly Decision[]> {
    const rows = await this.database.select<DecisionRow[]>(
      "SELECT * FROM decisions WHERE team_id = $1 AND channel_id = $2 ORDER BY created_at",
      [teamId, channelId],
    );
    return rows.map((row) => ({
      id: row.id,
      projectId: row.project_id,
      teamId: row.team_id,
      channelId: row.channel_id,
      sourceMessageId: row.source_message_id,
      content: row.content,
      createdBy: row.created_by,
      createdAt: row.created_at,
    }));
  }

  async save(decision: Decision): Promise<void> {
    await this.database.execute(
      "INSERT OR IGNORE INTO decisions (id, project_id, team_id, channel_id, source_message_id, content, created_by, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        decision.id,
        decision.projectId,
        decision.teamId,
        decision.channelId,
        decision.sourceMessageId,
        decision.content,
        decision.createdBy,
        decision.createdAt,
      ],
    );
  }
}
