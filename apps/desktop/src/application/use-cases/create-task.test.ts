import { describe, expect, it } from "vitest";
import type { Task } from "../../domain/entities/task";
import { MemoryTaskRepository } from "../../infrastructure/persistence/memory-task-repository";
import { CreateTask, InvalidTaskTitle } from "./create-task";

const createUseCase = (repository: MemoryTaskRepository) =>
  new CreateTask(
    repository,
    { now: () => "2026-08-10T10:00:00Z" },
    { generate: () => "task-new" },
  );

describe("CreateTask", () => {
  it("creates a todo task and persists it", async () => {
    const repository = new MemoryTaskRepository();
    const task = await createUseCase(repository).execute({
      projectId: "project-platform-v2",
      teamId: "team-backend",
      assigneeId: null,
      title: "  Nouvelle API  ",
      priority: "high",
    });
    expect(task).toMatchObject<Task>({
      ...task,
      id: "task-new",
      title: "Nouvelle API",
      status: "todo",
    });
    await expect(repository.findById("task-new")).resolves.toEqual(task);
  });
  it("rejects an empty title", async () => {
    await expect(
      createUseCase(new MemoryTaskRepository()).execute({
        projectId: "project-platform-v2",
        teamId: null,
        assigneeId: null,
        title: "  ",
        priority: "low",
      }),
    ).rejects.toBeInstanceOf(InvalidTaskTitle);
  });
});
