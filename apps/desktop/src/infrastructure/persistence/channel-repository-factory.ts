import { isTauri } from "@tauri-apps/api/core";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";
import { MemoryChannelRepository } from "./memory-channel-repository";
import { SQLiteChannelRepository } from "./sqlite-channel-repository";

export function createChannelRepository(): ChannelRepository {
  return isTauri()
    ? new SQLiteChannelRepository()
    : new MemoryChannelRepository();
}
