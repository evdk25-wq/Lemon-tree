import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";

export class ListProjectTasks {
  constructor(private readonly tasks: TaskRepository) {}

  execute(projectId: string): Promise<readonly Task[]> {
    return this.tasks.listByProject(projectId);
  }
}
