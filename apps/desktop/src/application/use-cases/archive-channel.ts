import type { TeamChannel } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";

export class ProtectedChannel extends Error {
  readonly name = "ProtectedChannel";
}

export class ArchiveChannel {
  constructor(private readonly channels: ChannelRepository) {}

  async execute(channel: TeamChannel): Promise<TeamChannel> {
    if (channel.name === "general") {
      throw new ProtectedChannel("General channel cannot be archived");
    }
    const archived = { ...channel, archived: true };
    await this.channels.save(archived);
    return archived;
  }
}
