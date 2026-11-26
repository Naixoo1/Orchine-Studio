import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public', 'textures');
fs.mkdirSync(OUT_DIR, { recursive: true });

const WIDTH = 1024;
const HEIGHT = 1536;
const FRINGE_START_Y = 1416;

async function buildWeaveNormalMap() {
  const size = 512;
  const channels = 3;
  const buf = Buffer.alloc(size * size * channels);
  const period = 16;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * channels;
      const cellX = Math.floor(x / period);
      const cellY = Math.floor(y / period);
      const u = (x % period) / period;
      const v = (y % period) / period;
      const warpOnTop = (cellX + cellY) % 2 === 0;

      let dx = 0;
      let dy = 0;
      if (warpOnTop) {
        const tx = (u - 0.5) * 2;
        const edgeMask = Math.abs(tx) < 0.78 ? 1 : 0.2;
        dx = -tx * edgeMask * 0.5;
        dy = Math.sin(v * Math.PI) * 0.08 * Math.cos(v * Math.PI);
      } else {
        const ty = (v - 0.5) * 2;
        const edgeMask = Math.abs(ty) < 0.78 ? 1 : 0.2;
        dy = -ty * edgeMask * 0.5;
        dx = Math.sin(u * Math.PI) * 0.08 * Math.cos(u * Math.PI);
      }

      const slub = Math.sin(x * 0.37 + y * 0.13) * 0.04;
      dx += slub;

      buf[idx] = Math.max(0, Math.min(255, Math.round((dx * 0.5 + 0.5) * 255)));
      buf[idx + 1] = Math.max(0, Math.min(255, Math.round((dy * 0.5 + 0.5) * 255)));
      buf[idx + 2] = 242;
    }
  }

  await sharp(buf, { raw: { width: size, height: size, channels } })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_DIR, 'weave-normal.webp'));
}

async function buildAlphaMap() {
  const buf = Buffer.alloc(WIDTH * HEIGHT * 3, 255);

  for (let y = FRINGE_START_Y; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 3;
      buf[idx] = 0;
      buf[idx + 1] = 0;
      buf[idx + 2] = 0;
    }
  }

  for (let x = 0; x < WIDTH; x++) {
    const hemY = FRINGE_START_Y + Math.round(Math.sin(x * 0.04) * 2 + Math.cos(x * 0.11) * 1.5);
    for (let y = Math.max(0, hemY - 3); y < Math.min(HEIGHT, hemY + 2); y++) {
      const idx = (y * WIDTH + x) * 3;
      const val = y <= hemY ? 255 : 0;
      buf[idx] = val;
      buf[idx + 1] = val;
      buf[idx + 2] = val;
    }
  }

  const tasselCount = 30;
  const margin = 22;
  const spacing = (WIDTH - margin * 2) / (tasselCount - 1);

  for (let t = 0; t < tasselCount; t++) {
    const cx = margin + t * spacing + Math.sin(t * 2.1) * 2;
    const strandLen = 96 + Math.round(Math.sin(t * 1.7) * 10);
    for (let dy = 0; dy < strandLen; dy++) {
      const y = FRINGE_START_Y + dy;
      if (y >= HEIGHT) break;
      const sway = Math.sin(dy * 0.07 + t * 1.3) * (dy * 0.045);
      let halfW = 3.6 + Math.sin(dy * 0.65) * 0.9;
      if (dy >= 10 && dy <= 22) halfW = 5.4;
      if (dy > strandLen - 24) halfW = 5.8 - ((dy - (strandLen - 24)) / 24) * 3.0;

      const xMin = Math.max(0, Math.floor(cx + sway - halfW));
      const xMax = Math.min(WIDTH - 1, Math.ceil(cx + sway + halfW));
      for (let x = xMin; x <= xMax; x++) {
        const dist = Math.abs(x - (cx + sway)) / halfW;
        const val = dist <= 0.72 ? 255 : Math.max(0, Math.round((1 - (dist - 0.72) / 0.28) * 255));
        const idx = (y * WIDTH + x) * 3;
        if (val > buf[idx]) {
          buf[idx] = val;
          buf[idx + 1] = val;
          buf[idx + 2] = val;
        }
      }
    }
  }

  await sharp(buf, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'scarf-alpha.webp'));
}

