import {
  CheckCircle2,
  FileText,
  ListTodo,
  MoreHorizontal,
  Paperclip,
  Pin,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getMentionQuery, insertMention } from "../../domain/entities/message";
import { formatTypingLabel } from "../../domain/entities/typing-indicator";
import {
  hasJpegSignature,
  hasPdfSignature,
  hasPngSignature,
  maximumImageSize,
  maximumPdfSize,
  type MessageAttachment,
} from "../../domain/entities/attachment";
import type {
  Member,
  ProjectMessage,
  Team,
  TeamChannel,
  TeamColor,
} from "../../domain/entities/project";

interface ChatPanelProps {
  readonly team: Team;
  readonly teamColor: TeamColor;
  readonly teams: readonly Team[];
  readonly onSelectTeam: (teamId: string) => void;
  readonly channels: readonly TeamChannel[];
  readonly selectedChannelId: string;
  readonly onSelectChannel: (channelId: string) => void;
  readonly messages: readonly ProjectMessage[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly onRetry: () => void;
  readonly onSend: (
    content: string,
    attachments: readonly MessageAttachment[],
  ) => Promise<boolean>;
  readonly onManageChannels: () => void;
  readonly focusedMessageId: string | null;
  readonly decisionMessageIds: readonly string[];
  readonly onCreateTaskFromMessage: (message: ProjectMessage) => void;
  readonly onCreateDecisionFromMessage: (message: ProjectMessage) => void;
  readonly typingMembers: readonly Member[];
  readonly onTypingChange: (typing: boolean) => void;
}

const availableEmojis = [
  "😀",
  "👍",
  "🎉",
  "❤️",
  "🚀",
  "✅",
  "👀",
  "🙏",
  "💡",
  "🔥",
] as const;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Invalid file data"));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("File read failed"));
    };
    reader.readAsDataURL(file);
  });
}

