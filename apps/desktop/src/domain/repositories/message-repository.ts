import type { ProjectMessage } from "../entities/project";

export interface MessageRepository {
  listByChannel(
    teamId: string,
    channelId: string,
  ): Promise<readonly ProjectMessage[]>;
  save(message: ProjectMessage): Promise<void>;
}
