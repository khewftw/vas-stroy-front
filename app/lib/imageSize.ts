import { readFileSync } from "node:fs";
import path from "node:path";

// Reads the pixel size of a local PNG / JPEG / WebP straight from the file header (server only),
// so the article can reserve the right space for a photo before it loads.
export type Size = { width: number; height: number };

const cache = new Map<string, Size | null>();

function png(b: Buffer): Size | null {
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpeg(b: Buffer): Size | null {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = b[offset + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = b.readUInt16BE(offset + 2);
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
    offset += 2 + length;
  }
  return null;
}

function webp(b: Buffer): Size | null {
  if (b.length < 30 || b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  return null;
}

export function getImageSize(src: string): Size | null {
  if (cache.has(src)) return cache.get(src) ?? null;
  let size: Size | null = null;
  try {
    const file = path.join(process.cwd(), "public", decodeURIComponent(src.replace(/^\//, "")));
    const buffer = readFileSync(file);
    size = png(buffer) ?? jpeg(buffer) ?? webp(buffer);
  } catch {
    size = null;
  }
  cache.set(src, size);
  return size;
}
