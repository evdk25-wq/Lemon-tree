import { AtSign, X } from "lucide-react";
import type { MentionNotification } from "../../domain/entities/notification";
import type { Project } from "../../domain/entities/project";

interface NotificationsPanelProps {
  readonly open: boolean;
  readonly notifications: readonly MentionNotification[];
  readonly project: Project;
  readonly onClose: () => void;
  readonly onOpen: (notification: MentionNotification) => void;
}

export function NotificationsPanel({
  open,
  notifications,
  project,
  onClose,
  onOpen,
}: NotificationsPanelProps) {
  if (!open) return null;
  return (
    <aside className="notifications-panel" aria-label="Notifications non lues">
      <header>
        <div>
          <strong>Notifications</strong>
          <span>
            {notifications.length} non lue{notifications.length > 1 ? "s" : ""}
          </span>
        </div>
        <button aria-label="Fermer les notifications" onClick={onClose}>
          <X size={17} />
        </button>
      </header>
      <div className="notifications-list">
        {notifications.length === 0 && <p>Vous êtes à jour.</p>}
        {notifications.map((notification) => {
          const team = project.teams.find(
            (candidate) => candidate.id === notification.teamId,
          );
          return (
            <button
              key={notification.id}
              onClick={() => {
                onOpen(notification);
              }}
            >
              <span className="notification-kind">
                <AtSign size={16} />
              </span>
              <span>
                <strong>Vous avez été mentionné</strong>
                <small>
                  {team?.name ?? "Team"} · #{notification.channelId}
                </small>
                <time dateTime={notification.createdAt}>
                  {new Date(notification.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
