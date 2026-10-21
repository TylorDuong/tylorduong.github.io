// Minimal RGB canvas + PNG encoder. The repo has no image dependency and a
// placeholder thumbnail isn't worth adding one, so this writes the handful of
// PNG chunks by hand: 8-bit truecolour, no interlace, filter 0 on every row.
import { deflateSync } from "node:zlib";

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

export const rgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Composite `color` over `base` at `alpha` (0..1) — the canvas has no alpha channel. */
export const blend = (base, color, alpha) =>
  base.map((b, i) => Math.round(b * (1 - alpha) + color[i] * alpha));

export function canvas(w, h, fill) {
  const px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) px.set(fill, i * 3);

  const api = {
    w,
    h,
    set(x, y, c) {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      px.set(c, (y * w + x) * 3);
    },
    get(x, y) {
      const o = (y * w + x) * 3;
      return [px[o], px[o + 1], px[o + 2]];
    },
    rect(x, y, rw, rh, c, alpha = 1) {
      for (let yy = y; yy < y + rh; yy++)
        for (let xx = x; xx < x + rw; xx++) {
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          api.set(xx, yy, alpha === 1 ? c : blend(api.get(xx, yy), c, alpha));
        }
    },
    toPNG() {
      const raw = Buffer.alloc(h * (w * 3 + 1));
      for (let y = 0; y < h; y++) {
        raw[y * (w * 3 + 1)] = 0; // filter: none
        px.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3);
      }
      const ihdr = Buffer.alloc(13);
      ihdr.writeUInt32BE(w, 0);
      ihdr.writeUInt32BE(h, 4);
      ihdr[8] = 8;  // bit depth
      ihdr[9] = 2;  // colour type: truecolour
      return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk("IHDR", ihdr),
        chunk("IDAT", deflateSync(raw, { level: 9 })),
        chunk("IEND", Buffer.alloc(0)),
      ]);
    },
  };
  return api;
}
