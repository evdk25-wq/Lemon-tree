import type { Team } from "../../domain/entities/project";
import type { TeamRepository } from "../../domain/repositories/team-repository";

export class MemoryTeamRepository implements TeamRepository {
  private teams: Team[] = [];

  listByProject(): Promise<readonly Team[]> {
    return Promise.resolve(this.teams);
  }

  save(_projectId: string, team: Team): Promise<void> {
    this.teams = this.teams.some((candidate) => candidate.id === team.id)
      ? this.teams.map((candidate) =>
          candidate.id === team.id ? team : candidate,
        )
      : [...this.teams, team];
    return Promise.resolve();
  }
}
