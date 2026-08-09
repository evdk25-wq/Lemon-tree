import { teamColors, type TeamColor } from "../../domain/entities/project";

const storageKey = "lemon-tree.team-colors";

function isTeamColor(value: unknown): value is TeamColor {
  return (
    typeof value === "string" && teamColors.some((color) => color === value)
  );
}

export function loadTeamColorPreferences(): Readonly<
  Record<string, TeamColor>
> {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(storageKey) ?? "{}",
    );
    if (!stored || typeof stored !== "object" || Array.isArray(stored))
      return {};
    return Object.fromEntries(
      Object.entries(stored).filter((entry) => isTeamColor(entry[1])),
    );
  } catch {
    return {};
  }
}

export function saveTeamColorPreferences(
  colors: Readonly<Record<string, TeamColor>>,
): void {
  localStorage.setItem(storageKey, JSON.stringify(colors));
}
