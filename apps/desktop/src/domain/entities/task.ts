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
  readonly createdAt: string;
  readonly updatedAt: string;
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
