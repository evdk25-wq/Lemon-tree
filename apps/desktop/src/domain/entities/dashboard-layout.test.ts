import { describe, expect, it } from "vitest";
import { clampLayoutPercent } from "./dashboard-layout";

describe("clampLayoutPercent", () => {
  it("keeps resized panels inside usable limits", () => {
    expect(clampLayoutPercent(10)).toBe(28);
    expect(clampLayoutPercent(49.6)).toBe(50);
    expect(clampLayoutPercent(90)).toBe(72);
  });
});
