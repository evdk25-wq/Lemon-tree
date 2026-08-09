import { describe, expect, it } from "vitest";
import { MemoryTaskRepository } from "../../infrastructure/persistence/memory-task-repository";
import { DeleteTask } from "./delete-task";
import { TaskNotFound } from "./move-task";

describe("DeleteTask", () => {
  it("deletes an existing task", async () => {
    const repository = new MemoryTaskRepository();
    await new DeleteTask(repository).execute("task-auth");
    await expect(repository.findById("task-auth")).resolves.toBeNull();
  });
  it("fails for an unknown task", async () => {
    await expect(
      new DeleteTask(new MemoryTaskRepository()).execute("missing"),
    ).rejects.toBeInstanceOf(TaskNotFound);
  });
});
