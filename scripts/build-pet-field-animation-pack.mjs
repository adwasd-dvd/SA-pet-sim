import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { encodeIndexedPng } from "./resource-tools/indexed-png-encoder.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");

const SPR_START = 100000;
const SPRADRN_RECORD_BYTES = 12;
const ADRN_RECORD_BYTES = 80;
const ANIM_HEADER_BYTES = 12;
const FRAME_BYTES = 10;
const COLOR_KEY = 0;
const PACK_WIDTH = 2048;

const ANIM = {
  STAND: 3,
  WALK: 4
};

const ACTION_BY_ID = {
  [ANIM.STAND]: "stand",
  [ANIM.WALK]: "walk"
};

const args = process.argv.slice(2);
const priorityOnly = args.includes("--priority-only");
const allInOne = args.includes("--all-in-one") || args.includes("--all");
const explicitSprites = (args.find((arg) => arg.startsWith("--sprites=")) || "")
  .split("=")
  .slice(1)
  .join("=")
  .split(",")
  .map((item) => Number(item.trim()))
  .filter((item) => Number.isFinite(item) && item >= SPR_START);
const DEFAULT_PRIORITY_SPRITE_NOS = [
  // Keep this first pack small: it fixes the visible starter/default classic pets
  // before broader per-map/per-family lazy packs are introduced.
  100250, // 乌力
  100251, // 乌力乌力
  100252, // 乌力斯坦
  100256, // 布伊
  100261, // 加比奥
  100296, // 凯比
  100370, // 猪雀
  100371, // 奥卡洛斯 starter pet
  100388  // 黑乌力
];

const paths = {
  report: path.join(appRoot, "docs/planning/pet-animation-coverage-report.json"),
  spr: path.join(appRoot, "external/sources/client-assets/data/spr_115.bin"),
  spradrn: path.join(appRoot, "external/sources/client-assets/data/spradrn_115.bin"),
  adrn: path.join(appRoot, "external/sources/client-assets/data/adrn_136.bin"),
  real: path.join(appRoot, "external/sources/client-assets/data/real_136.bin"),
  palette: path.join(appRoot, "external/sources/client-assets/data/pal/Palet_1.sap"),
  outDir: path.join(appRoot, "public/data/profiles/classic-core/packs"),
  animationManifest: path.join(appRoot, "public/data/profiles/classic-core/pet-field-animations.json"),
  buildReport: path.join(appRoot, "docs/planning/pet-field-animation-pack-report.json"),
  buildReportMd: path.join(appRoot, "docs/planning/PET_FIELD_ANIMATION_PACK_REPORT.md")
};

const generatedAt = new Date().toISOString();
const report = readJson(paths.report);
const reportSpriteNos = uniqueSorted((report.sprites || []).map((sprite) => sprite.sprNo));
const spriteNos = uniqueSorted(explicitSprites.length
  ? explicitSprites
  : priorityOnly
    ? DEFAULT_PRIORITY_SPRITE_NOS
    : [...reportSpriteNos, ...DEFAULT_PRIORITY_SPRITE_NOS]);
const prioritySpriteNoSet = new Set(DEFAULT_PRIORITY_SPRITE_NOS);
const spriteNames = new Map((report.sprites || []).map((sprite) => [Number(sprite.sprNo), sprite.names || []]));
if (!spriteNames.has(100371)) spriteNames.set(100371, ["奥卡洛斯"]);
const sprIndex = parseSpradrn(paths.spradrn);
const adrn = parseAdrn(paths.adrn);
const spr = fs.readFileSync(paths.spr);
const palette = readPalette(paths.palette);
const priorityBitmapNos = new Set();
const allBitmapNos = new Set();
const bitmapNosBySprite = new Map();
const sprites = {};

for (const sprNo of spriteNos) {
  const parsed = parseFieldAnimations(sprNo, spr, sprIndex.get(sprNo), adrn.records);
  if (!parsed) continue;
  sprites[sprNo] = {
    names: spriteNames.get(sprNo) || [],
    actions: parsed.actions
  };
  bitmapNosBySprite.set(sprNo, parsed.bitmapNos);
  for (const bitmapNo of parsed.bitmapNos) {
    allBitmapNos.add(bitmapNo);
    if (prioritySpriteNoSet.has(sprNo)) priorityBitmapNos.add(bitmapNo);
  }
}

