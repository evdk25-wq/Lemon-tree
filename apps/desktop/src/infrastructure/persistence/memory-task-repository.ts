import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/repositories/task-repository";

const timestamp = "2026-08-09T08:00:00.000Z";

const seedTasks: readonly Task[] = [
  {
    id: "task-auth",
    projectId: "project-platform-v2",
    teamId: "team-backend",
    assigneeId: "alex-morgan",
    title: "Implémenter Auth OAuth",
    status: "todo",
    priority: "high",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "task-wayland",
    projectId: "project-platform-v2",
    teamId: "team-frontend",
    assigneeId: "sophie-laurent",
    title: "Tests Wayland",
    status: "todo",
    priority: "medium",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "task-render",
    projectId: "project-platform-v2",
    teamId: "team-frontend",
    assigneeId: "emma-chen",
    title: "Nouveau moteur de rendu",
    status: "inProgress",
    priority: "high",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "task-design",
    projectId: "project-platform-v2",
    teamId: "team-frontend",
    assigneeId: "marc-dubois",
    title: "Design system v2",
    status: "done",
    priority: "medium",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export class MemoryTaskRepository implements TaskRepository {
  private tasks = [...seedTasks];

  findById(id: string): Promise<Task | null> {
    return Promise.resolve(this.tasks.find((task) => task.id === id) ?? null);
  }

  listByProject(projectId: string): Promise<readonly Task[]> {
    return Promise.resolve(
      this.tasks.filter((task) => task.projectId === projectId),
    );
  }

  save(task: Task): Promise<void> {
    const exists = this.tasks.some((candidate) => candidate.id === task.id);
    this.tasks = exists
      ? this.tasks.map((candidate) =>
          candidate.id === task.id ? task : candidate,
        )
      : [...this.tasks, task];
    return Promise.resolve();
  }
  delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return Promise.resolve();
  }
}
