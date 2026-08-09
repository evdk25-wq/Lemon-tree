import type { Clock } from "../ports/clock";
import {
  moveTask,
  type Task,
  type TaskStatus,
} from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";

export class TaskNotFound extends Error {
  readonly name = "TaskNotFound";
}

export class MoveTask {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly clock: Clock,
  ) {}

  async execute(taskId: string, status: TaskStatus): Promise<Task> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new TaskNotFound(`Task ${taskId} was not found`);
    const updated = moveTask(task, status, this.clock.now());
    await this.tasks.save(updated);
    return updated;
  }
}
