import type { ProjectMessage } from "../../domain/entities/project";
import type { MessageRepository } from "../../domain/repositories/message-repository";

export class ListTeamMessages {
  constructor(private readonly messages: MessageRepository) {}

  execute(
    teamId: string,
    channelId: string,
  ): Promise<readonly ProjectMessage[]> {
    return this.messages.listByChannel(teamId, channelId);
  }
}
