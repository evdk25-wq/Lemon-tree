import { describe, expect, it } from "vitest";
import { MemoryTaskRepository } from "../../infrastructure/persistence/memory-task-repository";
import { InvalidTaskTitle } from "./create-task";
import { TaskNotFound } from "./move-task";
import { UpdateTask } from "./update-task";

describe("UpdateTask", () => {
  it("updates editable task fields", async () => {
    const repository = new MemoryTaskRepository();
    const useCase = new UpdateTask(repository, { now: () => "2026-09-01T10:00:00Z" });
    const task = await useCase.execute({ taskId: "task-auth", title: " Auth SSO ", priority: "medium", assigneeId: "lucas-bernard" });
    expect(task).toMatchObject({ title: "Auth SSO", priority: "medium", assigneeId: "lucas-bernard", updatedAt: "2026-09-01T10:00:00Z" });
  });
  it("rejects invalid title and unknown task", async () => {
    const useCase = new UpdateTask(new MemoryTaskRepository(), { now: () => "now" });
    await expect(useCase.execute({ taskId: "task-auth", title: " ", priority: "low", assigneeId: null })).rejects.toBeInstanceOf(InvalidTaskTitle);
    await expect(useCase.execute({ taskId: "missing", title: "Valid", priority: "low", assigneeId: null })).rejects.toBeInstanceOf(TaskNotFound);
  });
});
