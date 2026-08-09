import type { MentionNotification } from "../../domain/entities/notification";
import type { NotificationRepository } from "../../domain/repositories/notification-repository";

export class MemoryNotificationRepository implements NotificationRepository {
  private notifications: MentionNotification[] = [
    {
      id: "notification-demo",
      recipientId: "alex-morgan",
      messageId: "message-1",
      teamId: "team-backend",
      channelId: "general",
      createdAt: "2026-08-09T08:42:00.000Z",
      readAt: null,
    },
  ];

  listUnread(recipientId: string): Promise<readonly MentionNotification[]> {
    return Promise.resolve(
      this.notifications.filter(
        (notification) =>
          notification.recipientId === recipientId && !notification.readAt,
      ),
    );
  }

  save(notification: MentionNotification): Promise<void> {
    this.notifications = [...this.notifications, notification];
    return Promise.resolve();
  }

  markRead(id: string, readAt: string): Promise<void> {
    this.notifications = this.notifications.map((notification) =>
      notification.id === id ? { ...notification, readAt } : notification,
    );
    return Promise.resolve();
  }
}
