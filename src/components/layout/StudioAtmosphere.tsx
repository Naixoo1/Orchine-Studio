'use client';

import React from 'react';

/**
 * StudioAtmosphere
 * 
 * Lightweight, high-performance atmospheric background.
 * Uses native CSS gradients and subtle radial vignettes without
 * heavy multi-layer blur filters, guaranteeing smooth 60+ FPS scrolling.
 */
export function StudioAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden select-none">
      {/* 1. Deep Midnight Base Progression */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141026] via-[#1A1535] via-[#16122C] to-[#0E0B1A]" />

      {/* 2. Lightweight Static Radial Ambience (Zero GPU Blur Filters) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(187, 154, 239, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(72, 92, 145, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 20% 60%, rgba(88, 46, 139, 0.14) 0%, transparent 45%),
            radial-gradient(circle at 50% 85%, rgba(55, 49, 145, 0.12) 0%, transparent 50%)
          `,
        }}
      />

      {/* 3. Subtle Edge Vignette for Crisp Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
    </div>
  );
}
