import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const projectRoot = process.cwd();
const clientRoot = path.resolve(process.env.SA_CLIENT_ASSET_ROOT || path.join(projectRoot, "external", "sources", "client-assets"));
const mapRoot = path.join(projectRoot, "public/data/maps");
const clientMapRoot = path.join(projectRoot, "public/data/client-maps");
const worldPath = path.join(projectRoot, "src/world-data.js");
const outputRoot = path.join(projectRoot, "public/data/client-tiles");
const enemyBasePath = path.join(projectRoot, "public/data/enemybase2.txt");
const adrnPath = path.join(clientRoot, "data/adrn_136.bin");
const realPath = path.join(clientRoot, "data/real_136.bin");
const palettePath = path.join(clientRoot, "data/pal/Palet_1.sap");
const ATLAS_VERSION = "battle-sprites-v1";

const RECORD_SIZE = 80;
const ATLAS_W_DEFAULT = 4096;
const COLOR_KEY = 0;
const ATLAS_MODE = (process.env.SA_TILE_ATLAS_MODE || "indexed").toLowerCase();
const ATLAS_PACK_STRATEGY = (process.env.SA_TILE_ATLAS_PACK_STRATEGY || "auto").toLowerCase();
const PNG_FILTER_MODE = (process.env.SA_PNG_FILTER_MODE || "auto").toLowerCase();
const ATLAS_W = parsePositiveInt(process.env.SA_TILE_ATLAS_WIDTH, ATLAS_W_DEFAULT);
const FIELD_UI_GRAPHIC_IDS = [
  // Original field/mouse UI resources from client-source/systeminc/anim_tbl.h
  25000, 25001,
  26100, 26101, 26102, 26103, 26104, 26105, 26106, 26107, 26111, 26112,
  26113, 26114, 26115, 26116, 26117, 26118, 26119, 26120, 26121, 26233,
  26234, 26235, 26236, 26237, 26238, 26248, 26249, 26260, 26294, 26295,
  26358, 26452, 28553, 35271
];
const DEFAULT_PLAYER_SPRITE_FRAME_IDS = [
  // SPR_001em / ANIM_STAND + ANIM_WALK frames parsed from data/spr_115.bin.
  10201, 10202, 10203, 10212, 10213, 10214, 10215, 10216, 10217,
  10244, 10245, 10246, 10255, 10256, 10257, 10258, 10259, 10260,
  10287, 10288, 10289, 10298, 10299, 10300, 10301, 10302, 10303,
  10330, 10331, 10332, 10341, 10342, 10343, 10344, 10345, 10346,
  10373, 10374, 10375, 10384, 10385, 10386, 10387, 10388, 10389,
  10416, 10417, 10418, 10427, 10428, 10429, 10430, 10431, 10432,
  10459, 10460, 10461, 10470, 10471, 10472, 10473, 10474, 10475,
  10502, 10503, 10504, 10513, 10514, 10515, 10516, 10517, 10518
];
const DEFAULT_PLAYER_SPRITE_BITMAP_IDS = new Set(DEFAULT_PLAYER_SPRITE_FRAME_IDS);

