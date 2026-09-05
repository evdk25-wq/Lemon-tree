import {
  defaultDashboardLayout,
  type DashboardLayout,
} from "../../domain/entities/dashboard-layout";

const storageKey = "lemon-tree.dashboard-layout";

function isDashboardLayout(value: unknown): value is DashboardLayout {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.mainWidthPercent === "number" &&
    typeof candidate.teamHeightPercent === "number" &&
    typeof candidate.videoHeightPercent === "number"
  );
}

export function loadDashboardLayoutPreference(): DashboardLayout {
  const stored = globalThis.localStorage.getItem(storageKey);
  if (!stored) return defaultDashboardLayout;
  try {
    const parsed: unknown = JSON.parse(stored);
    return isDashboardLayout(parsed) ? parsed : defaultDashboardLayout;
  } catch {
    return defaultDashboardLayout;
  }
}

export function saveDashboardLayoutPreference(layout: DashboardLayout): void {
  globalThis.localStorage.setItem(storageKey, JSON.stringify(layout));
}
