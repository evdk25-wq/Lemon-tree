import type { Team, TeamColor } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";
import type { TeamRepository } from "../../domain/repositories/team-repository";
import type { IdGenerator } from "../ports/id-generator";

export class InvalidTeamName extends Error {
  readonly name = "InvalidTeamName";
}

export class CreateTeam {
  constructor(
    private readonly teams: TeamRepository,
    private readonly channels: ChannelRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(
    projectId: string,
    name: string,
    color: TeamColor,
    availableTeams: readonly Team[] = [],
  ): Promise<Team> {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    if (!normalizedName) throw new InvalidTeamName("Team name is required");
    const persistedTeams = await this.teams.listByProject(projectId);
    const existing = [...availableTeams, ...persistedTeams];
    if (
      existing.some(
        (team) =>
          team.name.toLocaleLowerCase("fr-FR") ===
          normalizedName.toLocaleLowerCase("fr-FR"),
      )
    ) {
      throw new InvalidTeamName("Team name already exists");
    }
    const team: Team = {
      id: this.ids.generate(),
      name: normalizedName,
      description: "Nouvelle équipe",
      progress: 0,
      color,
      members: [],
    };
    await this.teams.save(projectId, team);
    await this.channels.save({
      id: "general",
      teamId: team.id,
      name: "general",
      archived: false,
    });
    return team;
  }
}
