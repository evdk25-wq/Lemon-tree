import { describe, expect, it } from "vitest";
import { formatTypingLabel } from "./typing-indicator";

describe("formatTypingLabel", () => {
  it("formats one and several typing collaborators", () => {
    expect(formatTypingLabel(["Maya"])).toBe("Maya écrit");
    expect(formatTypingLabel(["Maya", "Lucas"])).toBe("Maya et Lucas écrivent");
    expect(formatTypingLabel(["Maya", "Lucas", "Nina"])).toBe(
      "Maya, Lucas et 1 autres écrivent",
    );
  });
});
