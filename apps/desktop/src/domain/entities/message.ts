import type { Member } from "./project";

export function getMentionQuery(content: string): string | null {
  const marker = content.lastIndexOf("@");
  if (marker < 0) return null;
  const fragment = content.slice(marker + 1);
  if (fragment.includes("\n")) return null;
  return fragment.toLocaleLowerCase("fr-FR");
}

export function insertMention(content: string, member: Member): string {
  const marker = content.lastIndexOf("@");
  const prefix = marker < 0 ? `${content}@` : content.slice(0, marker + 1);
  return `${prefix}${member.displayName} `;
}

export function findMentionedMemberIds(
  content: string,
  members: readonly Member[],
): readonly string[] {
  return members
    .filter((member) => content.includes(`@${member.displayName}`))
    .map((member) => member.id);
}
