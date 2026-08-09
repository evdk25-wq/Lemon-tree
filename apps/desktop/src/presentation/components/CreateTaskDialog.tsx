import { useEffect, useState } from "react";
import type { Task } from "../../domain/entities/task";
import type { Member } from "../../domain/entities/project";

interface Props {
  readonly open: boolean;
  readonly members: readonly Member[];
  readonly initialTitle: string;
  readonly onClose: () => void;
  readonly onCreate: (
    title: string,
    priority: Task["priority"],
    assigneeId: string | null,
    dueDate: string | null,
  ) => void;
}

export function CreateTaskDialog({
  open,
  members,
  initialTitle,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  useEffect(() => {
    if (open) setTitle(initialTitle);
  }, [initialTitle, open]);
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
              onCreate(
                title,
                priority,
                assigneeId || null,
                dueDate ? new Date(dueDate).toISOString() : null,
              );
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
          <label htmlFor="task-due-date">Échéance</label>
          <input
            id="task-due-date"
            type="datetime-local"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value);
            }}
          />
          <label htmlFor="task-assignee">Responsable</label>
          <select
            id="task-assignee"
            value={assigneeId}
            onChange={(event) => {
              setAssigneeId(event.target.value);
            }}
          >
            <option value="">Non assignée</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.displayName}
              </option>
            ))}
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
