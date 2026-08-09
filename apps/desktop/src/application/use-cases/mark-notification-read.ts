import type { NotificationRepository } from "../../domain/repositories/notification-repository";
import type { Clock } from "../ports/clock";

export class MarkNotificationRead {
  constructor(
    private readonly notifications: NotificationRepository,
    private readonly clock: Clock,
  ) {}

  execute(notificationId: string): Promise<void> {
    return this.notifications.markRead(notificationId, this.clock.now());
  }
}
