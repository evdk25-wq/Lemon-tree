import type { Clock } from "../ports/clock";
import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { InvalidTaskTitle } from "./create-task";
import { TaskNotFound } from "./move-task";

export interface UpdateTaskInput {
  readonly taskId: string;
  readonly title: string;
  readonly priority: Task["priority"];
  readonly assigneeId: string | null;
  readonly dueDate?: string | null;
}

export class UpdateTask {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly clock: Clock,
  ) {}
  async execute(input: UpdateTaskInput): Promise<Task> {
    const current = await this.tasks.findById(input.taskId);
    if (!current) throw new TaskNotFound(`Task ${input.taskId} was not found`);
    const title = input.title.trim();
    if (!title) throw new InvalidTaskTitle("Task title is required");
    const updated = {
      ...current,
      title,
      priority: input.priority,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate ?? null,
      updatedAt: this.clock.now(),
    };
    await this.tasks.save(updated);
    return updated;
  }
}
