import * as THREE from 'three';
import { ScarfItem } from '@/data/scarves';

/**
 * Generates a lightweight ivory open-weave botanical canvas texture used as an instant
 * synchronous fallback while the photo-derived WebP texture loads.
 */
export function createProceduralBotanicalTexture(scarf: ScarfItem): THREE.CanvasTexture {
  const width = 512;
  const height = 768;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Warm ivory open-weave background matching the physical scarves
  ctx.fillStyle = '#ECE8DC';
  ctx.fillRect(0, 0, width, height);

  // Subtle woven linen grid
  ctx.strokeStyle = 'rgba(180, 172, 152, 0.22)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Scattered subtle botanical dye stains matching the scarf palette
  for (let i = 0; i < 18; i++) {
    const cx = ((i * 137) % (width - 80)) + 40;
    const cy = ((i * 193) % (height - 120)) + 40;
    const radius = 22 + (i % 4) * 10;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    const tone = i % 2 === 0 ? scarf.palette.primary : scarf.palette.accent;
    grad.addColorStop(0, `${tone}44`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
