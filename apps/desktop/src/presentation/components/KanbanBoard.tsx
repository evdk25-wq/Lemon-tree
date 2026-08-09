import { Check, LayoutGrid, List, Plus, SlidersHorizontal } from "lucide-react";
import type { Team } from "../../domain/entities/project";

interface KanbanBoardProps {
  readonly team: Team;
}

const columns = [
  {
    id: "todo",
    title: "À faire",
    tone: "blue",
    tasks: ["Implémenter Auth OAuth", "Tests Wayland", "Écran paramètres"],
  },
  {
    id: "progress",
    title: "En cours",
    tone: "amber",
    tasks: ["Nouveau moteur de rendu", "API migration v2"],
  },
  {
    id: "done",
    title: "Terminé",
    tone: "green",
    tasks: ["Design system v2", "Intégration DB", "Dashboard Analytics"],
  },
] as const;

export function KanbanBoard({ team }: KanbanBoardProps) {
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
        {columns.map((column) => (
          <article className={`kanban-column ${column.tone}`} key={column.id}>
            <header>
              <strong>{column.title}</strong>
              <span>{column.tasks.length}</span>
            </header>
            <div className="kanban-tasks">
              {column.tasks.map((title, index) => (
                <button className="kanban-task" key={title}>
                  <span className="task-title">
                    {column.id === "done" && <Check size={14} />}
                    {title}
                  </span>
                  {column.id !== "done" && (
                    <span className="task-meta">
                      <span className="tag">
                        {index % 2 === 0
                          ? team.name.replace(" Team", "")
                          : "UI/UX"}
                      </span>
                      <span className={`priority priority-${String(index)}`}>
                        {index === 0
                          ? "Haute"
                          : index === 1
                            ? "Moyenne"
                            : "Basse"}
                      </span>
                      <span className="mini-avatar">
                        <img
                          src={
                            team.members[index % team.members.length]
                              ?.avatarUrl ?? "/avatars/alex.jpg"
                          }
                          alt=""
                        />
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button className="new-task">
              <Plus size={16} /> Nouvelle tâche
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
