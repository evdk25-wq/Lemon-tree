import type { TeamChannel } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";

export class ListTeamChannels {
  constructor(private readonly channels: ChannelRepository) {}

  async execute(teamId: string): Promise<readonly TeamChannel[]> {
    const channels = await this.channels.listByTeam(teamId);
    return channels.filter((channel) => !channel.archived);
  }
}
