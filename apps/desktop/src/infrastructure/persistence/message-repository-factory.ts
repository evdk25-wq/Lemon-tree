import { isTauri } from "@tauri-apps/api/core";
import type { MessageRepository } from "../../domain/repositories/message-repository";
import { MemoryMessageRepository } from "./memory-message-repository";
import { SQLiteMessageRepository } from "./sqlite-message-repository";

export function createMessageRepository(): MessageRepository {
  return isTauri()
    ? new SQLiteMessageRepository()
    : new MemoryMessageRepository();
}
