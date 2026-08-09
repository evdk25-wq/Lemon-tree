import { isTauri } from "@tauri-apps/api/core";
import type { DecisionRepository } from "../../domain/repositories/decision-repository";
import { MemoryDecisionRepository } from "./memory-decision-repository";
import { SQLiteDecisionRepository } from "./sqlite-decision-repository";

export function createDecisionRepository(): DecisionRepository {
  return isTauri()
    ? new SQLiteDecisionRepository()
    : new MemoryDecisionRepository();
}
