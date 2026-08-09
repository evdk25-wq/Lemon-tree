import type { MentionNotification } from "../entities/notification";

export interface NotificationRepository {
  listUnread(recipientId: string): Promise<readonly MentionNotification[]>;
  save(notification: MentionNotification): Promise<void>;
  markRead(id: string, readAt: string): Promise<void>;
}
