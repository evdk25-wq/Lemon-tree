import type { Project, Team } from "../../domain/entities/project";

export class TeamNotFound extends Error {
  readonly name = "TeamNotFound";
}

export function getTeamContext(project: Project, teamId: string): Team {
  const team = project.teams.find((candidate) => candidate.id === teamId);

  if (!team) {
    throw new TeamNotFound(`Team ${teamId} was not found`);
  }

  return team;
}
