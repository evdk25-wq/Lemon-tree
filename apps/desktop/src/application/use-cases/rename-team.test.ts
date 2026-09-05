import { describe, expect, it } from "vitest";
import type { Team } from "../../domain/entities/project";
import type { TeamRepository } from "../../domain/repositories/team-repository";
import { RenameTeam } from "./rename-team";

describe("RenameTeam", () => {
  it("normalizes and persists the new name", async () => {
    const team: Team = {
      id: "team-1",
      name: "Backend",
      description: "",
      progress: 0,
      color: "blue",
      members: [],
    };
    let saved: Team | null = null;
    const repository: TeamRepository = {
      listByProject: () => Promise.resolve([team]),
      save: (_projectId, candidate) => {
        saved = candidate;
        return Promise.resolve();
      },
    };

    const renamed = await new RenameTeam(repository).execute(
      "project-1",
      team,
      "  Team   Nuage ",
    );

    expect(renamed.name).toBe("Team Nuage");
    expect(saved).toEqual(renamed);
  });
});
