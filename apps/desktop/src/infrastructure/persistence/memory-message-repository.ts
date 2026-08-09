import type { ProjectMessage } from "../../domain/entities/project";
import type { MessageRepository } from "../../domain/repositories/message-repository";
import { demoMessages } from "../demo/demo-project";

export class MemoryMessageRepository implements MessageRepository {
  private messages = [...demoMessages];

  listByChannel(
    teamId: string,
    channelId: string,
  ): Promise<readonly ProjectMessage[]> {
    return Promise.resolve(
      this.messages.filter(
        (message) =>
          message.teamId === teamId && message.channelId === channelId,
      ),
    );
  }

  save(message: ProjectMessage): Promise<void> {
    this.messages = [...this.messages, message];
    return Promise.resolve();
  }
}
