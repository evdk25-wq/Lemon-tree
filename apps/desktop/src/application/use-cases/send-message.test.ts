import { describe, expect, it } from "vitest";
import type { ProjectMessage } from "../../domain/entities/project";
import type { MessageRepository } from "../../domain/repositories/message-repository";
import { demoProject } from "../../infrastructure/demo/demo-project";
import { MemoryNotificationRepository } from "../../infrastructure/persistence/memory-notification-repository";
import { InvalidMessageContent, SendMessage } from "./send-message";

class FakeMessageRepository implements MessageRepository {
  messages: ProjectMessage[] = [];

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
    this.messages.push(message);
    return Promise.resolve();
  }
}

describe("SendMessage", () => {
  it("normalizes and stores a team message", async () => {
    const repository = new FakeMessageRepository();
    const useCase = new SendMessage(
      repository,
      new MemoryNotificationRepository(),
      { now: () => "2026-08-09T16:00:00.000Z" },
      { generate: () => "message-new" },
    );

    const message = await useCase.execute(
      "team-backend",
      "general",
      demoProject.teams[0].members[0],
      demoProject.teams[2].members,
      "  Bonjour l’équipe  ",
    );

    expect(message.content).toBe("Bonjour l’équipe");
    expect(repository.messages).toEqual([message]);
  });

  it("rejects an empty message", async () => {
    const useCase = new SendMessage(
      new FakeMessageRepository(),
      new MemoryNotificationRepository(),
      { now: () => "2026-08-09T16:00:00.000Z" },
      { generate: () => "message-new" },
    );

    await expect(
      useCase.execute(
        "team-backend",
        "general",
        demoProject.teams[0].members[0],
        demoProject.teams[2].members,
        "   ",
      ),
    ).rejects.toBeInstanceOf(InvalidMessageContent);
  });

  it("creates an unread notification for a mentioned member", async () => {
    const notifications = new MemoryNotificationRepository();
    const useCase = new SendMessage(
      new FakeMessageRepository(),
      notifications,
      { now: () => "2026-08-09T16:00:00.000Z" },
      { generate: () => crypto.randomUUID() },
    );

    await useCase.execute(
      "team-backend",
      "general",
      demoProject.teams[0].members[0],
      demoProject.teams[2].members,
      "Peux-tu vérifier @Lucas Bernard ?",
    );

    expect(await notifications.listUnread("lucas-bernard")).toHaveLength(1);
  });
});
