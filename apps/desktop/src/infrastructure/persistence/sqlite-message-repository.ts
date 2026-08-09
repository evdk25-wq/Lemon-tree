import Database from "@tauri-apps/plugin-sql";
import type { ProjectMessage } from "../../domain/entities/project";
import type { MessageAttachment } from "../../domain/entities/attachment";
import type { MessageRepository } from "../../domain/repositories/message-repository";

interface MessageRow {
  id: string;
  team_id: string;
  channel_id: string;
  author_id: string;
  author_name: string;
  author_initials: string;
  author_avatar_url: string;
  author_presence: ProjectMessage["author"]["presence"];
  author_role: string;
  content: string;
  mentioned_member_ids: string;
  attachments_json: string;
  created_at: string;
}

function isMessageAttachment(item: unknown): item is MessageAttachment {
  if (typeof item !== "object" || item === null) return false;
  return (
    typeof Reflect.get(item, "id") === "string" &&
    typeof Reflect.get(item, "name") === "string" &&
    ["application/pdf", "image/png", "image/jpeg"].includes(
      String(Reflect.get(item, "mimeType")),
    ) &&
    typeof Reflect.get(item, "size") === "number" &&
    typeof Reflect.get(item, "dataUrl") === "string"
  );
}

function parseAttachments(value: string): readonly MessageAttachment[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  const items: readonly unknown[] = parsed;
  return items.filter(isMessageAttachment);
}

function parseMentionedMemberIds(value: string): readonly string[] {
  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed) &&
    parsed.every((item) => typeof item === "string")
    ? parsed
    : [];
}

function toMessage(row: MessageRow): ProjectMessage {
  return {
    id: row.id,
    teamId: row.team_id,
    channelId: row.channel_id,
    author: {
      id: row.author_id,
      displayName: row.author_name,
      initials: row.author_initials,
      avatarUrl: row.author_avatar_url,
      presence: row.author_presence,
      role: row.author_role,
    },
    content: row.content,
    mentionedMemberIds: parseMentionedMemberIds(row.mentioned_member_ids),
    attachments: parseAttachments(row.attachments_json),
    createdAt: row.created_at,
  };
}

export class SQLiteMessageRepository implements MessageRepository {
  private readonly database = Database.get("sqlite:lemon-tree.db");

  async listByChannel(
    teamId: string,
    channelId: string,
  ): Promise<readonly ProjectMessage[]> {
    const rows = await this.database.select<MessageRow[]>(
      "SELECT * FROM messages WHERE team_id = $1 AND channel_id = $2 ORDER BY created_at",
      [teamId, channelId],
    );
    return rows.map(toMessage);
  }

  async save(message: ProjectMessage): Promise<void> {
    await this.database.execute(
      "INSERT INTO messages (id, team_id, channel_id, author_id, author_name, author_initials, author_avatar_url, author_presence, author_role, content, mentioned_member_ids, attachments_json, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
      [
        message.id,
        message.teamId,
        message.channelId,
        message.author.id,
        message.author.displayName,
        message.author.initials,
        message.author.avatarUrl,
        message.author.presence,
        message.author.role,
        message.content,
        JSON.stringify(message.mentionedMemberIds),
        JSON.stringify(message.attachments),
        message.createdAt,
      ],
    );
  }
}
