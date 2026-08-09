import type { TeamChannel } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";
import type { IdGenerator } from "../ports/id-generator";

export class InvalidChannelName extends Error {
  readonly name = "InvalidChannelName";
}

function normalizeChannelName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9à-ÿ-]/g, "");
}

export class CreateChannel {
  constructor(
    private readonly channels: ChannelRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(teamId: string, name: string): Promise<TeamChannel> {
    const normalizedName = normalizeChannelName(name);
    if (!normalizedName)
      throw new InvalidChannelName("Channel name is required");
    const existing = await this.channels.listByTeam(teamId);
    if (existing.some((channel) => channel.name === normalizedName)) {
      throw new InvalidChannelName("Channel name already exists");
    }
    const channel: TeamChannel = {
      id: this.ids.generate(),
      teamId,
      name: normalizedName,
      archived: false,
    };
    await this.channels.save(channel);
    return channel;
  }
}
