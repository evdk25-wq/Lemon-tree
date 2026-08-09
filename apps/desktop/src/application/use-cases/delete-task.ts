import type { TaskRepository } from "../../domain/repositories/task-repository";
import { TaskNotFound } from "./move-task";

export class DeleteTask {
  constructor(private readonly tasks: TaskRepository) {}
  async execute(taskId: string): Promise<void> {
    if (!(await this.tasks.findById(taskId)))
      throw new TaskNotFound(`Task ${taskId} was not found`);
    await this.tasks.delete(taskId);
  }
}
