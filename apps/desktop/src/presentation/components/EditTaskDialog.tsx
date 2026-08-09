import { useEffect, useState } from "react";
import type { Task } from "../../domain/entities/task";
import type { Member } from "../../domain/entities/project";

interface Props {
  readonly task: Task | null;
  readonly members: readonly Member[];
  readonly onClose: () => void;
  readonly onSave: (
    task: Task,
    title: string,
    priority: Task["priority"],
    assigneeId: string | null,
    dueDate: string | null,
  ) => void;
  readonly onDelete: (task: Task) => void;
}
export function EditTaskDialog({
  task,
  members,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId ?? "");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 16) : "");
    }
  }, [task]);
  if (!task) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 id="edit-task-title">Modifier la tâche</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (title.trim()) {
              onSave(
                task,
                title,
                priority,
                assigneeId || null,
                dueDate ? new Date(dueDate).toISOString() : null,
              );
              onClose();
            }
          }}
        >
          <label htmlFor="edit-title">Titre</label>
          <input
            id="edit-title"
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <label htmlFor="edit-priority">Priorité</label>
          <select
            id="edit-priority"
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
          <label htmlFor="edit-due-date">Échéance</label>
          <input
            id="edit-due-date"
            type="datetime-local"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value);
            }}
          />
          <label htmlFor="edit-assignee">Responsable</label>
          <select
            id="edit-assignee"
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
              className="danger-button"
              onClick={() => {
                if (window.confirm(`Supprimer « ${task.title} » ?`)) {
                  onDelete(task);
                  onClose();
                }
              }}
            >
              Supprimer
            </button>
            <span className="dialog-spacer" />
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
              Enregistrer
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
