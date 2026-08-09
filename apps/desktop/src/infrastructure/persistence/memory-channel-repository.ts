import type { TeamChannel } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";
import { demoChannels } from "../demo/demo-project";

export class MemoryChannelRepository implements ChannelRepository {
  private channels = [...demoChannels];

  listByTeam(teamId: string): Promise<readonly TeamChannel[]> {
    return Promise.resolve(
      this.channels.filter((channel) => channel.teamId === teamId),
    );
  }

  save(channel: TeamChannel): Promise<void> {
    const exists = this.channels.some(
      (candidate) =>
        candidate.teamId === channel.teamId && candidate.id === channel.id,
    );
    this.channels = exists
      ? this.channels.map((candidate) =>
          candidate.teamId === channel.teamId && candidate.id === channel.id
            ? channel
            : candidate,
        )
      : [...this.channels, channel];
    return Promise.resolve();
  }
}