function MessageContent({
  message,
  team,
}: {
  readonly message: ProjectMessage;
  readonly team: Team;
}) {
  const mentionedNames = team.members
    .filter((member) => message.mentionedMemberIds.includes(member.id))
    .map((member) => `@${member.displayName}`);
  if (mentionedNames.length === 0) return message.content;
  const pattern = new RegExp(
    `(${mentionedNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  return message.content.split(pattern).map((part, index) =>
    mentionedNames.includes(part) ? (
      <mark className="message-mention" key={`${part}-${String(index)}`}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function ChatPanel({
  team,
  teamColor,
  teams,
  onSelectTeam,
  channels,
  selectedChannelId,
  onSelectChannel,
  messages,
  loading,
  error,
  onRetry,
  onSend,
  onManageChannels,
  focusedMessageId,
  decisionMessageIds,
  onCreateTaskFromMessage,
  onCreateDecisionFromMessage,
  typingMembers,
  onTypingChange,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [mentionsOpen, setMentionsOpen] = useState(false);
  const [emojisOpen, setEmojisOpen] = useState(false);
  const [attachments, setAttachments] = useState<readonly MessageAttachment[]>(
    [],
  );
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [messageMenuId, setMessageMenuId] = useState<string | null>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const mentionQuery = getMentionQuery(draft);
  const mentionCandidates =
    mentionQuery === null
      ? []
      : team.members.filter((member) =>
          member.displayName.toLocaleLowerCase("fr-FR").includes(mentionQuery),
        );

  useEffect(() => {
    setDraft("");
    onTypingChange(false);
    if (typingTimer.current) clearTimeout(typingTimer.current);
  }, [onTypingChange, selectedChannelId, team.id]);
  useEffect(() => {
    const container = messagesContainer.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const submitMessage = async () => {
    if (!draft.trim() || sending) return;
    setSending(true);
    const sent = await onSend(draft, attachments);
    if (sent) {
      setDraft("");
      setAttachments([]);
      onTypingChange(false);
    }
    setSending(false);
  };

  return (
    <section
      className={`chat-panel team-color-${teamColor}`}
      aria-label={`Conversation ${team.name}`}
    >
      <header className="panel-heading chat-panel-heading">
        <div className="panel-title">
          <strong>CHAT</strong>
          <label className="team-chat-selector">
            <span className="sr-only">Équipe du chat</span>
            <select
              aria-label="Équipe du chat"
              value={team.id}
              onChange={(event) => {
                onSelectTeam(event.target.value);
              }}
            >
              {teams.map((candidate) => (
                <option value={candidate.id} key={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </label>
          <label className="channel-selector">
            <span aria-hidden="true">#</span>
            <span className="sr-only">Canal</span>
            <select
              aria-label="Canal"
              value={selectedChannelId}
              onChange={(event) => {
                onSelectChannel(event.target.value);
              }}
            >
              {channels.map((channel) => (
                <option value={channel.id} key={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
          </label>
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
          <button aria-label="Gérer les canaux" onClick={onManageChannels}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>
      <div className="chat-messages" aria-live="polite" ref={messagesContainer}>
        {loading && <div className="chat-state">Chargement…</div>}
        {error && (
          <div className="chat-state chat-state-error" role="alert">
            <span>{error}</span>
            <button onClick={onRetry}>Réessayer</button>
          </div>
        )}
        {!loading && !error && messages.length === 0 && (
          <div className="chat-state">Démarrez la conversation.</div>
        )}
        {messages.map((message) => (
          <article
            className={`compact-message${focusedMessageId === message.id ? " focused-message" : ""}`}
            data-message-id={message.id}
            key={message.id}
          >
            <span className="portrait portrait-chat">
              <img src={message.author.avatarUrl} alt="" />
            </span>
            <div>
              <div className="message-meta">
                <strong>{message.author.displayName}</strong>
                <time dateTime={message.createdAt}>
                  {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <button
                  className="message-options"
                  aria-label={`Actions du message de ${message.author.displayName}`}
                  aria-expanded={messageMenuId === message.id}
                  onClick={() => {
                    setMessageMenuId((current) =>
                      current === message.id ? null : message.id,
                    );
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
                {messageMenuId === message.id && (
                  <div className="message-actions">
                    <button
                      onClick={() => {
                        onCreateTaskFromMessage(message);
                        setMessageMenuId(null);
                      }}
                    >
                      <ListTodo size={14} /> Créer une tâche
                    </button>
                    <button
                      onClick={() => {
                        onCreateDecisionFromMessage(message);
                        setMessageMenuId(null);
                      }}
                      disabled={decisionMessageIds.includes(message.id)}
                    >
                      <CheckCircle2 size={14} /> Créer une décision
                    </button>
                  </div>
                )}
              </div>
              <p>
                <MessageContent message={message} team={team} />
              </p>
              {message.attachments.map((attachment) =>
                attachment.mimeType.startsWith("image/") ? (
                  <a
                    className="image-attachment"
                    href={attachment.dataUrl}
                    download={attachment.name}
                    key={attachment.id}
                  >
                    <img src={attachment.dataUrl} alt={attachment.name} />
                    <span>
                      {attachment.name} ·{" "}
                      {(attachment.size / 1024 / 1024).toFixed(1)} Mo
                    </span>
                  </a>
                ) : (
                  <a
                    className="pdf-attachment"
                    href={attachment.dataUrl}
                    download={attachment.name}
                    key={attachment.id}
                  >
                    <FileText size={16} />
                    <span>
                      <strong>{attachment.name}</strong>
                      <small>
                        {(attachment.size / 1024 / 1024).toFixed(1)} Mo · PDF
                      </small>
                    </span>
                  </a>
                ),
              )}
              {decisionMessageIds.includes(message.id) && (
                <span className="message-decision">
                  <CheckCircle2 size={12} /> Décision créée
                </span>
              )}
            </div>
          </article>
        ))}
        {typingMembers.length > 0 && (
          <div className="typing-indicator" role="status">
            <span className="typing-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              {formatTypingLabel(
                typingMembers.map((member) => member.displayName),
              )}
              …
            </span>
          </div>
        )}
      </div>
      <form
        className="chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          void submitMessage();
        }}
      >
        <label className="sr-only" htmlFor="message">
          Écrire un message
        </label>
        <input
          id="message"
          placeholder="Écrire un message..."
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setMentionsOpen(getMentionQuery(event.target.value) !== null);
            const typing = event.target.value.trim().length > 0;
            onTypingChange(typing);
            if (typingTimer.current) clearTimeout(typingTimer.current);
            if (typing) {
              typingTimer.current = setTimeout(() => {
                onTypingChange(false);
              }, 2500);
            }
          }}
        />
        {attachments.length > 0 && (
          <div className="pending-attachments">
            {attachments.map((attachment) => (
              <span key={attachment.id}>
                <FileText size={14} />
                <span>
                  {attachment.name}
                  <small>{(attachment.size / 1024 / 1024).toFixed(1)} Mo</small>
                </span>
                <button
                  type="button"
                  aria-label={`Retirer ${attachment.name}`}
                  onClick={() => {
                    setAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id),
                    );
                  }}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
        {attachmentError && (
          <div className="attachment-error" role="alert">
            {attachmentError}
          </div>
        )}
        {mentionsOpen && mentionCandidates.length > 0 && (
          <div
            className="mention-suggestions"
            role="listbox"
            aria-label="Membres à mentionner"
          >
            {mentionCandidates.map((member) => (
              <button
                type="button"
                role="option"
                aria-selected="false"
                key={member.id}
                onClick={() => {
                  setDraft((current) => insertMention(current, member));
                  setMentionsOpen(false);
                }}
              >
                <img src={member.avatarUrl} alt="" />
                <span>
                  <strong>{member.displayName}</strong>
                  <small>{member.role}</small>
                </span>
              </button>
            ))}
          </div>
        )}
        {emojisOpen && (
          <div className="emoji-picker" aria-label="Emojis">
            {availableEmojis.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => {
                  setDraft((current) => `${current}${emoji}`);
                  setEmojisOpen(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          aria-label="Ajouter un emoji"
          aria-expanded={emojisOpen}
          onClick={() => {
            setEmojisOpen((open) => !open);
          }}
        >
          <Smile size={18} />
        </button>
        <input
          className="sr-only"
          ref={fileInput}
          type="file"
          accept="application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg"
          aria-label="Sélectionner un PDF ou une image"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            void (async () => {
              const signature = new Uint8Array(
                await file.slice(0, 8).arrayBuffer(),
              );
              const lowerName = file.name.toLowerCase();
              const isPdf =
                file.type === "application/pdf" &&
                lowerName.endsWith(".pdf") &&
                hasPdfSignature(signature);
              const isPng =
                file.type === "image/png" &&
                lowerName.endsWith(".png") &&
                hasPngSignature(signature);
              const isJpeg =
                file.type === "image/jpeg" &&
                (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) &&
                hasJpegSignature(signature);
              if (!isPdf && !isPng && !isJpeg)
                throw new Error(
                  "Le fichier doit être un PDF, PNG ou JPEG valide.",
                );
              if (isPdf && file.size > maximumPdfSize)
                throw new Error("Le PDF dépasse la limite de 20 Mo.");
              if ((isPng || isJpeg) && file.size > maximumImageSize)
                throw new Error("L’image dépasse la limite de 5 Mo.");
              const attachment: MessageAttachment = {
                id: crypto.randomUUID(),
                name: file.name,
                mimeType: isPdf
                  ? "application/pdf"
                  : isPng
                    ? "image/png"
                    : "image/jpeg",
                size: file.size,
                dataUrl: await readAsDataUrl(file),
              };
              setAttachments((current) => [...current, attachment]);
              setAttachmentError(null);
            })().catch((error: unknown) => {
              setAttachmentError(
                error instanceof Error
                  ? error.message
                  : "Impossible de joindre ce fichier.",
              );
            });
          }}
        />
        <button
          type="button"
          aria-label="Joindre un fichier"
          onClick={() => {
            fileInput.current?.click();
          }}
        >
          <Paperclip size={18} />
        </button>
        <button
          className="send-button"
          type="submit"
          aria-label="Envoyer"
          disabled={(!draft.trim() && attachments.length === 0) || sending}
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
