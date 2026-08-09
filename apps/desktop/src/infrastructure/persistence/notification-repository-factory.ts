import { isTauri } from "@tauri-apps/api/core";
import type { NotificationRepository } from "../../domain/repositories/notification-repository";
import { MemoryNotificationRepository } from "./memory-notification-repository";
import { SQLiteNotificationRepository } from "./sqlite-notification-repository";

export function createNotificationRepository(): NotificationRepository {
  return isTauri()
    ? new SQLiteNotificationRepository()
    : new MemoryNotificationRepository();
}
