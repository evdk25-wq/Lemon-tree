import type { MessageAttachment } from "./attachment";

export type Presence = "online" | "busy" | "inCall" | "away" | "offline";
export const teamColors = [
  "blue",
  "green",
  "violet",
  "orange",
  "rose",
  "slate",
] as const;
export type TeamColor = (typeof teamColors)[number];

export interface Member {
  readonly id: string;
  readonly displayName: string;
  readonly initials: string;
  readonly avatarUrl: string;
  readonly presence: Presence;
  readonly role: string;
}

export interface Team {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly progress: number;
  readonly members: readonly Member[];
  readonly color: TeamColor;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "active" | "paused" | "completed";
  readonly progress: number;
  readonly teams: readonly Team[];
}

export function mergeProjectTeams(
  baseTeams: readonly Team[],
  persistedTeams: readonly Team[],
): readonly Team[] {
  const persistedById = new Map(
    persistedTeams.map((team) => [team.id, team] as const),
  );
  const baseIds = new Set(baseTeams.map((team) => team.id));
  return [
    ...baseTeams.map((team) => persistedById.get(team.id) ?? team),
    ...persistedTeams.filter((team) => !baseIds.has(team.id)),
  ];
}

export interface ProjectMessage {
  readonly id: string;
  readonly teamId: string;
  readonly channelId: string;
  readonly author: Member;
  readonly content: string;
  readonly mentionedMemberIds: readonly string[];
  readonly attachments: readonly MessageAttachment[];
  readonly createdAt: string;
}

export interface TeamChannel {
  readonly id: string;
  readonly teamId: string;
  readonly name: string;
  readonly archived: boolean;
}
