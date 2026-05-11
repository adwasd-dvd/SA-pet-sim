import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const projectRoot = process.cwd();
const clientRoot = path.resolve(process.env.SA_CLIENT_ASSET_ROOT || path.join(projectRoot, "external", "sources", "client-assets"));
const mapRoot = path.join(projectRoot, "public/data/maps");
const clientMapRoot = path.join(projectRoot, "public/data/client-maps");
const worldPath = path.join(projectRoot, "src/world-data.js");
const outputRoot = path.join(projectRoot, "public/data/client-tiles");
const adrnPath = path.join(clientRoot, "data/adrn_136.bin");
const realPath = path.join(clientRoot, "data/real_136.bin");
const palettePath = path.join(clientRoot, "data/pal/Palet_1.sap");

const RECORD_SIZE = 80;
const ATLAS_W = 4096;
const COLOR_KEY = 0;

function main() {
  if (!fs.existsSync(mapRoot) || !fs.existsSync(adrnPath) || !fs.existsSync(realPath) || !fs.existsSync(palettePath)) {
    console.warn("client tile sources missing; skipped real tile atlas");
    return;
  }

  fs.mkdirSync(outputRoot, { recursive: true });
  const wanted = collectTileIds(mapRoot);
  const palette = readPalette(palettePath);
  const recordsByTile = readAdrnRecords(adrnPath);
  const realFd = fs.openSync(realPath, "r");
  const entries = [];

  try {
    for (const tileId of [...wanted].sort((a, b) => a - b)) {
      const record = recordsByTile.get(tileId);
      if (!record) continue;
      const decoded = decodeRecord(realFd, record);
      if (!decoded) continue;
      const image = indexedImageToRgba(decoded, palette);
      entries.push({
        tileId,
        image,
        width: decoded.width,
        height: decoded.height,
        xoffset: record.xoffset,
        yoffset: record.yoffset,
        color: averageColor(image)
      });
    }
  } finally {
    fs.closeSync(realFd);
  }

  const atlas = buildAtlas(entries);
  const atlasPath = path.join(outputRoot, "tiles-atlas.png");
  const manifestPath = path.join(outputRoot, "tiles.json");
  fs.writeFileSync(atlasPath, encodePng(atlas.width, atlas.height, atlas.rgba));
  fs.writeFileSync(manifestPath, `${JSON.stringify({
    image: "/data/client-tiles/tiles-atlas.png",
    atlasWidth: atlas.width,
    atlasHeight: atlas.height,
    count: entries.length,
    frames: Object.fromEntries(atlas.frames.map((frame) => [frame.tileId, frame])),
    colors: Object.fromEntries(entries.map((entry) => [entry.tileId, entry.color]))
  })}\n`);
  console.log(`wrote ${entries.length} real client tile sprites to ${path.relative(projectRoot, atlasPath)}`);
}

function collectTileIds(dir) {
  const ids = new Set();
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".ls2map")) {
      collectLs2MapTileIds(path.join(dir, file), ids);
      continue;
    }
    if (!file.endsWith(".dat")) continue;
    collectClientDatTileIds(path.join(dir, file), ids);
  }
  if (fs.existsSync(clientMapRoot)) {
    for (const file of fs.readdirSync(clientMapRoot)) {
      if (file.endsWith(".dat")) collectClientDatTileIds(path.join(clientMapRoot, file), ids);
    }
  }
  collectNpcGraphicIds(ids);
  return ids;
}

function collectNpcGraphicIds(ids) {
  if (!fs.existsSync(worldPath)) return;
  const text = fs.readFileSync(worldPath, "utf8");
  for (const match of text.matchAll(/"graphic":\s*"(\d+)"/g)) {
    const id = Number(match[1]);
    if (Number.isFinite(id) && id > 99) ids.add(id);
  }
}

function collectClientDatTileIds(file, ids) {
  const buf = fs.readFileSync(file);
  if (buf.length < 8) return;
  const width = buf.readUInt32LE(0);
  const height = buf.readUInt32LE(4);
  const cellCount = width * height;
  const layerSize = cellCount * 2;
  const expected = 8 + layerSize * 3;
  if (!width || !height || buf.length < expected) return;
  for (let i = 0; i < cellCount; i += 1) {
    const tile = buf.readUInt16LE(8 + i * 2);
    const parts = buf.readUInt16LE(8 + layerSize + i * 2);
    if (tile) ids.add(tile);
    if (parts) ids.add(parts);
  }
}