/**
 * Generates an even, fold-free 1024x1536 open-weave cream cotton/silk fabric canvas
 * with organic warp/weft thread grain matching florave-2 & sylvea-3 cloth tone (#ECE8DC).
 */
async function createUniformWovenBaseBuffer() {
  const buf = Buffer.alloc(WIDTH * HEIGHT * 3);
  const pitch = 6; // crisp fine open-weave mesh at 1024px scale

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 3;
      const u = (x % pitch) / pitch;
      const v = (y % pitch) / pitch;

      // Fine slub & thread luminance variation
      const threadX = Math.sin(u * Math.PI);
      const threadY = Math.sin(v * Math.PI);
      const pore = Math.max(threadX, threadY); // darker pinholes between warp & weft
      const grain =
        Math.sin(x * 0.017 + y * 0.011) * 3 +
        Math.cos(x * 0.23 - y * 0.19) * 2.5 +
        Math.sin((x + y) * 0.005) * 3;

      const lumaOffset = (pore - 0.65) * 26 + grain;
      buf[idx] = Math.max(195, Math.min(250, Math.round(235 + lumaOffset)));
      buf[idx + 1] = Math.max(190, Math.min(246, Math.round(231 + lumaOffset)));
      buf[idx + 2] = Math.max(180, Math.min(238, Math.round(220 + lumaOffset)));
    }
  }

  return sharp(buf, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
    .webp({ quality: 92 })
    .toBuffer();
}

/**
 * Extracts a botanical eco-print crop, levels cream cloth to pure white (255),
 * and gently suppresses neutral low-saturation fold shadows while keeping botanical dye pigments crisp.
 */
async function prepareMotifPatch(sourceFile, extractRect, outW, outH, rotateDeg = 0, flop = false) {
  let pipe = sharp(sourceFile)
    .extract(extractRect)
    .resize(outW, outH, { fit: 'fill' });

  if (rotateDeg !== 0) {
    pipe = pipe.rotate(rotateDeg, { background: { r: 255, g: 255, b: 255 } });
  }
  if (flop) {
    pipe = pipe.flop();
  }

  const { data, info } = await pipe
    .modulate({ saturation: 1.18, brightness: 1.06 })
    .linear(1.32, -48)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const cx = w / 2;
  const cy = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const chroma = maxC - minC;

      // Elliptical edge fade to pure white so multiply leaves zero rectangular seam
      const nx = (x - cx) / (cx * 0.88);
      const ny = (y - cy) / (cy * 0.88);
      const d = Math.sqrt(nx * nx + ny * ny);
      const edgeFade = d <= 0.55 ? 1 : Math.max(0, 1 - (d - 0.55) / 0.45);

      // Push neutral & warm-cream cloth fold shadows (chroma < 36) cleanly to white (255) so ONLY botanical pigments stain the woven base
      const luma = (r + g + b) / 3;
      const graySuppression = chroma >= 36 ? 1.0 : Math.pow(Math.max(0, chroma) / 36, 2.2);
      const highlightFade = luma > 185 ? Math.max(0, 1 - (luma - 185) / 45) : 1.0;

      const factor = edgeFade * graySuppression * highlightFade;
      data[idx] = Math.round(255 - (255 - r) * factor);
      data[idx + 1] = Math.round(255 - (255 - g) * factor);
      data[idx + 2] = Math.round(255 - (255 - b) * factor);
      data[idx + 3] = 255;
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function addYarnBottom(colorBuffer) {
  const yarnStrip = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT - FRINGE_START_Y,
      channels: 3,
      background: { r: 235, g: 231, b: 221 },
    },
  })
    .png()
    .toBuffer();

  return sharp(colorBuffer)
    .composite([{ input: yarnStrip, left: 0, top: FRINGE_START_Y }])
    .webp({ quality: 88 })
    .toBuffer();
}

