import { ArrowUpRight } from "lucide-react";
import type { Team } from "../../domain/entities/project";

interface TeamCardProps {
  readonly team: Team;
  readonly selected: boolean;
  readonly onSelect: (teamId: string) => void;
}

export function TeamCard({ team, selected, onSelect }: TeamCardProps) {
  return (
    <button
      className={selected ? "team-card selected" : "team-card"}
      onClick={() => {
        onSelect(team.id);
      }}
      aria-pressed={selected}
    >
      <span className="team-card-heading">
        <span>{team.name}</span>
        <ArrowUpRight size={17} />
      </span>
      <span className="team-description">{team.description}</span>
      <span
        className="member-stack"
        aria-label={`${String(team.members.length)} membres`}
      >
        {team.members.map((member) => (
          <span className="avatar" key={member.id}>
            {member.initials}
          </span>
        ))}
        <span className="member-count">
          {team.members.length} membre{team.members.length > 1 ? "s" : ""}
        </span>
      </span>
      <span className="progress-row">
        <span>Progression</span>
        <strong>{team.progress}%</strong>
      </span>
      <span className="progress-track">
        <span style={{ width: `${String(team.progress)}%` }} />
      </span>
    </button>
  );
}
