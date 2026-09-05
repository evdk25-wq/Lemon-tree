import type { Presence } from "../../domain/entities/project";

const storageKey = "lemon-tree.member-presence";
const presenceValues: readonly Presence[] = [
  "online",
  "busy",
  "away",
  "inCall",
  "offline",
];

export function loadMemberPresencePreference(): Presence {
  const stored = globalThis.localStorage.getItem(storageKey);
  return presenceValues.find((presence) => presence === stored) ?? "online";
}

export function saveMemberPresencePreference(presence: Presence): void {
  globalThis.localStorage.setItem(storageKey, presence);
}
