import { describe, expect, it } from "vitest";
import { demoProject } from "../../infrastructure/demo/demo-project";
import type { Decision } from "../../domain/entities/decision";
import type { MentionNotification } from "../../domain/entities/notification";
import type { Task } from "../../domain/entities/task";
import { BuildPersonalOverview } from "./build-personal-overview";

const task: Task = {
  id: "task-personal",
  projectId: demoProject.id,
  teamId: "team-backend",
  assigneeId: "alex-morgan",
  title: "Relire le contrat",
  status: "todo",
  priority: "high",
  createdAt: "2026-08-11T08:00:00.000Z",
  updatedAt: "2026-08-11T08:00:00.000Z",
};

const notification: MentionNotification = {
  id: "notification-1",
  recipientId: "alex-morgan",
  messageId: "message-1",
  teamId: "team-backend",
  channelId: "general",
  createdAt: "2026-08-11T08:00:00.000Z",
  readAt: null,
};

const decision: Decision = {
  id: "decision-1",
  projectId: demoProject.id,
  teamId: "team-backend",
  channelId: "general",
  sourceMessageId: "message-1",
  content: "Conserver SQLite hors ligne",
  createdBy: "julien-martin",
  createdAt: "2026-08-11T08:00:00.000Z",
};

describe("BuildPersonalOverview", () => {
  it("aggregates only the current member's actionable information", () => {
    const overview = new BuildPersonalOverview().execute({
      memberId: "alex-morgan",
      project: demoProject,
      tasks: [task, { ...task, id: "other", assigneeId: "julien-martin" }],
      notifications: [notification],
      decisions: [decision],
      now: "2026-08-11T09:00:00.000Z",
    });

    expect(overview.assignedTasks).toEqual([task]);
    expect(overview.urgentTasks).toEqual([task]);
    expect(overview.unreadNotifications).toEqual([notification]);
    expect(overview.decisionsToRead).toEqual([decision]);
    expect(overview.teams.map((team) => team.id)).toEqual(["team-leadership"]);
  });
});
