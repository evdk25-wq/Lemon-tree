import { describe, expect, it } from "vitest";
import { demoMessages } from "../../infrastructure/demo/demo-project";
import { MemoryDecisionRepository } from "../../infrastructure/persistence/memory-decision-repository";
import { CreateDecisionFromMessage } from "./create-decision-from-message";
import { ListChannelDecisions } from "./list-channel-decisions";

describe("decisions from messages", () => {
  it("creates and lists a decision linked to its source", async () => {
    const repository = new MemoryDecisionRepository();
    const decision = await new CreateDecisionFromMessage(
      repository,
      { now: () => "2026-08-09T19:00:00.000Z" },
      { generate: () => "decision-1" },
    ).execute("project-platform-v2", demoMessages[0]);

    expect(decision.sourceMessageId).toBe(demoMessages[0].id);
    expect(
      await new ListChannelDecisions(repository).execute(
        "team-backend",
        "general",
      ),
    ).toEqual([decision]);
  });

  it("does not duplicate a decision from the same message", async () => {
    const repository = new MemoryDecisionRepository();
    const useCase = new CreateDecisionFromMessage(
      repository,
      { now: () => "2026-08-09T19:00:00.000Z" },
      { generate: () => "decision-1" },
    );
    const first = await useCase.execute("project-platform-v2", demoMessages[0]);
    const second = await useCase.execute(
      "project-platform-v2",
      demoMessages[0],
    );
    expect(second).toEqual(first);
  });
});
