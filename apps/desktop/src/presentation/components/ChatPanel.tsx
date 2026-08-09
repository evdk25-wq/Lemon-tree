import {
  Check,
  MoreHorizontal,
  Paperclip,
  Pin,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
} from "lucide-react";
import type { ProjectMessage, Team } from "../../domain/entities/project";

interface ChatPanelProps {
  readonly team: Team;
  readonly messages: readonly ProjectMessage[];
}

export function ChatPanel({ team, messages }: ChatPanelProps) {
  const fallbackMessages = [
    {
      id: "fallback-1",
      author: "Alex Martin",
      initials: "AM",
      avatarUrl: "/avatars/alex.jpg",
      time: "10:15",
      content:
        "On valide le nouveau moteur de rendu pour la prochaine release ?",
    },
    {
      id: "fallback-2",
      author: "Maya Dubois",
      initials: "MD",
      avatarUrl: "/avatars/maya.jpg",
      time: "10:16",
      content: "Oui, mais attention à Wayland sur Linux.",
    },
    {
      id: "fallback-3",
      author: team.members[0]?.displayName ?? "Julien Martin",
      initials: team.members[0]?.initials ?? "JM",
      avatarUrl: team.members[0]?.avatarUrl ?? "/avatars/julien.jpg",
      time: "10:17",
      content: "Ok, on garde l’ancien en fallback.",
    },
  ];
  const visibleMessages = messages.filter(
    (message) => message.teamId === team.id,
  );

  return (
    <section className="chat-panel" aria-label={`Conversation ${team.name}`}>
      <header className="panel-heading chat-panel-heading">
        <div className="panel-title">
          <strong>CHAT</strong>
          <span># {team.name.replace(" Team", "").toLowerCase()}</span>
        </div>
        <div className="panel-tools">
          <button aria-label="Rechercher">
            <Search size={17} />
          </button>
          <button aria-label="Épingler">
            <Pin size={17} />
          </button>
          <button aria-label="Filtrer">
            <SlidersHorizontal size={17} />
          </button>
          <button aria-label="Plus d’options">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>
      <div className="chat-messages" aria-live="polite">
        {fallbackMessages.map((message) => (
          <article className="compact-message" key={message.id}>
            <span className="portrait portrait-chat">
              <img src={message.avatarUrl} alt="" />
            </span>
            <div>
              <div className="message-meta">
                <strong>{message.author}</strong>
                <time>{message.time}</time>
              </div>
              <p>{message.content}</p>
            </div>
          </article>
        ))}
        <article className="decision-message">
          <span className="decision-icon">
            <Check size={15} />
          </span>
          <div>
            <div>
              <strong>Décision créée</strong>
              <time>10:18</time>
            </div>
            <p>
              <Check size={14} /> Nouveau moteur par défaut, fallback ancien
              pour Wayland (Linux)
            </p>
            <span className="decision-members">
              AM · MD · {team.members[0]?.initials ?? "JM"} · +2
            </span>
          </div>
        </article>
        {visibleMessages.slice(0, 1).map((message) => (
          <article className="compact-message" key={message.id}>
            <span className="portrait portrait-chat">
              <img src={message.author.avatarUrl} alt="" />
            </span>
            <div>
              <div className="message-meta">
                <strong>{message.author.displayName}</strong>
                <time>10:19</time>
              </div>
              <p>{message.content}</p>
            </div>
          </article>
        ))}
      </div>
      <form
        className="chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="sr-only" htmlFor="message">
          Écrire un message
        </label>
        <input id="message" placeholder="Écrire un message..." />
        <button type="button" aria-label="Ajouter une réaction">
          <Smile size={18} />
        </button>
        <button type="button" aria-label="Joindre un fichier">
          <Paperclip size={18} />
        </button>
        <button className="send-button" type="submit" aria-label="Envoyer">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
