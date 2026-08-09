import type { Task } from "../entities/task";

export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  listByProject(projectId: string): Promise<readonly Task[]>;
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
