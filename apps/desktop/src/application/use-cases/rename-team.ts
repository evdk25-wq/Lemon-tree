import type { Team } from "../../domain/entities/project";
import type { TeamRepository } from "../../domain/repositories/team-repository";
import { InvalidTeamName } from "./create-team";

export class RenameTeam {
  constructor(private readonly teams: TeamRepository) {}

  async execute(
    projectId: string,
    team: Team,
    name: string,
    availableTeams: readonly Team[] = [],
  ): Promise<Team> {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    if (!normalizedName) throw new InvalidTeamName("Team name is required");
    const persistedTeams = await this.teams.listByProject(projectId);
    const existing = [...availableTeams, ...persistedTeams];
    if (
      existing.some(
        (candidate) =>
          candidate.id !== team.id &&
          candidate.name.toLocaleLowerCase("fr-FR") ===
            normalizedName.toLocaleLowerCase("fr-FR"),
      )
    ) {
      throw new InvalidTeamName("Team name already exists");
    }
    const renamed = { ...team, name: normalizedName };
    await this.teams.save(projectId, renamed);
    return renamed;
  }
}