function collectLs2MapTileIds(file, ids) {
  const buf = fs.readFileSync(file);
  if (buf.length < 44 || buf.toString("ascii", 0, 6) !== "LS2MAP") return;
  const width = buf.readUInt16BE(40);
  const height = buf.readUInt16BE(42);
  const cellCount = width * height;
  const layerSize = cellCount * 2;
  const expected = 44 + layerSize * 2;
  if (!width || !height || buf.length < expected) return;
  for (let i = 0; i < cellCount; i += 1) {
    const tile = buf.readUInt16BE(44 + i * 2);
    const parts = buf.readUInt16BE(44 + layerSize + i * 2);
    if (tile) ids.add(tile);
    if (parts) ids.add(parts);
  }
}

function readPalette(file) {
  const data = fs.readFileSync(file);
  const palette = Array.from({ length: 256 }, () => [0, 0, 0, 255]);
  const systemColors = [
    [0x00, 0x00, 0x00], [0x80, 0x00, 0x00], [0x00, 0x80, 0x00], [0x80, 0x80, 0x00],
    [0x00, 0x00, 0x80], [0x80, 0x00, 0x80], [0x00, 0x80, 0x80], [0xc0, 0xc0, 0xc0],
    [0xc0, 0xdc, 0xc0], [0xa6, 0xca, 0xf0], [0xde, 0x00, 0x00], [0xff, 0x5f, 0x00],
    [0xff, 0xff, 0xa0], [0x00, 0x5f, 0xd2], [0x50, 0xd2, 0xff], [0x28, 0xe1, 0x28]
  ];
  for (let i = 0; i < systemColors.length; i += 1) palette[i] = [...systemColors[i], i === COLOR_KEY ? 0 : 255];
  for (let i = 16; i < 240; i += 1) {
    const offset = (i - 16) * 3;
    if (offset + 2 >= data.length) break;
    palette[i] = [data[offset + 2], data[offset + 1], data[offset], 255];
  }
  const tail = [
    [0xf5, 0xc3, 0x96], [0xe1, 0xa0, 0x5f], [0xc3, 0x7d, 0x46], [0x9b, 0x55, 0x1e],
    [0x46, 0x41, 0x37], [0x28, 0x23, 0x1e], [0xff, 0xfb, 0xf0], [0xa0, 0xa0, 0xa4],
    [0x80, 0x80, 0x80], [0xff, 0x00, 0x00], [0x00, 0xff, 0x00], [0xff, 0xff, 0x00],
    [0x00, 0x00, 0xff], [0xff, 0x00, 0xff], [0x00, 0xff, 0xff], [0xff, 0xff, 0xff]
  ];
  for (let i = 0; i < tail.length; i += 1) palette[240 + i] = [...tail[i], 255];
  palette[COLOR_KEY][3] = 0;
  return palette;
}

function readAdrnRecords(file) {
  const data = fs.readFileSync(file);
  const records = new Map();
  for (let offset = 0; offset + RECORD_SIZE <= data.length; offset += RECORD_SIZE) {
    const bitmapNo = data.readUInt32LE(offset);
    const graphicNo = data.readUInt32LE(offset + 76);
    const adder = data.readUInt32LE(offset + 4);
    const size = data.readUInt32LE(offset + 8);
    const width = data.readUInt32LE(offset + 20);
    const height = data.readUInt32LE(offset + 24);
    const xoffset = data.readInt32LE(offset + 12);
    const yoffset = data.readInt32LE(offset + 16);
    if (!bitmapNo || !size || !width || !height) continue;
    const record = { bitmapNo, graphicNo, adder, size, width, height, xoffset, yoffset };
    if (graphicNo) records.set(graphicNo, record);
    else if (!records.has(bitmapNo)) records.set(bitmapNo, record);
  }
  return records;
}