async function buildFlorave() {
  // Tight clean crop from florave-2.jpeg above bottom fringes/pavers
  const cloth = await sharp('public/scarves/florave-2.jpeg')
    .extract({ left: 240, top: 40, width: 2520, height: 3260 })
    .resize(WIDTH, FRINGE_START_Y, { fit: 'cover' })
    .modulate({ brightness: 1.05, saturation: 1.06 })
    .toBuffer();

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: { r: 235, g: 231, b: 221 } },
  })
    .composite([{ input: cloth, left: 0, top: 0 }])
    .webp({ quality: 88 })
    .toFile(path.join(OUT_DIR, 'florave.webp'));
  console.log('Built florave.webp');
}

async function buildSylvea() {
  // Tight clean crop from sylvea-3.jpeg above bottom fringes/pavers and right of left greenery
  const cloth = await sharp('public/scarves/sylvea-3.jpeg')
    .extract({ left: 290, top: 20, width: 2710, height: 3420 })
    .resize(WIDTH, FRINGE_START_Y, { fit: 'cover' })
    .modulate({ brightness: 1.06, saturation: 1.05 })
    .toBuffer();

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: { r: 235, g: 231, b: 221 } },
  })
    .composite([{ input: cloth, left: 0, top: 0 }])
    .webp({ quality: 88 })
    .toFile(path.join(OUT_DIR, 'sylvea.webp'));
  console.log('Built sylvea.webp');
}

async function buildFlorielle(baseBuffer) {
  // Pure clean eco-print regions from florielle-1/2/3 (zero wearer skin/hair/pavers)
  const patches = [
    // Coral, periwinkle-violet & sage leaves (florielle-1 bottom-right cloth sweep)
    { file: 'public/scarves/florielle-1.jpeg', rect: { left: 1950, top: 2450, width: 920, height: 920 }, w: 390, h: 390, x: 540, y: 120, rot: -10, flop: false },
    // Pink/coral flowers + light green leaf (florielle-1 lower-right)
    { file: 'public/scarves/florielle-1.jpeg', rect: { left: 2150, top: 1900, width: 780, height: 780 }, w: 330, h: 330, x: 100, y: 210, rot: 16, flop: true },
    // Sage leaves & coral/lilac buds (florielle-2 lower-center shoulder wrap)
    { file: 'public/scarves/florielle-2.jpeg', rect: { left: 1580, top: 1580, width: 700, height: 700 }, w: 330, h: 330, x: 340, y: 470, rot: -14, flop: false },
    // Bright sage-green palmate leaves (florielle-2 right edge)
    { file: 'public/scarves/florielle-2.jpeg', rect: { left: 2180, top: 1080, width: 640, height: 700 }, w: 300, h: 320, x: 660, y: 540, rot: 12, flop: false },
    // Delicate green fern frond & peach flowers (florielle-3 bottom cloth sweep)
    { file: 'public/scarves/florielle-3.jpeg', rect: { left: 1280, top: 2100, width: 650, height: 680 }, w: 320, h: 330, x: 70, y: 690, rot: -8, flop: false },
    // Coral + purple small flowers & green leaf (florielle-3 right side)
    { file: 'public/scarves/florielle-3.jpeg', rect: { left: 2150, top: 1850, width: 680, height: 680 }, w: 320, h: 320, x: 430, y: 830, rot: 15, flop: true },
    // Pastel coral + butter-yellow buds (florielle-2 left back)
    { file: 'public/scarves/florielle-2.jpeg', rect: { left: 680, top: 1920, width: 650, height: 680 }, w: 300, h: 310, x: 110, y: 1040, rot: 8, flop: false },
    // Golden-tan & light sage leaf (florielle-1 center)
    { file: 'public/scarves/florielle-1.jpeg', rect: { left: 880, top: 1380, width: 620, height: 520 }, w: 280, h: 240, x: 640, y: 1060, rot: -20, flop: false },
    // Top-left gentle floral buds (florielle-3 middle cloth)
    { file: 'public/scarves/florielle-3.jpeg', rect: { left: 1620, top: 1280, width: 520, height: 520 }, w: 250, h: 250, x: 130, y: 40, rot: -15, flop: false },
  ];

  const composites = [];
  for (const p of patches) {
    const buf = await prepareMotifPatch(p.file, p.rect, p.w, p.h, p.rot, p.flop);
    composites.push({ input: buf, left: p.x, top: p.y, blend: 'multiply' });
  }

  const combined = await sharp(baseBuffer).composite(composites).toBuffer();
  const finalBuf = await addYarnBottom(combined);
  await sharp(finalBuf).toFile(path.join(OUT_DIR, 'florielle.webp'));
  console.log('Built florielle.webp');
}

