import { describe, expect, it } from "vitest";
import { MemoryMessageRepository } from "../../infrastructure/persistence/memory-message-repository";
import { ListTeamMessages } from "./list-team-messages";

describe("ListTeamMessages", () => {
  it("returns only messages from the requested team", async () => {
    const messages = await new ListTeamMessages(
      new MemoryMessageRepository(),
    ).execute("team-backend", "general");

    expect(messages).toHaveLength(2);
    expect(messages.every((message) => message.teamId === "team-backend")).toBe(
      true,
    );
    expect(messages.every((message) => message.channelId === "general")).toBe(
      true,
    );
  });
});
