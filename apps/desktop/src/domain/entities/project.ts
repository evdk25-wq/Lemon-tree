export type Presence = "online" | "busy" | "inCall" | "away" | "offline";

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
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "active" | "paused" | "completed";
  readonly progress: number;
  readonly teams: readonly Team[];
}

export interface ProjectMessage {
  readonly id: string;
  readonly teamId: string;
  readonly author: Member;
  readonly content: string;
  readonly createdAt: string;
}