fs.mkdirSync(paths.outDir, { recursive: true });
const packOutputs = [];
if (allInOne) {
  const output = writePack("pet-field-core-all", [...allBitmapNos]);
  packOutputs.push(output);
  for (const sprNo of Object.keys(sprites)) sprites[sprNo].pack = `packs/${output.id}.json`;
} else {
  const prioritySprites = Object.keys(sprites)
    .map(Number)
    .filter((sprNo) => prioritySpriteNoSet.has(sprNo));
  if (prioritySprites.length) {
    const output = writePack("pet-field-priority", [...priorityBitmapNos]);
    output.spriteNos = prioritySprites;
    packOutputs.push(output);
    for (const sprNo of prioritySprites) {
      sprites[sprNo].pack = `packs/${output.id}.json`;
      sprites[sprNo].priority = true;
    }
  }
  if (!priorityOnly) {
    for (const sprNo of Object.keys(sprites).map(Number).sort((a, b) => a - b)) {
      if (prioritySpriteNoSet.has(sprNo)) continue;
      const output = writePack(`pet-field-spr-${sprNo}`, bitmapNosBySprite.get(sprNo) || []);
      output.spriteNos = [sprNo];
      packOutputs.push(output);
      sprites[sprNo].pack = `packs/${output.id}.json`;
    }
  }
}

const primaryPack = packOutputs[0] || null;

const animationManifest = {
  v: 1,
  generatedAt,
  profile: "classic-core",
  source: {
    spr: "external/sources/client-assets/data/spr_115.bin",
    spradrn: "external/sources/client-assets/data/spradrn_115.bin",
    adrn: "external/sources/client-assets/data/adrn_136.bin",
    real: "external/sources/client-assets/data/real_136.bin"
  },
  pack: {
    id: primaryPack?.id || "",
    domain: "pet-field-animation",
    manifest: primaryPack ? `packs/${primaryPack.id}.json` : "",
    image: primaryPack ? `packs/${primaryPack.id}.png` : "",
    frames: primaryPack?.frames || 0,
    pngBytes: primaryPack?.pngBytes || 0,
    manifestBytes: primaryPack?.manifestBytes || 0,
    manifestGzipBytes: primaryPack?.manifestGzipBytes || 0
  },
  packs: packOutputs.map((pack) => ({
    id: pack.id,
    domain: "pet-field-animation",
    manifest: `packs/${pack.id}.json`,
    image: `packs/${pack.id}.png`,
    spriteNos: pack.spriteNos || [],
    frames: pack.frames,
    pngBytes: pack.pngBytes,
    manifestBytes: pack.manifestBytes,
    manifestGzipBytes: pack.manifestGzipBytes
  })),
  fields: {
    animation: ["dtAnim", "frameMs", "frames"],
    frame: ["bitmapNo", "posX", "posY", "soundNo"]
  },
  summary: {
    spriteNos: Object.keys(sprites).length,
    sourceReportSpriteNos: reportSpriteNos.length,
    mode: allInOne ? "all-classic-core-single-pack" : priorityOnly ? "priority" : explicitSprites.length ? "explicit-split" : "split-by-sprite",
    packs: packOutputs.length,
    totalPackPngBytes: packOutputs.reduce((sum, pack) => sum + pack.pngBytes, 0),
    uniqueBitmaps: allBitmapNos.size,
    primaryPackWidth: primaryPack?.width || 0,
    primaryPackHeight: primaryPack?.height || 0,
    primaryPackArea: primaryPack ? primaryPack.width * primaryPack.height : 0,
    primaryFillRatio: primaryPack?.fillRatio || 0,
    missingSpriteIndex: spriteNos.filter((sprNo) => !sprIndex.has(sprNo)),
    missingAdrnRecords: uniqueSorted([...allBitmapNos].filter((bitmapNo) => !adrn.records.has(bitmapNo)))
  },
  sprites
};

fs.writeFileSync(paths.animationManifest, `${JSON.stringify(animationManifest)}\n`);

