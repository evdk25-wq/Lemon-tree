import type { MentionNotification } from "../../domain/entities/notification";
import type { NotificationRepository } from "../../domain/repositories/notification-repository";

export class ListUnreadNotifications {
  constructor(private readonly notifications: NotificationRepository) {}

  execute(recipientId: string): Promise<readonly MentionNotification[]> {
    return this.notifications.listUnread(recipientId);
  }
}
