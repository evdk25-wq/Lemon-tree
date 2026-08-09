import Database from "@tauri-apps/plugin-sql";
import type { MentionNotification } from "../../domain/entities/notification";
import type { NotificationRepository } from "../../domain/repositories/notification-repository";

interface NotificationRow {
  id: string;
  recipient_id: string;
  message_id: string;
  team_id: string;
  channel_id: string;
  created_at: string;
  read_at: string | null;
}

export class SQLiteNotificationRepository implements NotificationRepository {
  private readonly database = Database.get("sqlite:lemon-tree.db");

  async listUnread(
    recipientId: string,
  ): Promise<readonly MentionNotification[]> {
    const rows = await this.database.select<NotificationRow[]>(
      "SELECT * FROM mention_notifications WHERE recipient_id = $1 AND read_at IS NULL ORDER BY created_at DESC",
      [recipientId],
    );
    return rows.map((row) => ({
      id: row.id,
      recipientId: row.recipient_id,
      messageId: row.message_id,
      teamId: row.team_id,
      channelId: row.channel_id,
      createdAt: row.created_at,
      readAt: row.read_at,
    }));
  }

  async save(notification: MentionNotification): Promise<void> {
    await this.database.execute(
      "INSERT INTO mention_notifications (id, recipient_id, message_id, team_id, channel_id, created_at, read_at) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        notification.id,
        notification.recipientId,
        notification.messageId,
        notification.teamId,
        notification.channelId,
        notification.createdAt,
        notification.readAt,
      ],
    );
  }

  async markRead(id: string, readAt: string): Promise<void> {
    await this.database.execute(
      "UPDATE mention_notifications SET read_at = $2 WHERE id = $1",
      [id, readAt],
    );
  }
}
