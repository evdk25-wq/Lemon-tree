import type { Team } from "../entities/project";

export interface TeamRepository {
  listByProject(projectId: string): Promise<readonly Team[]>;
  save(projectId: string, team: Team): Promise<void>;
}