const buildReport = {
  v: 1,
  generatedAt,
  sourceReport: "docs/planning/pet-animation-coverage-report.json",
  output: {
    animationManifest: path.relative(appRoot, paths.animationManifest),
    primaryPackManifest: primaryPack ? path.relative(appRoot, primaryPack.manifestPath) : "",
    primaryPackImage: primaryPack ? path.relative(appRoot, primaryPack.pngPath) : "",
    buildReport: path.relative(appRoot, paths.buildReport)
  },
  summary: animationManifest.summary,
  packs: packOutputs.map((pack) => ({
    id: pack.id,
    spriteNos: pack.spriteNos || [],
    frames: pack.frames,
    width: pack.width,
    height: pack.height,
    fillRatio: pack.fillRatio,
    pngBytes: pack.pngBytes,
    manifestGzipBytes: pack.manifestGzipBytes
  })),
  importantSprites: [100250, 100251, 100252, 100371, 100388]
    .map((sprNo) => ({
      sprNo,
      names: sprites[sprNo]?.names || [],
      standDirs: Object.keys(sprites[sprNo]?.actions?.stand || {}).length,
      walkDirs: Object.keys(sprites[sprNo]?.actions?.walk || {}).length,
      firstStand: firstFrameId(sprites[sprNo]?.actions?.stand)
    }))
    .filter((item) => item.standDirs || item.walkDirs)
};

fs.writeFileSync(paths.buildReport, `${JSON.stringify(buildReport, null, 2)}\n`);
fs.writeFileSync(paths.buildReportMd, renderMarkdown(buildReport));

console.log(`Wrote ${path.relative(appRoot, paths.animationManifest)}`);
for (const pack of packOutputs.slice(0, 12)) {
  console.log(`Wrote ${path.relative(appRoot, pack.manifestPath)}`);
  console.log(`Wrote ${path.relative(appRoot, pack.pngPath)} (${formatBytes(pack.pngBytes)})`);
}
if (packOutputs.length > 12) console.log(`Wrote ${packOutputs.length - 12} additional pet field sprite packs.`);
console.log(`Wrote ${path.relative(appRoot, paths.buildReport)}`);
console.log(`Wrote ${path.relative(appRoot, paths.buildReportMd)}`);

