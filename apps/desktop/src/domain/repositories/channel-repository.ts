import type { TeamChannel } from "../entities/project";

export interface ChannelRepository {
  listByTeam(teamId: string): Promise<readonly TeamChannel[]>;
  save(channel: TeamChannel): Promise<void>;
}
