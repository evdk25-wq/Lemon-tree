import { describe, expect, it } from "vitest";
import { demoProject } from "../../infrastructure/demo/demo-project";
import {
  findMentionedMemberIds,
  getMentionQuery,
  insertMention,
} from "./message";

describe("message mentions", () => {
  const nina = demoProject.teams[2].members[2];

  it("extracts the current mention query", () => {
    expect(getMentionQuery("Bonjour @Ni")).toBe("ni");
    expect(getMentionQuery("Bonjour")).toBeNull();
  });

  it("inserts and resolves a member mention", () => {
    const content = insertMention("Bonjour @Ni", nina);
    expect(content).toBe("Bonjour @Nina Rossi ");
    expect(findMentionedMemberIds(content, [nina])).toEqual([nina.id]);
  });
});