function decodeRecord(fd, record) {
  const packed = Buffer.alloc(record.size);
  fs.readSync(fd, packed, 0, record.size, record.adder);
  if (packed[0] !== 0x52 || packed[1] !== 0x44) return null;
  const compressFlag = packed[2];
  const width = packed.readUInt32LE(4);
  const height = packed.readUInt32LE(8);
  const size = packed.readUInt32LE(12);
  if (!width || !height || width * height > 1600 * 1600 || size > packed.length) return null;
  const pixels = Buffer.alloc(width * height);
  if (compressFlag === 0) {
    packed.copy(pixels, 0, 16, 16 + pixels.length);
  } else if (compressFlag === 1) {
    unpackRle(packed.subarray(16, size), pixels);
  } else {
    return null;
  }
  return { width, height, pixels };
}

function unpackRle(data, out) {
  let input = 0;
  let output = 0;
  while (input < data.length && output < out.length) {
    const idx = data[input++];
    let count;
    if (idx & 0x80) {
      const value = (idx & 0x40) ? 0 : data[input++];
      if (idx & 0x20) {
        count = ((idx & 0x0f) << 16) | (data[input++] << 8) | data[input++];
      } else if (idx & 0x10) {
        count = ((idx & 0x0f) << 8) | data[input++];
      } else {
        count = idx & 0x0f;
      }
      out.fill(value, output, Math.min(out.length, output + count));
      output += count;
    } else {
      if (idx & 0x10) count = ((idx & 0x0f) << 8) | data[input++];
      else count = idx & 0x0f;
      data.copy(out, output, input, input + count);
      input += count;
      output += count;
    }
  }
}

function indexedImageToRgba(image, palette) {
  const rgba = Buffer.alloc(image.width * image.height * 4);
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const color = palette[image.pixels[y * image.width + x]];
      const out = (y * image.width + x) * 4;
      rgba[out] = color[0];
      rgba[out + 1] = color[1];
      rgba[out + 2] = color[2];
      rgba[out + 3] = color[3];
    }
  }
  return rgba;
}

function buildAtlas(entries) {
  let x = 0;
  let y = 0;
  let rowH = 0;
  const frames = [];
  for (const entry of entries) {
    if (x > 0 && x + entry.width > ATLAS_W) {
      x = 0;
      y += rowH;
      rowH = 0;
    }
    frames.push({
      tileId: entry.tileId,
      x,
      y,
      width: entry.width,
      height: entry.height,
      xoffset: entry.xoffset,
      yoffset: entry.yoffset
    });
    x += entry.width;
    rowH = Math.max(rowH, entry.height);
  }
  const width = ATLAS_W;
  const height = Math.max(1, y + rowH);
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < entries.length; i += 1) {
    const frame = frames[i];
    blit(entries[i].image, entries[i].width, entries[i].height, rgba, width, frame.x, frame.y);
  }
  return { width, height, rgba, frames };
}

function averageColor(rgba) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    const alpha = rgba[i + 3];
    if (alpha < 16) continue;
    r += rgba[i];
    g += rgba[i + 1];
    b += rgba[i + 2];
    n += 1;
  }
  if (!n) return "#000000";
  return `#${hex(Math.round(r / n))}${hex(Math.round(g / n))}${hex(Math.round(b / n))}`;
}

function hex(value) {
  return value.toString(16).padStart(2, "0");
}

function blit(src, srcW, srcH, dest, destW, dx, dy) {
  for (let y = 0; y < srcH; y += 1) {
    for (let x = 0; x < srcW; x += 1) {
      const si = (y * srcW + x) * 4;
      const di = ((dy + y) * destW + dx + x) * 4;
      src.copy(dest, di, si, si + 4);
    }
  }
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const chunks = [
    chunk("IHDR", Buffer.concat([u32(width), u32(height), Buffer.from([8, 6, 0, 0, 0])])),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ];
  return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), ...chunks]);
}

function chunk(type, data) {
  const name = Buffer.from(type);
  return Buffer.concat([u32(data.length), name, data, u32(crc32(Buffer.concat([name, data])))]); 
}

function u32(value) {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(value >>> 0);
  return buf;
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

main();
