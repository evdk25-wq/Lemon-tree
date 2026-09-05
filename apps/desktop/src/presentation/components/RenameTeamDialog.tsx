import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Team } from "../../domain/entities/project";

interface RenameTeamDialogProps {
  readonly team: Team | null;
  readonly error: string | null;
  readonly onClose: () => void;
  readonly onRename: (team: Team, name: string) => Promise<boolean>;
}

export function RenameTeamDialog({
  team,
  error,
  onClose,
  onRename,
}: RenameTeamDialogProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(team?.name ?? "");
  }, [team]);
  if (!team) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="team-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-team-title"
      >
        <header>
          <div>
            <h2 id="rename-team-title">Renommer l’équipe</h2>
            <p>Le nouveau nom sera visible dans tout le projet.</p>
          </div>
          <button aria-label="Fermer" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSaving(true);
            void onRename(team, name).then((renamed) => {
              setSaving(false);
              if (renamed) onClose();
            });
          }}
        >
          <label htmlFor="rename-team-name">Nom de l’équipe</label>
          <input
            id="rename-team-name"
            value={name}
            autoFocus
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          {error && (
            <p className="team-dialog-error" role="alert">
              {error}
            </p>
          )}
          <div className="dialog-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={!name.trim() || name.trim() === team.name || saving}
            >
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
