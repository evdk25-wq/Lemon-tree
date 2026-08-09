import { describe, expect, it } from "vitest";
import { MemoryNotificationRepository } from "../../infrastructure/persistence/memory-notification-repository";
import { ListUnreadNotifications } from "./list-unread-notifications";
import { MarkNotificationRead } from "./mark-notification-read";

describe("ListUnreadNotifications", () => {
  it("returns unread mentions for one recipient", async () => {
    const repository = new MemoryNotificationRepository();
    await repository.save({
      id: "notification-1",
      recipientId: "lucas-bernard",
      messageId: "message-1",
      teamId: "team-backend",
      channelId: "general",
      createdAt: "2026-08-09T18:00:00.000Z",
      readAt: null,
    });

    const notifications = await new ListUnreadNotifications(repository).execute(
      "lucas-bernard",
    );
    expect(notifications).toHaveLength(1);
  });

  it("marks a notification as read", async () => {
    const repository = new MemoryNotificationRepository();
    await new MarkNotificationRead(repository, {
      now: () => "2026-08-09T19:00:00.000Z",
    }).execute("notification-demo");

    expect(await repository.listUnread("alex-morgan")).toHaveLength(0);
  });
});
