import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const projectRoot = process.cwd();
const clientRoot = "/Users/adwasd/Downloads/CodeX-projects/公益石器时代";
const floor = String(process.argv[2] || "2000");
const outRoot = path.join(projectRoot, "public/debug/orientation", floor);
const mapPath = path.join(projectRoot, "public/data/maps", `${floor}.ls2map`);
const adrnPath = path.join(clientRoot, "data/adrn_136.bin");
const realPath = path.join(clientRoot, "data/real_136.bin");
const palettePath = path.join(clientRoot, "data/pal/Palet_1.sap");

const RECORD_SIZE = 80;
const COLOR_KEY = 0;
const HALF_W = 32;
const HALF_H = 24;

const transforms = {
  identity: (x, y, w, h) => [x, y],
  flipX: (x, y, w, h) => [w - 1 - x, y],
  flipY: (x, y, w, h) => [x, h - 1 - y],
  flipXY: (x, y, w, h) => [w - 1 - x, h - 1 - y],
  swap: (x, y, w, h) => [y, x],
  rot90cw: (x, y, w, h) => [y, w - 1 - x],
  rot90ccw: (x, y, w, h) => [h - 1 - y, x],
  antiSwap: (x, y, w, h) => [w - 1 - y, h - 1 - x]
};

const projections = {
  yMinusX: (x, y) => [(y - x) * HALF_W, (x + y) * HALF_H],
  xMinusY: (x, y) => [(x - y) * HALF_W, (x + y) * HALF_H],
  client: (x, y) => [(x + y) * HALF_W, (y - x) * HALF_H]
};

function main() {
  fs.mkdirSync(outRoot, { recursive: true });
  const map = readMap(mapPath);
  const palette = readPalette(palettePath);
  const records = readAdrnRecords(adrnPath);
  const realFd = fs.openSync(realPath, "r");
  const cache = new Map();
  const getImage = (tileId) => {
    if (!tileId || tileId <= 99) return null;
    if (cache.has(tileId)) return cache.get(tileId);
    const record = records.get(tileId);
    if (!record) return cache.set(tileId, null).get(tileId);
    const decoded = decodeRecord(realFd, record);
    if (!decoded) return cache.set(tileId, null).get(tileId);
    const image = { ...record, ...decoded, rgba: indexedImageToRgba(decoded, palette) };
    cache.set(tileId, image);
    return image;
  };

  try {
    const outputs = [];
    for (const [transformName, transform] of Object.entries(transforms)) {
      for (const [projectionName, project] of Object.entries(projections)) {
        const output = renderVariant(map, getImage, transform, project);
        const file = path.join(outRoot, `${transformName}-${projectionName}.png`);
        fs.writeFileSync(file, encodePng(output.width, output.height, output.rgba));
        outputs.push(path.relative(projectRoot, file));
      }
    }
    console.log(JSON.stringify({ floor, outputs, sprites: cache.size }, null, 2));
  } finally {
    fs.closeSync(realFd);
  }
}

function renderVariant(map, getImage, transform, project) {
  const bounds = measureBounds(map, getImage, transform, project);
  const width = Math.ceil(bounds.maxX - bounds.minX);
  const height = Math.ceil(bounds.maxY - bounds.minY);
  const canvas = { width, height, rgba: Buffer.alloc(width * height * 4) };
  const cells = [];
  const objects = [];
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const [tx, ty] = transform(x, y, map.width, map.height);
      const [screenX, screenY] = project(tx, ty);
      cells.push({ x, y, px: screenX - bounds.minX, py: screenY - bounds.minY, depth: tx + ty });
    }
  }
  cells.sort((a, b) => a.depth - b.depth || a.py - b.py || a.px - b.px);
  for (const cellPos of cells) {
    const cell = map.cells[cellPos.y * map.width + cellPos.x];
    blitImage(canvas, getImage(cell.tile), cellPos.px, cellPos.py);
    if (getImage(cell.parts)) objects.push({ tileId: cell.parts, x: cellPos.px, y: cellPos.py, depth: cellPos.depth });
  }
  objects.sort((a, b) => a.depth - b.depth || a.y - b.y || a.x - b.x);
  for (const object of objects) blitImage(canvas, getImage(object.tileId), object.x, object.y);
  return canvas;
}

