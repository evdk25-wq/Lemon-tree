import { Archive, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Team, TeamChannel } from "../../domain/entities/project";

interface ManageChannelsDialogProps {
  readonly open: boolean;
  readonly team: Team;
  readonly channels: readonly TeamChannel[];
  readonly error: string | null;
  readonly onClose: () => void;
  readonly onCreate: (name: string) => Promise<boolean>;
  readonly onRename: (channel: TeamChannel, name: string) => Promise<boolean>;
  readonly onArchive: (channel: TeamChannel) => Promise<boolean>;
}

export function ManageChannelsDialog({
  open,
  team,
  channels,
  error,
  onClose,
  onCreate,
  onRename,
  onArchive,
}: ManageChannelsDialogProps) {
  const [newName, setNewName] = useState("");
  const [names, setNames] = useState<Readonly<Record<string, string>>>({});

  useEffect(() => {
    setNames(
      Object.fromEntries(channels.map((channel) => [channel.id, channel.name])),
    );
  }, [channels]);
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="channel-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="channels-title"
      >
        <header>
          <div>
            <h2 id="channels-title">Canaux de {team.name}</h2>
            <p>
              Les responsables organisent ici les conversations de l’équipe.
            </p>
          </div>
          <button onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>
        {error && (
          <div className="channel-dialog-error" role="alert">
            {error}
          </div>
        )}
        <form
          className="create-channel-form"
          onSubmit={(event) => {
            event.preventDefault();
            void onCreate(newName).then((created) => {
              if (created) setNewName("");
            });
          }}
        >
          <label htmlFor="new-channel">Nouveau canal</label>
          <div>
            <span>#</span>
            <input
              id="new-channel"
              value={newName}
              onChange={(event) => {
                setNewName(event.target.value);
              }}
              placeholder="nom-du-canal"
            />
            <button type="submit" disabled={!newName.trim()}>
              <Plus size={16} /> Créer
            </button>
          </div>
        </form>
        <div className="channel-list">
          {channels.map((channel) => {
            const protectedChannel = channel.name === "general";
            return (
              <div className="channel-row" key={channel.id}>
                <span>#</span>
                <input
                  aria-label={`Nom du canal ${channel.name}`}
                  value={names[channel.id] ?? channel.name}
                  disabled={protectedChannel}
                  onChange={(event) => {
                    setNames((current) => ({
                      ...current,
                      [channel.id]: event.target.value,
                    }));
                  }}
                />
                <button
                  aria-label={`Enregistrer ${channel.name}`}
                  disabled={
                    protectedChannel || names[channel.id] === channel.name
                  }
                  onClick={() =>
                    void onRename(channel, names[channel.id] ?? channel.name)
                  }
                >
                  <Save size={15} />
                </button>
                <button
                  className="archive-channel"
                  aria-label={`Archiver ${channel.name}`}
                  disabled={protectedChannel}
                  onClick={() => void onArchive(channel)}
                >
                  <Archive size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
