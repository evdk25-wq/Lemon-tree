import { describe, expect, it } from "vitest";
import { getTaskUrgency, type Task } from "./task";

const task: Task = {
  id: "task-1",
  projectId: "project-1",
  teamId: null,
  assigneeId: null,
  title: "Release",
  status: "inProgress",
  priority: "high",
  createdAt: "2026-08-01T09:00:00Z",
  updatedAt: "2026-08-01T09:00:00Z",
  dueDate: "2026-08-05T09:00:00Z",
};

describe("getTaskUrgency", () => {
  it("warns after half of the available time", () => {
    expect(getTaskUrgency(task, "2026-08-03T10:00:00Z")).toBe("warning");
  });
  it("becomes critical during the final 24 hours", () => {
    expect(getTaskUrgency(task, "2026-08-04T12:00:00Z")).toBe("critical");
  });
  it("marks overdue tasks", () => {
    expect(getTaskUrgency(task, "2026-08-05T09:01:00Z")).toBe("overdue");
  });
  it("ignores completed tasks", () => {
    expect(
      getTaskUrgency({ ...task, status: "done" }, "2026-08-06T09:00:00Z"),
    ).toBe("normal");
  });
});