function main() {
  if (!fs.existsSync(mapRoot) || !fs.existsSync(adrnPath) || !fs.existsSync(realPath) || !fs.existsSync(palettePath)) {
    console.warn("client tile sources missing; skipped real tile atlas");
    return;
  }

  fs.mkdirSync(outputRoot, { recursive: true });
  const wanted = collectTileIds(mapRoot);
  const palette = readPalette(palettePath);
  const records = readAdrnRecords(adrnPath);
  const realFd = fs.openSync(realPath, "r");
  const entries = [];

  try {
    for (const tileId of [...wanted].sort((a, b) => a - b)) {
      const record = DEFAULT_PLAYER_SPRITE_BITMAP_IDS.has(tileId)
        ? records.byBitmap.get(tileId)
        : records.byGraphic.get(tileId) || records.byBitmap.get(tileId);
      if (!record) continue;
      const decoded = decodeRecord(realFd, record);
      if (!decoded) continue;
      entries.push({
        tileId,
        pixels: decoded.pixels,
        width: decoded.width,
        height: decoded.height,
        bitmapNo: record.bitmapNo,
        graphicNo: record.graphicNo,
        xoffset: record.xoffset,
        yoffset: record.yoffset,
        hit: record.hit,
        hitRaw: record.hitRaw,
        prioType: record.prioType,
        hitX: record.hitX,
        hitY: record.hitY,
        heightFlag: record.heightFlag,
        color: averageColor(decoded.pixels, palette)
      });
    }
  } finally {
    fs.closeSync(realFd);
  }

  const atlas = buildAtlas(entries, palette, ATLAS_MODE);
  const atlasPath = path.join(outputRoot, "tiles-atlas.png");
  const manifestPath = path.join(outputRoot, "tiles.json");
  if (atlas.pixelFormat === "indexed8") {
    fs.writeFileSync(atlasPath, atlas.preEncodedPng || encodeIndexedPng(atlas.width, atlas.height, atlas.indexes, palette));
  } else {
    fs.writeFileSync(atlasPath, encodePng(atlas.width, atlas.height, atlas.rgba));
  }
  fs.writeFileSync(manifestPath, `${JSON.stringify({
    image: `/data/client-tiles/tiles-atlas.png?v=${ATLAS_VERSION}`,
    atlasWidth: atlas.width,
    atlasHeight: atlas.height,
    pixelFormat: atlas.pixelFormat,
    count: entries.length,
    frames: Object.fromEntries(atlas.frames.map((frame) => [frame.tileId, frame])),
    colors: Object.fromEntries(entries.map((entry) => [entry.tileId, entry.color]))
  })}\n`);
  console.log(
    `wrote ${entries.length} real client tile sprites to ${path.relative(projectRoot, atlasPath)} `
    + `(${atlas.pixelFormat}, ${atlas.width}x${atlas.height}, pack=${atlas.packStrategyUsed}, filter=${atlas.filterModeUsed || PNG_FILTER_MODE})`
  );
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
  collectEncounterPetBitmapIds(ids);
  FIELD_UI_GRAPHIC_IDS.forEach((id) => ids.add(id));
  DEFAULT_PLAYER_SPRITE_FRAME_IDS.forEach((id) => ids.add(id));
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

function collectEncounterPetBitmapIds(ids) {
  if (!fs.existsSync(worldPath) || !fs.existsSync(enemyBasePath)) return;
  const petNos = new Set([100]);
  const worldText = fs.readFileSync(worldPath, "utf8");
  for (const match of worldText.matchAll(/"encounterPets":\s*\[([\s\S]*?)\]/g)) {
    for (const id of match[1].matchAll(/\d+/g)) {
      petNos.add(Number(id[0]));
    }
  }
  for (const line of fs.readFileSync(enemyBasePath, "utf8").split(/\r?\n/)) {
    const rows = line.split(",");
    if (rows.length < 37) continue;
    const petNo = Number(rows[6]);
    const imageNo = Number(rows[36]);
    if (petNos.has(petNo) && Number.isFinite(imageNo) && imageNo > 99) ids.add(imageNo);
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
  const byGraphic = new Map();
  const byBitmap = new Map();
  for (let offset = 0; offset + RECORD_SIZE <= data.length; offset += RECORD_SIZE) {
    const bitmapNo = data.readUInt32LE(offset);
    const graphicNo = data.readUInt32LE(offset + 76);
    const adder = data.readUInt32LE(offset + 4);
    const size = data.readUInt32LE(offset + 8);
    const width = data.readUInt32LE(offset + 20);
    const height = data.readUInt32LE(offset + 24);
    const xoffset = data.readInt32LE(offset + 12);
    const yoffset = data.readInt32LE(offset + 16);
    const hitX = data.readUInt8(offset + 28);
    const hitY = data.readUInt8(offset + 29);
    const hitRaw = data.readUInt16LE(offset + 30);
    const heightFlag = data.readInt16LE(offset + 32);
    if (!bitmapNo || !size || !width || !height) continue;
    const record = {
      bitmapNo,
      graphicNo,
      adder,
      size,
      width,
      height,
      xoffset,
      yoffset,
      hitX,
      hitY,
      hit: hitFlag(bitmapNo, hitRaw),
      hitRaw,
      prioType: Math.trunc(hitRaw / 100),
      heightFlag
    };
    if (!byBitmap.has(bitmapNo)) byBitmap.set(bitmapNo, record);
    if (graphicNo) byGraphic.set(graphicNo, record);
  }
  return { byGraphic, byBitmap };
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

function buildAtlas(entries, palette, mode) {
  const strategy = resolvePackStrategy(ATLAS_PACK_STRATEGY);
  const candidates = strategy === "auto" ? ["height", "area", "tileid"] : [strategy];
  const packedCandidates = candidates.map((candidate) => packEntries(entries, candidate));
  let selected = packedCandidates[0];

  if (mode === "indexed") {
    const filterModes = resolveFilterModes(PNG_FILTER_MODE);
    for (const packed of packedCandidates) {
      for (const filterMode of filterModes) {
        const encoded = encodeIndexedPng(packed.width, packed.height, packed.indexes, palette, filterMode);
        if (!packed.indexedPng || encoded.length < packed.indexedPngBytes) {
          packed.indexedPng = encoded;
          packed.indexedPngBytes = encoded.length;
          packed.filterMode = filterMode;
        }
      }
    }
    selected = packedCandidates.reduce((best, next) => {
      if (!best) return next;
      if ((next.indexedPngBytes ?? Number.POSITIVE_INFINITY) < (best.indexedPngBytes ?? Number.POSITIVE_INFINITY)) return next;
      if ((next.indexedPngBytes ?? Number.POSITIVE_INFINITY) > (best.indexedPngBytes ?? Number.POSITIVE_INFINITY)) return best;
      if (next.height < best.height) return next;
      if (next.height > best.height) return best;
      return next.width < best.width ? next : best;
    }, null);
  } else {
    selected = packedCandidates.reduce((best, next) => {
      if (!best) return next;
      if (next.height < best.height) return next;
      if (next.height > best.height) return best;
      return next.width < best.width ? next : best;
    }, null);
  }

  if (!selected) throw new Error("No atlas packing candidate selected");
  if (mode === "rgba") {
    return {
      width: selected.width,
      height: selected.height,
      rgba: indexedToRgba(selected.indexes, palette),
      frames: selected.frames,
      pixelFormat: "rgba32",
      packStrategyUsed: selected.strategy
    };
  }
  return {
    width: selected.width,
    height: selected.height,
    indexes: selected.indexes,
    frames: selected.frames,
    pixelFormat: "indexed8",
    preEncodedPng: selected.indexedPng,
    packStrategyUsed: selected.strategy,
    filterModeUsed: selected.filterMode || "none"
  };
}

function packEntries(entries, strategy) {
  const sortedEntries = sortEntriesForPacking(entries, strategy);
  const atlasWidth = Math.max(1, ATLAS_W, ...sortedEntries.map((entry) => entry.width));
  let x = 0;
  let y = 0;
  let rowH = 0;
  const frames = [];
  const packedEntries = [];
  for (const entry of sortedEntries) {
    if (x > 0 && x + entry.width > atlasWidth) {
      x = 0;
      y += rowH;
      rowH = 0;
    }
    frames.push({
      tileId: entry.tileId,
      bitmapNo: entry.bitmapNo,
      graphicNo: entry.graphicNo,
      x,
      y,
      width: entry.width,
      height: entry.height,
      xoffset: entry.xoffset,
      yoffset: entry.yoffset,
      hit: entry.hit,
      hitRaw: entry.hitRaw,
      prioType: entry.prioType,
      hitX: entry.hitX,
      hitY: entry.hitY,
      heightFlag: entry.heightFlag
    });
    packedEntries.push(entry);
    x += entry.width;
    rowH = Math.max(rowH, entry.height);
  }
  const width = atlasWidth;
  const height = Math.max(1, y + rowH);
  const indexes = Buffer.alloc(width * height);
  indexes.fill(COLOR_KEY);
  for (let i = 0; i < packedEntries.length; i += 1) {
    const frame = frames[i];
    const entry = packedEntries[i];
    blitIndexed(entry.pixels, entry.width, entry.height, indexes, width, frame.x, frame.y);
  }
  return { strategy, width, height, indexes, frames };
}

function sortEntriesForPacking(entries, strategy) {
  if (strategy === "tileid") {
    return entries.slice().sort((a, b) => a.tileId - b.tileId);
  }
  if (strategy === "area") {
    return entries.slice().sort((a, b) => {
      const areaDiff = (b.width * b.height) - (a.width * a.height);
      if (areaDiff) return areaDiff;
      const hDiff = b.height - a.height;
      if (hDiff) return hDiff;
      const wDiff = b.width - a.width;
      if (wDiff) return wDiff;
      return a.tileId - b.tileId;
    });
  }
  return entries.slice().sort((a, b) => {
    const hDiff = b.height - a.height;
    if (hDiff) return hDiff;
    const wDiff = b.width - a.width;
    if (wDiff) return wDiff;
    const areaDiff = (b.width * b.height) - (a.width * a.height);
    if (areaDiff) return areaDiff;
    return a.tileId - b.tileId;
  });
}

function resolvePackStrategy(value) {
  return ["auto", "height", "area", "tileid"].includes(value) ? value : "auto";
}

function resolveFilterModes(mode) {
  if (mode === "auto") return ["none", "adaptive"];
  return mode === "none" ? ["none"] : ["adaptive"];
}

function averageColor(indexes, palette) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < indexes.length; i += 1) {
    const color = palette[indexes[i]];
    const alpha = color[3];
    if (alpha < 16) continue;
    r += color[0];
    g += color[1];
    b += color[2];
    n += 1;
  }
  if (!n) return "#000000";
  return `#${hex(Math.round(r / n))}${hex(Math.round(g / n))}${hex(Math.round(b / n))}`;
}

function hitFlag(bitmapNo, hitRaw) {
  if ((bitmapNo >= 369715 && bitmapNo <= 369847) || bitmapNo === 369941) return 1;
  if (bitmapNo >= 369641 && bitmapNo <= 369654) return 1;
  return hitRaw % 100;
}

function hex(value) {
  return value.toString(16).padStart(2, "0");
}

function blitIndexed(src, srcW, srcH, dest, destW, dx, dy) {
  for (let y = 0; y < srcH; y += 1) {
    for (let x = 0; x < srcW; x += 1) {
      const si = y * srcW + x;
      const di = (dy + y) * destW + dx + x;
      dest[di] = src[si];
    }
  }
}

function indexedToRgba(indexes, palette) {
  const rgba = Buffer.alloc(indexes.length * 4);
  for (let i = 0; i < indexes.length; i += 1) {
    const color = palette[indexes[i]];
    const out = i * 4;
    rgba[out] = color[0];
    rgba[out + 1] = color[1];
    rgba[out + 2] = color[2];
    rgba[out + 3] = color[3];
  }
  return rgba;
}

function encodePng(width, height, rgba, filterMode = PNG_FILTER_MODE) {
  const mode = filterMode === "auto" ? "adaptive" : filterMode;
  const raw = buildFilteredRaw(rgba, width, height, 4, mode);
  const chunks = [
    chunk("IHDR", Buffer.concat([u32(width), u32(height), Buffer.from([8, 6, 0, 0, 0])])),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ];
  return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), ...chunks]);
}