async function buildNaturea(baseBuffer) {
  // Pure clean plum, burgundy, rosewood & ochre leaf regions from naturea-1/2/3 (zero hair/background)
  const patches = [
    // Deep plum/burgundy leaves (naturea-3 top-left cloth)
    { file: 'public/scarves/naturea-3.jpeg', rect: { left: 80, top: 480, width: 720, height: 520 }, w: 360, h: 270, x: 60, y: 70, rot: 8, flop: false },
    // Olive-ochre & burgundy print (naturea-3 lower-left cloth)
    { file: 'public/scarves/naturea-3.jpeg', rect: { left: 0, top: 1450, width: 500, height: 760 }, w: 260, h: 360, x: 660, y: 120, rot: -14, flop: true },
    // Rosewood & plum scattered leaves (naturea-2 mid-lower cloth below neck/hair)
    { file: 'public/scarves/naturea-2.jpeg', rect: { left: 720, top: 1700, width: 960, height: 900 }, w: 390, h: 360, x: 310, y: 310, rot: 6, flop: false },
    // Terracotta & ochre leaves (naturea-1 lower cloth sweep)
    { file: 'public/scarves/naturea-1.jpeg', rect: { left: 1380, top: 2750, width: 920, height: 920 }, w: 380, h: 380, x: 560, y: 630, rot: -12, flop: false },
    // Mauve & burgundy petals (naturea-1 left sleeve cloth)
    { file: 'public/scarves/naturea-1.jpeg', rect: { left: 450, top: 1580, width: 650, height: 700 }, w: 310, h: 330, x: 70, y: 540, rot: 16, flop: false },
    // Dark plum leaves (naturea-3 center-right cloth)
    { file: 'public/scarves/naturea-3.jpeg', rect: { left: 2100, top: 1750, width: 740, height: 860 }, w: 310, h: 350, x: 300, y: 780, rot: -8, flop: true },
    // Burgundy & mauve lower cloth (naturea-2 bottom wrap)
    { file: 'public/scarves/naturea-2.jpeg', rect: { left: 680, top: 2450, width: 880, height: 880 }, w: 360, h: 360, x: 80, y: 1010, rot: 12, flop: false },
    // Warm earth ochre & burgundy upper-right (naturea-3)
    { file: 'public/scarves/naturea-3.jpeg', rect: { left: 2150, top: 680, width: 640, height: 720 }, w: 280, h: 310, x: 640, y: 1030, rot: 20, flop: false },
  ];

  const composites = [];
  for (const p of patches) {
    const buf = await prepareMotifPatch(p.file, p.rect, p.w, p.h, p.rot, p.flop);
    composites.push({ input: buf, left: p.x, top: p.y, blend: 'multiply' });
  }

  const combined = await sharp(baseBuffer).composite(composites).toBuffer();
  const finalBuf = await addYarnBottom(combined);
  await sharp(finalBuf).toFile(path.join(OUT_DIR, 'naturea.webp'));
  console.log('Built naturea.webp');
}

async function main() {
  await buildWeaveNormalMap();
  await buildAlphaMap();
  const baseBuffer = await createUniformWovenBaseBuffer();
  await Promise.all([
    buildFlorave(),
    buildSylvea(),
    buildFlorielle(baseBuffer),
    buildNaturea(baseBuffer),
  ]);
  console.log('All scarf textures regenerated cleanly!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
