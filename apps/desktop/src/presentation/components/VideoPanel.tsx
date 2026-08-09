import {
  Expand,
  Grid2X2,
  Mic,
  MonitorUp,
  MoreHorizontal,
  PhoneOff,
  Smile,
  Video,
} from "lucide-react";
import type { Team } from "../../domain/entities/project";

interface VideoPanelProps {
  readonly team: Team;
}

const tileStyles = [
  "tile-sage",
  "tile-sand",
  "tile-blue",
  "tile-rose",
] as const;

export function VideoPanel({ team }: VideoPanelProps) {
  const participants = team.members.slice(0, 4);

  return (
    <section className="video-panel" aria-label={`Appel vidéo ${team.name}`}>
      <header className="panel-heading">
        <div className="panel-title">
          <strong>VIDÉO</strong>
          <span className="presence-dot online" />
          <span>{participants.length} connectés</span>
        </div>
        <div className="panel-tools">
          <button aria-label="Vue grille">
            <Grid2X2 size={17} />
          </button>
          <button aria-label="Agrandir">
            <Expand size={17} />
          </button>
          <button aria-label="Plus d’options">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>
      <div className="video-grid">
        {participants.map((member, index) => (
          <article
            className={`video-tile ${tileStyles[index]}`}
            key={member.id}
          >
            <img className="video-person" src={member.avatarUrl} alt="" />
            <span className="video-name">{member.displayName}</span>
          </article>
        ))}
      </div>
      <div className="call-controls" aria-label="Contrôles de l’appel">
        <button aria-label="Microphone">
          <Mic size={17} />
        </button>
        <button aria-label="Caméra">
          <Video size={17} />
        </button>
        <button aria-label="Partager l’écran">
          <MonitorUp size={17} />
        </button>
        <button aria-label="Réactions">
          <Smile size={17} />
        </button>
        <button className="leave-call" aria-label="Quitter l’appel">
          <PhoneOff size={18} />
        </button>
      </div>
    </section>
  );
}
