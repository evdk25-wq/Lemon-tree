export const taskStatuses = ["todo", "inProgress", "done"] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export interface Task {
  readonly id: string;
  readonly projectId: string;
  readonly teamId: string | null;
  readonly assigneeId: string | null;
  readonly title: string;
  readonly status: TaskStatus;
  readonly priority: "low" | "medium" | "high";
  readonly dueDate?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type TaskUrgency = "normal" | "warning" | "critical" | "overdue";

export function getTaskUrgency(
  task: Task,
  now: string,
  criticalHours = 24,
): TaskUrgency {
  if (!task.dueDate || task.status === "done") return "normal";
  const createdAt = new Date(task.createdAt).getTime();
  const dueAt = new Date(task.dueDate).getTime();
  const nowAt = new Date(now).getTime();
  if (nowAt >= dueAt) return "overdue";
  const remainingHours = (dueAt - nowAt) / 3_600_000;
  if (remainingHours <= criticalHours) return "critical";
  const duration = dueAt - createdAt;
  return duration > 0 && nowAt - createdAt >= duration / 2
    ? "warning"
    : "normal";
}

export class InvalidTaskStateTransition extends Error {
  readonly name = "InvalidTaskStateTransition";
}

export function moveTask(
  task: Task,
  status: TaskStatus,
  updatedAt: string,
): Task {
  if (task.status === status) {
    return task;
  }

  return { ...task, status, updatedAt };
}
