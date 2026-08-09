import { useState } from "react";
import type { Task } from "../../domain/entities/task";

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreate: (title: string, priority: Task["priority"]) => void;
}

export function CreateTaskDialog({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 id="create-task-title">Nouvelle tâche</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (title.trim()) {
              onCreate(title, priority);
              setTitle("");
              onClose();
            }
          }}
        >
          <label htmlFor="task-title">Titre</label>
          <input
            id="task-title"
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <label htmlFor="task-priority">Priorité</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(event) => {
              setPriority(
                event.target.value === "high"
                  ? "high"
                  : event.target.value === "low"
                    ? "low"
                    : "medium",
              );
            }}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
          <div className="dialog-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={!title.trim()}
            >
              Créer la tâche
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
