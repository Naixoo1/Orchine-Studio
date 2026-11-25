import * as THREE from 'three';
import { ScarfItem } from '@/data/scarves';

/**
 * Generates an artistic procedural botanical eco-print texture on an offscreen HTML5 canvas.
 * Serves as a high-fidelity parametric fallback and instant preview until real 2048x2048 WebP
 * files are placed in public/textures/ by Designer A.
 */
export function createProceduralBotanicalTexture(scarf: ScarfItem): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    return fallbackTexture;
  }

  // 1. Organic Silk Background Tint
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
  bgGrad.addColorStop(0, scarf.palette.sheen);
  bgGrad.addColorStop(0.65, scarf.palette.secondary);
  bgGrad.addColorStop(1, scarf.palette.background);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Artisanal Steaming Bleed / Vignette Grain
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 40 + Math.random() * 140;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `${scarf.palette.primary}22`);
    grad.addColorStop(0.7, `${scarf.palette.accent}11`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Botanical Leaf Prints / Vein Silhouettes
  const leafCount = 28;
  ctx.save();
  for (let i = 0; i < leafCount; i++) {
    const cx = (i % 5) * (size / 4) + (Math.sin(i * 1.7) * 40 + 40);
    const cy = Math.floor(i / 5) * (size / 5) + (Math.cos(i * 1.3) * 50 + 50);
    const angle = (i * 47 * Math.PI) / 180;
    const scale = 0.6 + (i % 3) * 0.3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    // Leaf Body Outline
    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.bezierCurveTo(45, -60, 55, 30, 0, 90);
    ctx.bezierCurveTo(-55, 30, -45, -60, 0, -90);
    ctx.closePath();

    ctx.fillStyle = (i % 2 === 0 ? scarf.palette.primary : scarf.palette.accent) + '55';
    ctx.fill();
    ctx.strokeStyle = scarf.palette.accent + '88';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central Leaf Vein
    ctx.beginPath();
    ctx.moveTo(0, -85);
    ctx.lineTo(0, 85);
    ctx.strokeStyle = scarf.palette.sheen + 'aa';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Lateral Veins
    for (let v = -60; v <= 60; v += 20) {
      ctx.beginPath();
      ctx.moveTo(0, v);
      ctx.lineTo(25, v - 15);
      ctx.moveTo(0, v);
      ctx.lineTo(-25, v - 15);
      ctx.strokeStyle = scarf.palette.sheen + '55';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    ctx.restore();
  }
  ctx.restore();

  // 4. Subtle Hand-Rolled Scarf Edge Border
  ctx.strokeStyle = scarf.palette.accent;
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, size - 32, size - 32);

  ctx.strokeStyle = scarf.palette.sheen + '66';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, size - 52, size - 52);

  // 5. Atelier Inscription Stamp
  ctx.font = '300 24px Cormorant Garamond, serif';
  ctx.fillStyle = scarf.palette.sheen + '99';
  ctx.textAlign = 'center';
  ctx.fillText(`ORCHINÉ ATELIER • ${scarf.name.toUpperCase()}`, size / 2, size - 46);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}
