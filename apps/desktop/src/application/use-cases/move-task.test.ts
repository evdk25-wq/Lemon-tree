import { describe, expect, it } from "vitest";
import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import { MoveTask, TaskNotFound } from "./move-task";

class FakeTasks implements TaskRepository {
  constructor(private task: Task | null) {}
  findById = () => Promise.resolve(this.task);
  listByProject = () => Promise.resolve(this.task ? [this.task] : []);
  save = (task: Task) => {
    this.task = task;
    return Promise.resolve();
  };
  delete = () => Promise.resolve();
}

const task: Task = {
  id: "task-1",
  projectId: "project-1",
  teamId: "backend",
  assigneeId: null,
  title: "Sync",
  status: "todo",
  priority: "high",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("MoveTask", () => {
  it("moves and persists a task", async () => {
    const useCase = new MoveTask(new FakeTasks(task), {
      now: () => "2026-01-02T00:00:00Z",
    });
    await expect(
      useCase.execute("task-1", "inProgress"),
    ).resolves.toMatchObject({
      status: "inProgress",
      updatedAt: "2026-01-02T00:00:00Z",
    });
  });
  it("fails explicitly for an unknown task", async () => {
    const useCase = new MoveTask(new FakeTasks(null), {
      now: () => "2026-01-02T00:00:00Z",
    });
    await expect(useCase.execute("missing", "done")).rejects.toBeInstanceOf(
      TaskNotFound,
    );
  });
});
