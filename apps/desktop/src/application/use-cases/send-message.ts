import type { Member, ProjectMessage } from "../../domain/entities/project";
import type { MessageRepository } from "../../domain/repositories/message-repository";
import type { NotificationRepository } from "../../domain/repositories/notification-repository";
import { findMentionedMemberIds } from "../../domain/entities/message";
import type { MessageAttachment } from "../../domain/entities/attachment";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";

export class InvalidMessageContent extends Error {
  readonly name = "InvalidMessageContent";
}

export class SendMessage {
  constructor(
    private readonly messages: MessageRepository,
    private readonly notifications: NotificationRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(
    teamId: string,
    channelId: string,
    author: Member,
    members: readonly Member[],
    content: string,
    attachments: readonly MessageAttachment[] = [],
  ): Promise<ProjectMessage> {
    const normalizedContent = content.trim();
    if (!normalizedContent && attachments.length === 0) {
      throw new InvalidMessageContent("Message content is required");
    }
    const message: ProjectMessage = {
      id: this.ids.generate(),
      teamId,
      channelId,
      author,
      content: normalizedContent,
      mentionedMemberIds: findMentionedMemberIds(normalizedContent, members),
      attachments,
      createdAt: this.clock.now(),
    };
    await this.messages.save(message);
    await Promise.all(
      message.mentionedMemberIds
        .filter((memberId) => memberId !== author.id)
        .map((recipientId) =>
          this.notifications.save({
            id: this.ids.generate(),
            recipientId,
            messageId: message.id,
            teamId,
            channelId,
            createdAt: message.createdAt,
            readAt: null,
          }),
        ),
    );
    return message;
  }
}
