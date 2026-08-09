import { Check, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react";
import type { Team } from "../../domain/entities/project";
import type { Task, TaskStatus } from "../../domain/entities/task";

interface KanbanBoardProps {
  readonly team: Team;
  readonly tasks: readonly Task[];
  readonly onMove: (taskId: string, status: TaskStatus) => void;
  readonly onCreate: () => void;
  readonly onEdit: (task: Task) => void;
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
}: KanbanBoardProps) {
  const visibleTasks = tasks.filter((task) => task.teamId === team.id);
  return (
    <section className="projects-panel" aria-label={`Tâches ${team.name}`}>
      <header className="projects-toolbar">
        <div className="project-switcher">
          <strong>Projets</strong>
          <button>Lemon Tree Core</button>
        </div>
        <nav className="project-tabs" aria-label="Sections du projet">
          <button className="active">Tâches</button>
          <button>Décisions</button>
          <button>Docs</button>
          <button>Activité</button>
        </nav>
        <div className="view-tools">
          <button aria-label="Vue liste">
            <List size={17} />
          </button>
          <button aria-label="Vue grille">
            <LayoutGrid size={17} />
          </button>
          <button aria-label="Filtrer">
            <SlidersHorizontal size={17} />
          </button>
          <button className="add-circle" aria-label="Nouvelle tâche">
            <Plus size={18} />
          </button>
        </div>
      </header>
      <div className="kanban-board">
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
                    className="kanban-task"
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
    </section>
  );
}