function encodeIndexedPng(width, height, indexes, palette, filterMode = PNG_FILTER_MODE) {
  const mode = filterMode === "auto" ? "adaptive" : filterMode;
  const raw = buildFilteredRaw(indexes, width, height, 1, mode);
  const chunks = [
    chunk("IHDR", Buffer.concat([u32(width), u32(height), Buffer.from([8, 3, 0, 0, 0])])),
    chunk("PLTE", Buffer.from(palette.flatMap(([r, g, b]) => [r, g, b]))),
    chunk("tRNS", Buffer.from(palette.map(([, , , a]) => a))),
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

function parsePositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function buildFilteredRaw(pixels, width, height, bytesPerPixel, mode = "adaptive") {
  const rowBytes = width * bytesPerPixel;
  const raw = Buffer.alloc((rowBytes + 1) * height);
  const normalized = mode === "none" ? "none" : "adaptive";
  let prevRow = null;
  for (let y = 0; y < height; y += 1) {
    const src = pixels.subarray(y * rowBytes, (y + 1) * rowBytes);
    const outOffset = y * (rowBytes + 1);
    if (normalized === "none") {
      raw[outOffset] = 0;
      src.copy(raw, outOffset + 1);
      prevRow = src;
      continue;
    }

    const candidates = [
      { filter: 0, data: filterNone(src) },
      { filter: 1, data: filterSub(src, bytesPerPixel) },
      { filter: 2, data: filterUp(src, prevRow) },
      { filter: 3, data: filterAverage(src, prevRow, bytesPerPixel) },
      { filter: 4, data: filterPaeth(src, prevRow, bytesPerPixel) }
    ];
    let best = candidates[0];
    let bestScore = scoreFilteredRow(best.data);
    for (let i = 1; i < candidates.length; i += 1) {
      const candidate = candidates[i];
      const score = scoreFilteredRow(candidate.data);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    raw[outOffset] = best.filter;
    best.data.copy(raw, outOffset + 1);
    prevRow = src;
  }
  return raw;
}

function filterNone(src) {
  return Buffer.from(src);
}

function filterSub(src, bytesPerPixel) {
  const out = Buffer.alloc(src.length);
  for (let i = 0; i < src.length; i += 1) {
    const left = i >= bytesPerPixel ? src[i - bytesPerPixel] : 0;
    out[i] = (src[i] - left + 256) & 0xff;
  }
  return out;
}

function filterUp(src, prevRow) {
  const out = Buffer.alloc(src.length);
  for (let i = 0; i < src.length; i += 1) {
    const up = prevRow ? prevRow[i] : 0;
    out[i] = (src[i] - up + 256) & 0xff;
  }
  return out;
}

function filterAverage(src, prevRow, bytesPerPixel) {
  const out = Buffer.alloc(src.length);
  for (let i = 0; i < src.length; i += 1) {
    const left = i >= bytesPerPixel ? src[i - bytesPerPixel] : 0;
    const up = prevRow ? prevRow[i] : 0;
    out[i] = (src[i] - ((left + up) >> 1) + 256) & 0xff;
  }
  return out;
}

function filterPaeth(src, prevRow, bytesPerPixel) {
  const out = Buffer.alloc(src.length);
  for (let i = 0; i < src.length; i += 1) {
    const left = i >= bytesPerPixel ? src[i - bytesPerPixel] : 0;
    const up = prevRow ? prevRow[i] : 0;
    const upLeft = prevRow && i >= bytesPerPixel ? prevRow[i - bytesPerPixel] : 0;
    out[i] = (src[i] - paethPredictor(left, up, upLeft) + 256) & 0xff;
  }
  return out;
}

function paethPredictor(left, up, upLeft) {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) return left;
  if (pb <= pc) return up;
  return upLeft;
}

function scoreFilteredRow(data) {
  let score = 0;
  for (let i = 0; i < data.length; i += 1) {
    const value = data[i];
    score += value < 128 ? value : 256 - value;
  }
  return score;
}

main();
