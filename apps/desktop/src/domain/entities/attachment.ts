export const maximumPdfSize = 20 * 1024 * 1024;
export const maximumImageSize = 5 * 1024 * 1024;
export type AttachmentMimeType = "application/pdf" | "image/png" | "image/jpeg";

export interface MessageAttachment {
  readonly id: string;
  readonly name: string;
  readonly mimeType: AttachmentMimeType;
  readonly size: number;
  readonly dataUrl: string;
}

export function hasPngSignature(bytes: Uint8Array): boolean {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return signature.every((byte, index) => bytes[index] === byte);
}

export function hasJpegSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  );
}

export function hasPdfSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}
