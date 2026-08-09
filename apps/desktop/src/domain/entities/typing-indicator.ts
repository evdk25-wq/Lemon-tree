export function formatTypingLabel(names: readonly string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return `${names[0]} écrit`;
  if (names.length === 2) return `${names[0]} et ${names[1]} écrivent`;
  return `${names[0]}, ${names[1]} et ${String(names.length - 2)} autres écrivent`;
}
