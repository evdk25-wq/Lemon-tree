import { isTauri } from "@tauri-apps/api/core";
import type { TeamRepository } from "../../domain/repositories/team-repository";
import { MemoryTeamRepository } from "./memory-team-repository";
import { SQLiteTeamRepository } from "./sqlite-team-repository";

export function createTeamRepository(): TeamRepository {
  return isTauri() ? new SQLiteTeamRepository() : new MemoryTeamRepository();
}
