import { describe, expect, it } from "vitest";
import type { Project } from "../../domain/entities/project";
import { getTeamContext, TeamNotFound } from "./get-team-context";

const project: Project = {
  id: "project-1",
  name: "Platform",
  description: "Project",
  status: "active",
  progress: 20,
  teams: [
    {
      id: "backend",
      name: "Backend",
      description: "Services",
      progress: 25,
      color: "blue",
      members: [],
    },
  ],
};

describe("getTeamContext", () => {
  it("returns only the selected team", () => {
    expect(getTeamContext(project, "backend").name).toBe("Backend");
  });

  it("raises an explicit error when the team does not exist", () => {
    expect(() => getTeamContext(project, "frontend")).toThrow(TeamNotFound);
  });
});
