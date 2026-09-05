import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  teamColors,
  type Team,
  type TeamColor,
} from "../../domain/entities/project";

interface CreateTeamDialogProps {
  readonly open: boolean;
  readonly error: string | null;
  readonly onClose: () => void;
  readonly onCreate: (name: string, color: TeamColor) => Promise<Team | null>;
}

export function CreateTeamDialog({
  open,
  error,
  onClose,
  onCreate,
}: CreateTeamDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<TeamColor>("blue");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setColor("blue");
    }
  }, [open]);
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="team-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-team-title"
      >
        <header>
          <div>
            <h2 id="create-team-title">Nouvelle équipe</h2>
            <p>Créez un espace avec son propre canal #general.</p>
          </div>
          <button aria-label="Fermer" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSaving(true);
            void onCreate(name, color).then((team) => {
              setSaving(false);
              if (team) onClose();
            });
          }}
        >
          <label htmlFor="team-name">Nom de l’équipe</label>
          <input
            id="team-name"
            value={name}
            autoFocus
            placeholder="Ex. Team Nuage"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <fieldset>
            <legend>Couleur</legend>
            <div className="team-color-options">
              {teamColors.map((candidate) => (
                <button
                  type="button"
                  key={candidate}
                  className={`team-color-swatch team-color-${candidate}`}
                  aria-label={`Couleur ${candidate}`}
                  aria-pressed={candidate === color}
                  onClick={() => {
                    setColor(candidate);
                  }}
                />
              ))}
            </div>
          </fieldset>
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
              disabled={!name.trim() || saving}
            >
              <Plus size={16} /> Créer l’équipe
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
