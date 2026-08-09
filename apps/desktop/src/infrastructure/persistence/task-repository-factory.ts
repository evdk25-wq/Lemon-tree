import { isTauri } from "@tauri-apps/api/core";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { MemoryTaskRepository } from "./memory-task-repository";
import { SQLiteTaskRepository } from "./sqlite-task-repository";

export function createTaskRepository(): TaskRepository {
  return isTauri() ? new SQLiteTaskRepository() : new MemoryTaskRepository();
}
