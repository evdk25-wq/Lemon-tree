import Database from "@tauri-apps/plugin-sql";
import type { TeamChannel } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";

interface ChannelRow {
  id: string;
  team_id: string;
  name: string;
  archived: number;
}

export class SQLiteChannelRepository implements ChannelRepository {
  private readonly database = Database.get("sqlite:lemon-tree.db");

  async listByTeam(teamId: string): Promise<readonly TeamChannel[]> {
    const rows = await this.database.select<ChannelRow[]>(
      "SELECT * FROM channels WHERE team_id = $1 ORDER BY name",
      [teamId],
    );
    return rows.map((row) => ({
      id: row.id,
      teamId: row.team_id,
      name: row.name,
      archived: row.archived === 1,
    }));
  }

  async save(channel: TeamChannel): Promise<void> {
    await this.database.execute(
      "INSERT INTO channels (id, team_id, name, archived) VALUES ($1,$2,$3,$4) ON CONFLICT(team_id,id) DO UPDATE SET name=$3, archived=$4",
      [channel.id, channel.teamId, channel.name, channel.archived ? 1 : 0],
    );
  }
}
