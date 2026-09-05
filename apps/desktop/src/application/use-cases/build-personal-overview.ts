import type { Decision } from "../../domain/entities/decision";
import type { MentionNotification } from "../../domain/entities/notification";
import type { Project, Team } from "../../domain/entities/project";
import type { Task } from "../../domain/entities/task";

export interface PersonalOverview {
  readonly assignedTasks: readonly Task[];
  readonly urgentTasks: readonly Task[];
  readonly unreadNotifications: readonly MentionNotification[];
  readonly decisionsToRead: readonly Decision[];
  readonly teams: readonly Team[];
}

export interface PersonalOverviewInput {
  readonly memberId: string;
  readonly project: Project;
  readonly tasks: readonly Task[];
  readonly notifications: readonly MentionNotification[];
  readonly decisions: readonly Decision[];
  readonly now: string;
}

export class BuildPersonalOverview {
  execute(input: PersonalOverviewInput): PersonalOverview {
    const assignedTasks = input.tasks.filter(
      (task) => task.assigneeId === input.memberId && task.status !== "done",
    );
    const now = new Date(input.now).getTime();
    const urgentTasks = assignedTasks.filter((task) => {
      if (!task.dueDate) return task.priority === "high";
      return new Date(task.dueDate).getTime() <= now + 86_400_000;
    });
    const teams = input.project.teams.filter((team) =>
      team.members.some((member) => member.id === input.memberId),
    );

    return {
      assignedTasks,
      urgentTasks,
      unreadNotifications: input.notifications.filter(
        (notification) =>
          notification.recipientId === input.memberId &&
          notification.readAt === null,
      ),
      decisionsToRead: input.decisions.filter(
        (decision) => decision.createdBy !== input.memberId,
      ),
      teams,
    };
  }
}
