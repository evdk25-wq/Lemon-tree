import { describe, expect, it } from "vitest";
import type { Team } from "./project";
import { mergeProjectTeams } from "./project";

const team: Team = {
  id: "team-1",
  name: "Backend",
  description: "",
  progress: 0,
  color: "blue",
  members: [],
};

describe("mergeProjectTeams", () => {
  it("applies persisted overrides and appends new teams", () => {
    const renamed = { ...team, name: "API Team" };
    const added = { ...team, id: "team-2", name: "Design" };

    expect(mergeProjectTeams([team], [renamed, added])).toEqual([
      renamed,
      added,
    ]);
  });
});
