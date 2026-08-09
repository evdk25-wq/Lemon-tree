import { describe, expect, it } from "vitest";
import { MemoryChannelRepository } from "../../infrastructure/persistence/memory-channel-repository";
import { ArchiveChannel, ProtectedChannel } from "./archive-channel";
import { CreateChannel, InvalidChannelName } from "./create-channel";
import { ListTeamChannels } from "./list-team-channels";
import { RenameChannel } from "./rename-channel";

describe("channel management", () => {
  it("creates and lists a normalized channel", async () => {
    const repository = new MemoryChannelRepository();
    const channel = await new CreateChannel(repository, {
      generate: () => "channel-new",
    }).execute("team-backend", " Revue API ");

    expect(channel.name).toBe("revue-api");
    expect(
      await new ListTeamChannels(repository).execute("team-backend"),
    ).toContainEqual(channel);
  });

  it("rejects a duplicate channel name", async () => {
    const repository = new MemoryChannelRepository();
    await expect(
      new CreateChannel(repository, { generate: () => "duplicate" }).execute(
        "team-backend",
        "api",
      ),
    ).rejects.toBeInstanceOf(InvalidChannelName);
  });

  it("renames a custom channel", async () => {
    const repository = new MemoryChannelRepository();
    const channel = (await repository.listByTeam("team-backend")).find(
      (candidate) => candidate.id === "api",
    );
    expect(channel).toBeDefined();
    if (!channel) return;

    const renamed = await new RenameChannel(repository).execute(
      channel,
      "API publique",
    );
    expect(renamed.name).toBe("api-publique");
  });

  it("archives a custom channel and protects general", async () => {
    const repository = new MemoryChannelRepository();
    const channels = await repository.listByTeam("team-backend");
    const api = channels.find((channel) => channel.id === "api");
    const general = channels.find((channel) => channel.id === "general");
    expect(api).toBeDefined();
    expect(general).toBeDefined();
    if (!api || !general) return;

    await new ArchiveChannel(repository).execute(api);
    expect(
      await new ListTeamChannels(repository).execute("team-backend"),
    ).not.toContainEqual(api);
    await expect(
      new ArchiveChannel(repository).execute(general),
    ).rejects.toBeInstanceOf(ProtectedChannel);
  });
});
