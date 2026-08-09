import { describe, expect, it } from "vitest";
import {
  hasJpegSignature,
  hasPdfSignature,
  hasPngSignature,
} from "./attachment";

describe("hasPdfSignature", () => {
  it("accepts only the PDF file signature", () => {
    expect(
      hasPdfSignature(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])),
    ).toBe(true);
    expect(hasPdfSignature(new Uint8Array([0x50, 0x4e, 0x47]))).toBe(false);
  });

  it("recognizes PNG and JPEG signatures", () => {
    expect(
      hasPngSignature(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe(true);
    expect(hasJpegSignature(new Uint8Array([0xff, 0xd8, 0xff]))).toBe(true);
  });
});
