import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";

export class InvalidTaskTitle extends Error {
  readonly name = "InvalidTaskTitle";
}

export interface CreateTaskInput {
  readonly projectId: string;
  readonly teamId: string | null;
  readonly assigneeId: string | null;
  readonly title: string;
  readonly priority: Task["priority"];
}

export class CreateTask {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const title = input.title.trim();
    if (!title) throw new InvalidTaskTitle("Task title is required");
    const timestamp = this.clock.now();
    const task: Task = {
      id: this.ids.generate(),
      projectId: input.projectId,
      teamId: input.teamId,
      assigneeId: input.assigneeId,
      title,
      status: "todo",
      priority: input.priority,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await this.tasks.save(task);
    return task;
  }
}