function writePack(packId, bitmapNos) {
  const entries = extractBitmapEntries(bitmapNos, adrn.records, paths.real);
  if (!entries.length) throw new Error(`Pack ${packId} has no source bitmap entries`);
  const packed = buildPack(entries, palette);
  const pngPath = path.join(paths.outDir, `${packId}.png`);
  const manifestPath = path.join(paths.outDir, `${packId}.json`);
  const packManifest = compactFrameManifest({
    image: `${packId}.png`,
    atlasWidth: packed.width,
    atlasHeight: packed.height,
    frames: packed.frames
  });
  const packManifestText = `${JSON.stringify(packManifest)}\n`;
  fs.writeFileSync(pngPath, packed.png);
  fs.writeFileSync(manifestPath, packManifestText);
  const frameArea = entries.reduce((sum, item) => sum + item.width * item.height, 0);
  return {
    id: packId,
    manifestPath,
    pngPath,
    frames: entries.length,
    width: packed.width,
    height: packed.height,
    fillRatio: ratio(frameArea, packed.width * packed.height),
    pngBytes: packed.png.length,
    manifestBytes: Buffer.byteLength(packManifestText),
    manifestGzipBytes: zlib.gzipSync(Buffer.from(packManifestText), { level: 9 }).length
  };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function parseSpradrn(file) {
  const buf = fs.readFileSync(file);
  const records = new Map();
  for (let offset = 0; offset + SPRADRN_RECORD_BYTES <= buf.length; offset += SPRADRN_RECORD_BYTES) {
    const sprNo = buf.readUInt32LE(offset);
    const sprOffset = buf.readUInt32LE(offset + 4);
    const animSize = buf.readUInt16LE(offset + 8);
    if (sprNo >= SPR_START && animSize > 0) records.set(sprNo, { sprNo, offset: sprOffset, animSize });
  }
  return records;
}

function parseAdrn(file) {
  const buf = fs.readFileSync(file);
  const records = new Map();
  for (let offset = 0; offset + ADRN_RECORD_BYTES <= buf.length; offset += ADRN_RECORD_BYTES) {
    const bitmapNo = buf.readUInt32LE(offset);
    const adder = buf.readUInt32LE(offset + 4);
    const size = buf.readUInt32LE(offset + 8);
    const width = buf.readUInt32LE(offset + 20);
    const height = buf.readUInt32LE(offset + 24);
    if (!bitmapNo || !size || !width || !height) continue;
    records.set(bitmapNo, {
      bitmapNo,
      graphicNo: buf.readUInt32LE(offset + 76),
      adder,
      size,
      width,
      height,
      xoffset: buf.readInt32LE(offset + 12),
      yoffset: buf.readInt32LE(offset + 16),
      hitRaw: buf.readUInt16LE(offset + 30),
      prioType: Math.trunc(buf.readUInt16LE(offset + 30) / 100)
    });
  }
  return { records };
}

function parseFieldAnimations(sprNo, spr, index, adrnRecords) {
  if (!index) return null;
  let offset = index.offset;
  const actions = {};
  const bitmapNos = new Set();
  for (let i = 0; i < index.animSize; i += 1) {
    if (offset + ANIM_HEADER_BYTES > spr.length) break;
    const dir = spr.readUInt16LE(offset);
    const action = spr.readUInt16LE(offset + 2);
    const dtAnim = spr.readUInt32LE(offset + 4);
    const frameCnt = spr.readUInt32LE(offset + 8);
    const actionName = ACTION_BY_ID[action];
    offset += ANIM_HEADER_BYTES;
    const frames = [];
    for (let frameIndex = 0; frameIndex < frameCnt; frameIndex += 1) {
      if (offset + FRAME_BYTES > spr.length) break;
      const bitmapNo = spr.readUInt32LE(offset);
      const posX = spr.readInt16LE(offset + 4);
      const posY = spr.readInt16LE(offset + 6);
      const soundNo = spr.readUInt16LE(offset + 8);
      offset += FRAME_BYTES;
      if (!actionName || !adrnRecords.has(bitmapNo)) continue;
      frames.push([bitmapNo, posX, posY, soundNo]);
      bitmapNos.add(bitmapNo);
    }
    if (!actionName || !frames.length) continue;
    if (!actions[actionName]) actions[actionName] = {};
    actions[actionName][dir] = [
      dtAnim,
      Math.max(50, Math.round(dtAnim / Math.max(1, frames.length))),
      frames
    ];
  }
  return { sprNo, actions, bitmapNos: [...bitmapNos] };
}

function extractBitmapEntries(bitmapNos, adrnRecords, realPath) {
  const fd = fs.openSync(realPath, "r");
  const entries = [];
  try {
    for (const bitmapNo of uniqueSorted(bitmapNos)) {
      const record = adrnRecords.get(bitmapNo);
      if (!record) continue;
      const decoded = decodeRecord(fd, record);
      if (!decoded) continue;
      entries.push({
        id: bitmapNo,
        tileId: bitmapNo,
        pixels: decoded.pixels,
        width: decoded.width,
        height: decoded.height,
        bitmapNo,
        graphicNo: record.graphicNo,
        xoffset: record.xoffset,
        yoffset: record.yoffset,
        hit: hitFlag(bitmapNo, record.hitRaw),
        prioType: record.prioType
      });
    }
  } finally {
    fs.closeSync(fd);
  }
  return entries;
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

function buildPack(entries, palette) {
  const frames = entries.slice().sort(byHeight);
  const width = Math.max(PACK_WIDTH, ...frames.map((frame) => frame.width));
  const placements = rowPack(frames, width);
  const indexes = Buffer.alloc(width * placements.height);
  indexes.fill(COLOR_KEY);
  const manifestFrames = [];
  for (const placement of placements.frames) {
    blitIndexed(placement.frame.pixels, placement.frame.width, placement.frame.height, indexes, width, placement.x, placement.y);
    manifestFrames.push({
      ...placement.frame,
      x: placement.x,
      y: placement.y
    });
  }
  return {
    width,
    height: placements.height,
    frames: manifestFrames,
    png: encodeIndexedPng(width, placements.height, indexes, palette, { compressionLevel: 9 })
  };
}

function rowPack(frames, width) {
  let x = 0;
  let y = 0;
  let rowH = 0;
  const placements = [];
  for (const frame of frames) {
    if (x > 0 && x + frame.width > width) {
      x = 0;
      y += rowH;
      rowH = 0;
    }
    placements.push({ frame, x, y });
    x += frame.width;
    rowH = Math.max(rowH, frame.height);
  }
  return { frames: placements, height: Math.max(1, y + rowH) };
}

function compactFrameManifest({ image, atlasWidth, atlasHeight, frames }) {
  return {
    v: 1,
    image,
    w: atlasWidth,
    h: atlasHeight,
    fields: ["id", "x", "y", "w", "h", "xo", "yo", "hit", "prio", "bitmap", "graphic"],
    frames: frames.map((frame) => [
      frame.id,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      frame.xoffset,
      frame.yoffset,
      frame.hit,
      frame.prioType,
      frame.bitmapNo,
      frame.graphicNo
    ])
  };
}

function blitIndexed(src, srcW, srcH, dest, destW, dx, dy) {
  for (let y = 0; y < srcH; y += 1) {
    const sourceStart = y * srcW;
    const targetStart = (dy + y) * destW + dx;
    src.copy(dest, targetStart, sourceStart, sourceStart + srcW);
  }
}

function byHeight(a, b) {
  return b.height - a.height || b.width - a.width || a.id - b.id;
}

function uniqueSorted(values) {
  return [...new Set((values || [])
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0))]
    .sort((a, b) => a - b);
}

function ratio(value, total) {
  return total ? Number((value / total).toFixed(4)) : 0;
}

function hitFlag(bitmapNo, hitRaw) {
  if ((bitmapNo >= 369715 && bitmapNo <= 369847) || bitmapNo === 369941) return 1;
  if (bitmapNo >= 369641 && bitmapNo <= 369654) return 1;
  return hitRaw % 100;
}

function firstFrameId(action) {
  const dirs = Object.keys(action || {}).sort((a, b) => Number(a) - Number(b));
  const first = action?.[dirs[0]]?.[2]?.[0]?.[0];
  return Number(first || 0);
}

function renderMarkdown(data) {
  const lines = [];
  lines.push("# Pet Field Animation Pack Report");
  lines.push("");
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Mode: ${data.summary.mode}`);
  lines.push(`- Sprite numbers: ${data.summary.spriteNos}`);
  lines.push(`- Source report sprite numbers: ${data.summary.sourceReportSpriteNos}`);
  lines.push(`- Pack count: ${data.summary.packs}`);
  lines.push(`- Unique field bitmap frames: ${data.summary.uniqueBitmaps}`);
  lines.push(`- Primary pack size: ${data.summary.primaryPackWidth}x${data.summary.primaryPackHeight}`);
  lines.push(`- Primary fill ratio: ${data.summary.primaryFillRatio}`);
  lines.push(`- Total pack PNG bytes: ${formatBytes(data.summary.totalPackPngBytes || 0)}`);
  lines.push(`- Missing sprite indexes: ${data.summary.missingSpriteIndex.length}`);
  lines.push(`- Missing ADRN records: ${data.summary.missingAdrnRecords.length}`);
  lines.push("");
  lines.push("## Outputs");
  lines.push("");
  lines.push(`- Animation manifest: \`${data.output.animationManifest}\``);
  lines.push(`- Primary pack manifest: \`${data.output.primaryPackManifest}\``);
  lines.push(`- Primary pack image: \`${data.output.primaryPackImage}\``);
  lines.push("");
  lines.push("## Largest Packs");
  lines.push("");
  lines.push("| Pack | Sprites | Frames | PNG | Fill |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  for (const pack of (data.packs || []).slice().sort((a, b) => b.pngBytes - a.pngBytes).slice(0, 10)) {
    lines.push(`| ${pack.id} | ${(pack.spriteNos || []).join(", ") || "-"} | ${pack.frames} | ${formatBytes(pack.pngBytes)} | ${pack.fillRatio} |`);
  }
  lines.push("");
  lines.push("## Important Sprites");
  lines.push("");
  lines.push("| SprNo | Names | Stand Dirs | Walk Dirs | First Stand Frame |");
  lines.push("| ---: | --- | ---: | ---: | ---: |");
  for (const sprite of data.importantSprites) {
    lines.push(`| ${sprite.sprNo} | ${(sprite.names || []).join(", ") || "-"} | ${sprite.standDirs} | ${sprite.walkDirs} | ${sprite.firstStand || "-"} |`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function formatBytes(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${bytes} B`;
}
