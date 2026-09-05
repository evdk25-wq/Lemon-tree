import { describe, expect, it } from "vitest";
import type { Team } from "../../domain/entities/project";
import type { ChannelRepository } from "../../domain/repositories/channel-repository";
import type { TeamRepository } from "../../domain/repositories/team-repository";
import { CreateTeam, InvalidTeamName } from "./create-team";

class FakeTeamRepository implements TeamRepository {
  teams: Team[] = [];
  listByProject(): Promise<readonly Team[]> {
    return Promise.resolve(this.teams);
  }
  save(_projectId: string, team: Team): Promise<void> {
    this.teams.push(team);
    return Promise.resolve();
  }
}

describe("CreateTeam", () => {
  it("creates a team and its general channel", async () => {
    const teams = new FakeTeamRepository();
    const channels: Parameters<ChannelRepository["save"]>[0][] = [];
    const channelRepository: ChannelRepository = {
      listByTeam: () => Promise.resolve([]),
      save: (channel) => {
        channels.push(channel);
        return Promise.resolve();
      },
    };
    const useCase = new CreateTeam(teams, channelRepository, {
      generate: () => "team-design",
    });

    const team = await useCase.execute("project-1", " Design ", "violet");

    expect(team.name).toBe("Design");
    expect(channels[0]).toMatchObject({ teamId: team.id, name: "general" });
  });

  it("rejects a duplicate team name", async () => {
    const teams = new FakeTeamRepository();
    teams.teams.push({
      id: "existing",
      name: "Design",
      description: "",
      progress: 0,
      color: "blue",
      members: [],
    });
    const channels: ChannelRepository = {
      listByTeam: () => Promise.resolve([]),
      save: () => Promise.resolve(),
    };
    const useCase = new CreateTeam(teams, channels, {
      generate: () => "new-id",
    });

    await expect(
      useCase.execute("project-1", "design", "green"),
    ).rejects.toBeInstanceOf(InvalidTeamName);
  });
});
