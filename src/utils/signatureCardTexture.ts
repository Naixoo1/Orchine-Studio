import * as THREE from 'three';

const CARD_TEX_WIDTH = 2048;
const CARD_TEX_HEIGHT = 1377; // Exact 5403 / 3634 aspect ratio

let cachedBlankFrontCanvas: HTMLCanvasElement | null = null;
let blankCanvasPromise: Promise<HTMLCanvasElement> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Smooth quadratic petal edge X coordinate in normalized [0..1] space
 * matching the right contour of the foreground pink petal in reference/front_sc.png.
 */
function normalizedPetalEdgeX(ny: number): number {
  const yOrig = ny * 3634;
  const t = (yOrig - 3050) / 530;
  const xOrig = 5163 - 335 * t - 110 * t * t;
  return xOrig / 5403;
}

/**
 * Loads /passport/eco-passport-front.png and removes the static "#351517" text
 * in the bottom-right corner so any generated 4-digit serial (#0000+) can be rendered cleanly.
 */
async function getBlankFrontCanvas(): Promise<HTMLCanvasElement> {
  if (cachedBlankFrontCanvas) return cachedBlankFrontCanvas;
  if (blankCanvasPromise) return blankCanvasPromise;

  blankCanvasPromise = (async () => {
    const img = await loadImage('/passport/eco-passport-front.png');
    const canvas = document.createElement('canvas');
    canvas.width = CARD_TEX_WIDTH;
    canvas.height = CARD_TEX_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.drawImage(img, 0, 0, CARD_TEX_WIDTH, CARD_TEX_HEIGHT);

    // Patch region around static "#351517" (normalized x: 0.720..0.990, y: 0.860..0.962)
    const patchX0 = Math.floor(CARD_TEX_WIDTH * 0.72);
    const patchX1 = Math.ceil(CARD_TEX_WIDTH * 0.99);
    const patchY0 = Math.floor(CARD_TEX_HEIGHT * 0.86);
    const patchY1 = Math.ceil(CARD_TEX_HEIGHT * 0.962);
    const patchW = patchX1 - patchX0;
    const patchH = patchY1 - patchY0;

    // 1. Restore stippled pink petal on the left side of the petal contour
    // Sample vertically from clean petal strip right above patchY0 (y: 0.755..0.858)
    const imgData = ctx.getImageData(0, 0, CARD_TEX_WIDTH, CARD_TEX_HEIGHT);
    const data = imgData.data;

    const cleanTopY = Math.floor(CARD_TEX_HEIGHT * 0.856);
    const cleanBotY = Math.floor(CARD_TEX_HEIGHT * 0.966);

    for (let y = patchY0; y <= patchY1; y++) {
      const ny = y / CARD_TEX_HEIGHT;
      const edgeX = normalizedPetalEdgeX(ny) * CARD_TEX_WIDTH;
      const vFrac = (y - patchY0) / patchH;

      for (let x = patchX0; x < Math.floor(edgeX); x++) {
        const distFromEdge = edgeX - x;
        // Blend between clean top petal strip (mirrored slightly for stipple texture)
        // and clean bottom petal strip where yellow hasn't started yet (x < 0.875 * W)
        const srcYTop = Math.max(
          Math.floor(CARD_TEX_HEIGHT * 0.75),
          cleanTopY - ((y - patchY0) % 90)
        );
        const srcEdgeTop = normalizedPetalEdgeX(srcYTop / CARD_TEX_HEIGHT) * CARD_TEX_WIDTH;
        const srcXTop = Math.max(
          Math.floor(CARD_TEX_WIDTH * 0.65),
          Math.min(Math.floor(srcEdgeTop - 2), Math.round(srcEdgeTop - distFromEdge))
        );

        const idxTop = (srcYTop * CARD_TEX_WIDTH + srcXTop) * 4;
        let r = data[idxTop];
        let g = data[idxTop + 1];
        let b = data[idxTop + 2];

        // On the left side (x < 0.865 * W), blend smoothly toward bottom clean petal color
        if (x < CARD_TEX_WIDTH * 0.865) {
          const srcXBot = Math.min(CARD_TEX_WIDTH - 1, x);
          const idxBot = (cleanBotY * CARD_TEX_WIDTH + srcXBot) * 4;
          r = Math.round(r * (1 - vFrac) + data[idxBot] * vFrac);
          g = Math.round(g * (1 - vFrac) + data[idxBot + 1] * vFrac);
          b = Math.round(b * (1 - vFrac) + data[idxBot + 2] * vFrac);
        }

        // Feather patch borders
        let alpha = 1;
        if (y - patchY0 < 10) alpha = Math.min(alpha, (y - patchY0) / 10);
        if (patchY1 - y < 10) alpha = Math.min(alpha, (patchY1 - y) / 10);
        if (x - patchX0 < 14) alpha = Math.min(alpha, (x - patchX0) / 14);

        const dstIdx = (y * CARD_TEX_WIDTH + x) * 4;
        data[dstIdx] = Math.round(data[dstIdx] * (1 - alpha) + r * alpha);
        data[dstIdx + 1] = Math.round(data[dstIdx + 1] * (1 - alpha) + g * alpha);
        data[dstIdx + 2] = Math.round(data[dstIdx + 2] * (1 - alpha) + b * alpha);
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Restore clean vector geometry outside the petal curve (purple bg, pink ribbons, yellow ray)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(normalizedPetalEdgeX(patchY0 / CARD_TEX_HEIGHT) * CARD_TEX_WIDTH - 1, patchY0);
    for (let y = patchY0; y <= patchY1; y += 2) {
      ctx.lineTo(normalizedPetalEdgeX(y / CARD_TEX_HEIGHT) * CARD_TEX_WIDTH - 1, y);
    }
    ctx.lineTo(patchX1, patchY1);
    ctx.lineTo(patchX1, patchY0);
    ctx.closePath();
    ctx.clip();

    // Base lavender-purple background (#7D63C4)
    ctx.fillStyle = '#7D63C4';
    ctx.fillRect(patchX0, patchY0, patchW + 8, patchH + 8);

    // Diagonal pink ribbons (#FB98DE)
    ctx.strokeStyle = '#FB98DE';
    ctx.lineWidth = CARD_TEX_WIDTH * (54 / 5403);
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(CARD_TEX_WIDTH * (5025 / 5403), CARD_TEX_HEIGHT * (3180 / 3634));
    ctx.lineTo(CARD_TEX_WIDTH * (5310 / 5403), CARD_TEX_HEIGHT * (3545 / 3634));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CARD_TEX_WIDTH * (5088 / 5403), CARD_TEX_HEIGHT * (3560 / 3634));
    ctx.lineTo(CARD_TEX_WIDTH * (5405 / 5403), CARD_TEX_HEIGHT * (3060 / 3634));
    ctx.stroke();

    // Yellow star tip (#FCE89E)
    ctx.fillStyle = '#FCE89E';
    ctx.beginPath();
    ctx.moveTo(CARD_TEX_WIDTH * (4800 / 5403), CARD_TEX_HEIGHT * (3340 / 3634));
    ctx.lineTo(CARD_TEX_WIDTH * (4965 / 5403), CARD_TEX_HEIGHT * (3345 / 3634));
    ctx.lineTo(CARD_TEX_WIDTH * (5132 / 5403), CARD_TEX_HEIGHT * (3525 / 3634));
    ctx.lineTo(CARD_TEX_WIDTH * (4800 / 5403), CARD_TEX_HEIGHT * (3580 / 3634));
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    cachedBlankFrontCanvas = canvas;
    return canvas;
  })();

  return blankCanvasPromise;
}

/**
 * Renders a complete front signature card canvas with the given 4-digit serial number (e.g. "#0000").
 */
export async function renderFrontCardCanvas(serialNumber: string): Promise<HTMLCanvasElement> {
  const blank = await getBlankFrontCanvas();
  const canvas = document.createElement('canvas');
  canvas.width = CARD_TEX_WIDTH;
  canvas.height = CARD_TEX_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(blank, 0, 0);

  const label = serialNumber.startsWith('#') ? serialNumber : `#${serialNumber}`;
  const fontSize = Math.round(CARD_TEX_HEIGHT * 0.095);

  ctx.save();
  ctx.font = `900 italic ${fontSize}px "Inter", "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';

  // Soft purple-plum drop shadow matching reference/front_sc.png
  ctx.shadowColor = 'rgba(72, 42, 128, 0.35)';
  ctx.shadowBlur = Math.round(CARD_TEX_HEIGHT * 0.018);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.round(CARD_TEX_HEIGHT * 0.004);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(
    label,
    Math.round(CARD_TEX_WIDTH * 0.976),
    Math.round(CARD_TEX_HEIGHT * 0.944)
  );
  ctx.restore();

  return canvas;
}

/**
 * Creates a calibrated sRGB Three.js CanvasTexture for the 3D card front face.
 */
export async function createFrontCardTexture(serialNumber: string): Promise<THREE.CanvasTexture> {
  const canvas = await renderFrontCardCanvas(serialNumber);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates and downloads the personalized front card PNG with the edition's serial number.
 */
export async function downloadFrontCardPng(serialNumber: string, filename: string): Promise<void> {
  const canvas = await renderFrontCardCanvas(serialNumber);
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
