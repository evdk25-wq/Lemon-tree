import { Check, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { Decision } from "../../domain/entities/decision";
import type { Team } from "../../domain/entities/project";
import {
  getTaskUrgency,
  type Task,
  type TaskStatus,
} from "../../domain/entities/task";

interface KanbanBoardProps {
  readonly team: Team;
  readonly tasks: readonly Task[];
  readonly onMove: (taskId: string, status: TaskStatus) => void;
  readonly onCreate: () => void;
  readonly onEdit: (task: Task) => void;
  readonly loading: boolean;
  readonly error: string | null;
  readonly onRetry: () => void;
  readonly decisions: readonly Decision[];
  readonly onOpenDecision: (decision: Decision) => void;
}
const columns: readonly { status: TaskStatus; title: string; tone: string }[] =
  [
    { status: "todo", title: "À faire", tone: "blue" },
    { status: "inProgress", title: "En cours", tone: "amber" },
    { status: "done", title: "Terminé", tone: "green" },
  ];

export function KanbanBoard({
  team,
  tasks,
  onMove,
  onCreate,
  onEdit,
  loading,
  error,
  onRetry,
  decisions,
  onOpenDecision,
}: KanbanBoardProps) {
  const [section, setSection] = useState<"tasks" | "decisions">("tasks");
  const [view, setView] = useState<"board" | "list">("board");
  const [priority, setPriority] = useState<Task["priority"] | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visibleTasks = tasks.filter(
    (task) =>
      task.teamId === team.id &&
      (priority === "all" || task.priority === priority),
  );
  return (
    <section className="projects-panel" aria-label={`Tâches ${team.name}`}>
      <header className="projects-toolbar">
        <div className="project-switcher">
          <strong>Projets</strong>
          <button>Lemon Tree Core</button>
        </div>
        <nav className="project-tabs" aria-label="Sections du projet">
          <button
            className={section === "tasks" ? "active" : undefined}
            onClick={() => {
              setSection("tasks");
            }}
          >
            Tâches
          </button>
          <button
            aria-label="Décisions du projet"
            className={section === "decisions" ? "active" : undefined}
            onClick={() => {
              setSection("decisions");
            }}
          >
            Décisions
          </button>
          <button disabled title="Bientôt disponible">
            Docs
          </button>
          <button disabled title="Bientôt disponible">
            Activité
          </button>
        </nav>
        <div
          className={`view-tools${section !== "tasks" ? " hidden-view-tools" : ""}`}
          aria-hidden={section !== "tasks"}
        >
          <button
            aria-label="Vue liste"
            aria-pressed={view === "list"}
            onClick={() => {
              setView("list");
            }}
          >
            <List size={17} />
          </button>
          <button
            aria-label="Vue tableau"
            aria-pressed={view === "board"}
            onClick={() => {
              setView("board");
            }}
          >
            <LayoutGrid size={17} />
          </button>
          <button
            aria-label="Filtrer par priorité"
            aria-expanded={filtersOpen}
            className={priority !== "all" ? "has-filter" : undefined}
            onClick={() => {
              setFiltersOpen((open) => !open);
            }}
          >
            <SlidersHorizontal size={17} />
          </button>
          <button
            className="add-circle"
            aria-label="Nouvelle tâche"
            onClick={onCreate}
          >
            <Plus size={18} />
          </button>
          {filtersOpen && (
            <div className="task-filters" role="group" aria-label="Priorité">
              <strong>Priorité</strong>
              <select
                value={priority}
                onChange={(event) => {
                  setPriority(event.target.value as Task["priority"] | "all");
                }}
              >
                <option value="all">Toutes</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
          )}
        </div>
      </header>
      {section === "tasks" && loading && (
        <div className="task-state" role="status">
          Chargement des tâches…
        </div>
      )}
      {section === "tasks" && error && (
        <div className="task-state task-error" role="alert">
          <span>{error}</span>
          <button onClick={onRetry}>Réessayer</button>
        </div>
      )}
      {section === "tasks" && (
        <div className={`kanban-board ${view === "list" ? "list-view" : ""}`}>
          {columns.map((column) => {
            const columnTasks = visibleTasks.filter(
              (task) => task.status === column.status,
            );
            return (
              <article
                className={`kanban-column ${column.tone}`}
                key={column.status}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  const taskId = event.dataTransfer.getData("text/task-id");
                  if (taskId) onMove(taskId, column.status);
                }}
              >
                <header>
                  <strong>{column.title}</strong>
                  <span>{columnTasks.length}</span>
                </header>
                <div className="kanban-tasks">
                  {columnTasks.map((task) => (
                    <button
                      className={`kanban-task urgency-${getTaskUrgency(task, new Date().toISOString())}`}
                      draggable
                      onClick={() => {
                        onEdit(task);
                      }}
                      key={task.id}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/task-id", task.id);
                      }}
                    >
                      <span className="task-title">
                        {task.status === "done" && <Check size={14} />}
                        {task.title}
                      </span>
                      {task.dueDate && (
                        <span className="task-due">
                          Échéance{" "}
                          {new Date(task.dueDate).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      <span className="task-meta">
                        <span className="tag">
                          {team.name.replace(" Team", "")}
                        </span>
                        <span className={`priority priority-${task.priority}`}>
                          {task.priority === "high"
                            ? "Haute"
                            : task.priority === "medium"
                              ? "Moyenne"
                              : "Basse"}
                        </span>
                        {task.assigneeId && (
                          <span
                            className="mini-avatar"
                            title={
                              team.members.find(
                                (member) => member.id === task.assigneeId,
                              )?.displayName
                            }
                          >
                            <img
                              src={
                                team.members.find(
                                  (member) => member.id === task.assigneeId,
                                )?.avatarUrl ?? "/avatars/alex.jpg"
                              }
                              alt=""
                            />
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <button className="new-task" onClick={onCreate}>
                  <Plus size={16} /> Nouvelle tâche
                </button>
              </article>
            );
          })}
        </div>
      )}
      {section === "decisions" && (
        <div className="decisions-view">
          <header>
            <div>
              <strong>Décisions de {team.name}</strong>
              <span>#{decisions[0]?.channelId ?? "general"}</span>
            </div>
            <span>{decisions.length}</span>
          </header>
          {decisions.length === 0 && (
            <div className="empty-decisions">
              Aucune décision dans ce canal. Créez-en une depuis un message du
              chat.
            </div>
          )}
          <div className="decision-cards">
            {decisions.map((decision) => (
              <article key={decision.id}>
                <span className="decision-status">
                  <Check size={14} />
                </span>
                <div>
                  <p>{decision.content}</p>
                  <span>
                    #{decision.channelId} ·{" "}
                    {new Date(decision.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onOpenDecision(decision);
                  }}
                >
                  Voir le message
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
