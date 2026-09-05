export interface DashboardLayout {
  readonly mainWidthPercent: number;
  readonly teamHeightPercent: number;
  readonly videoHeightPercent: number;
}

export const defaultDashboardLayout: DashboardLayout = {
  mainWidthPercent: 64,
  teamHeightPercent: 56,
  videoHeightPercent: 52,
};

export function clampLayoutPercent(value: number): number {
  return Math.min(72, Math.max(28, Math.round(value)));
}
