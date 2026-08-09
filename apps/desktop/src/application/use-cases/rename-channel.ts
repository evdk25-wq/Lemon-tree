import type { TeamChannel } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";
import { InvalidChannelName } from "./create-channel";

export class RenameChannel {
  constructor(private readonly channels: ChannelRepository) {}

  async execute(channel: TeamChannel, name: string): Promise<TeamChannel> {
    const normalizedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!normalizedName || channel.name === "general") {
      throw new InvalidChannelName("Channel cannot be renamed");
    }
    const existing = await this.channels.listByTeam(channel.teamId);
    if (
      existing.some(
        (candidate) =>
          candidate.id !== channel.id &&
          candidate.name === normalizedName &&
          !candidate.archived,
      )
    ) {
      throw new InvalidChannelName("Channel name already exists");
    }
    const renamed = { ...channel, name: normalizedName };
    await this.channels.save(renamed);
    return renamed;
  }
}