function readMap(file) {
  const buf = fs.readFileSync(file);
  const width = buf.readUInt16BE(40);
  const height = buf.readUInt16BE(42);
  const cellCount = width * height;
  const layerSize = cellCount * 2;
  const expected = 44 + layerSize * 2;
  if (!width || !height || buf.length < expected || buf.toString("ascii", 0, 6) !== "LS2MAP") {
    throw new Error(`invalid LS2MAP data: ${file}`);
  }
  const cells = [];
  for (let i = 0; i < cellCount; i += 1) {
    cells.push({
      tile: buf.readUInt16BE(44 + i * 2),
      parts: buf.readUInt16BE(44 + layerSize + i * 2)
    });
  }
  return { width, height, cells };
}

function measureBounds(map, getImage, transform, project) {
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const cell = map.cells[y * map.width + x];
      const [tx, ty] = transform(x, y, map.width, map.height);
      const [px, py] = project(tx, ty);
      include(bounds, getImage(cell.tile), px, py);
      include(bounds, getImage(cell.parts), px, py);
    }
  }
  bounds.minX -= 8;
  bounds.minY -= 8;
  bounds.maxX += 8;
  bounds.maxY += 8;
  return bounds;
}

function include(bounds, image, x, y) {
  if (!image) return;
  const left = x + image.xoffset;
  const top = y + image.yoffset;
  bounds.minX = Math.min(bounds.minX, left);
  bounds.minY = Math.min(bounds.minY, top);
  bounds.maxX = Math.max(bounds.maxX, left + image.width);
  bounds.maxY = Math.max(bounds.maxY, top + image.height);
}

function blitImage(canvas, image, x, y) {
  if (!image) return;
  const dx = Math.round(x + image.xoffset);
  const dy = Math.round(y + image.yoffset);
  for (let sy = 0; sy < image.height; sy += 1) {
    const ty = dy + sy;
    if (ty < 0 || ty >= canvas.height) continue;
    for (let sx = 0; sx < image.width; sx += 1) {
      const tx = dx + sx;
      if (tx < 0 || tx >= canvas.width) continue;
      const si = (sy * image.width + sx) * 4;
      const alpha = image.rgba[si + 3];
      if (!alpha) continue;
      const di = (ty * canvas.width + tx) * 4;
      canvas.rgba[di] = image.rgba[si];
      canvas.rgba[di + 1] = image.rgba[si + 1];
      canvas.rgba[di + 2] = image.rgba[si + 2];
      canvas.rgba[di + 3] = 255;
    }
  }
}

function readAdrnRecords(file) {
  const data = fs.readFileSync(file);
  const records = new Map();
  for (let offset = 0; offset + RECORD_SIZE <= data.length; offset += RECORD_SIZE) {
    const bitmapNo = data.readUInt32LE(offset);
    const graphicNo = data.readUInt32LE(offset + 76);
    const adder = data.readUInt32LE(offset + 4);
    const size = data.readUInt32LE(offset + 8);
    const xoffset = data.readInt32LE(offset + 12);
    const yoffset = data.readInt32LE(offset + 16);
    const width = data.readUInt32LE(offset + 20);
    const height = data.readUInt32LE(offset + 24);
    if (bitmapNo && size && width && height) {
      const record = { bitmapNo, graphicNo, adder, size, xoffset, yoffset, width, height };
      if (graphicNo) records.set(graphicNo, record);
      else if (!records.has(bitmapNo)) records.set(bitmapNo, record);
    }
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
  const pixels = Buffer.alloc(width * height);
  if (compressFlag === 0) packed.copy(pixels, 0, 16, 16 + pixels.length);
  else if (compressFlag === 1) unpackRle(packed.subarray(16, size), pixels);
  else return null;
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
      if (idx & 0x20) count = ((idx & 0x0f) << 16) | (data[input++] << 8) | data[input++];
      else if (idx & 0x10) count = ((idx & 0x0f) << 8) | data[input++];
      else count = idx & 0x0f;
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

function indexedImageToRgba(image, palette) {
  const rgba = Buffer.alloc(image.width * image.height * 4);
  for (let i = 0; i < image.pixels.length; i += 1) {
    const color = palette[image.pixels[i]];
    const out = i * 4;
    rgba[out] = color[0];
    rgba[out + 1] = color[1];
    rgba[out + 2] = color[2];
    rgba[out + 3] = color[3];
  }
  return rgba;
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    chunk("IHDR", Buffer.concat([u32(width), u32(height), Buffer.from([8, 6, 0, 0, 0])])),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
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
