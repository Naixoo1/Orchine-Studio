'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, RefreshCw } from 'lucide-react';
import { EcoPassportData } from '@/store/useStudioStore';

interface HolographicCard2DProps {
  isFlipped?: boolean;
  onFlip?: () => void;
  passportData?: EcoPassportData | null;
  interactive?: boolean;
  className?: string;
}

export function HolographicCard2D({
  isFlipped = false,
  onFlip,
  passportData,
  interactive = true,
  className = '',
}: HolographicCard2DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glintX: 50, glintY: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      // Subtle, high-luxury tilt: max 14 degrees
      const rotateX = -(y - 0.5) * 22;
      const rotateY = (x - 0.5) * 22;

      setTilt({
        rotateX,
        rotateY,
        glintX: x * 100,
        glintY: y * 100,
        opacity: 0.9,
      });
    },
    [interactive]
  );

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;
    setTilt({ rotateX: 0, rotateY: 0, glintX: 50, glintY: 50, opacity: 0 });
  }, [interactive]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));

      const rotateX = -(y - 0.5) * 18;
      const rotateY = (x - 0.5) * 18;

      setTilt({
        rotateX,
        rotateY,
        glintX: x * 100,
        glintY: y * 100,
        opacity: 0.85,
      });
    },
    [interactive]
  );

  const handleTouchEnd = useCallback(() => {
    if (!interactive) return;
    setTilt({ rotateX: 0, rotateY: 0, glintX: 50, glintY: 50, opacity: 0 });
  }, [interactive]);

  const batchNumber = passportData?.batchNumber || '#0000';

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        onClick={onFlip}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[5403/3634] max-w-[560px] mx-auto rounded-[22px] sm:rounded-[28px] cursor-pointer transition-transform duration-200 ease-out preserve-3d group shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + (isFlipped ? 180 : 0)}deg) scale3d(1.01, 1.01, 1.01)`,
          transformStyle: 'preserve-3d',
        }}
        title="Click or Tap to Flip Card"
      >
        {/* ========================================================= */}
        {/* FRONT FACE (reference/front_sc.png)                       */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[28px] overflow-hidden backface-hidden bg-[#241A3E] border border-amber-300/30"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Base Artwork Image */}
          <Image
            src="/passport/eco-passport-front.png"
            alt="Eco-Passport Signature Card Front"
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            priority
            className="object-cover w-full h-full"
          />

          {/* Dynamic Prismatic Rainbow Holographic Foil Film */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
            style={{
              opacity: tilt.opacity,
              background: `linear-gradient(
                ${115 + tilt.rotateY * 2}deg,
                rgba(255, 0, 128, 0) 0%,
                rgba(255, 105, 180, 0.45) 22%,
                rgba(0, 255, 255, 0.5) 45%,
                rgba(187, 154, 239, 0.6) 60%,
                rgba(255, 215, 0, 0.45) 78%,
                rgba(255, 0, 128, 0) 100%
              )`,
            }}
          />

          {/* Dynamic Specular Sheen & Foil Flare (Tracks Cursor) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 mix-blend-overlay"
            style={{
              opacity: tilt.opacity,
              background: `radial-gradient(
                circle 280px at ${tilt.glintX}% ${tilt.glintY}%,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 255, 255, 0.25) 35%,
                transparent 70%
              )`,
            }}
          />

          {/* Secondary Holographic Glint Diagonal Beam */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `linear-gradient(
                ${45 + tilt.rotateX}deg,
                transparent 30%,
                rgba(255, 255, 255, 0.6) 50%,
                transparent 70%
              )`,
              transform: `translateX(${(tilt.glintX - 50) * 1.5}%)`,
            }}
          />

          {/* Subtle Ambient Foil Glint on Edge Border */}
          <div className="absolute inset-0 rounded-[22px] sm:rounded-[28px] ring-1 ring-inset ring-amber-200/40 pointer-events-none shadow-[inset_0_0_20px_rgba(255,215,0,0.25)]" />

          {/* Micro Authenticity Hologram Stamp Pill (Top-Right) */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FFF2B1] shadow-sm pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest uppercase font-semibold">
              Holographic Edition
            </span>
          </div>

          {/* Batch Number Callout / Tag (Reinforcing #351517) */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 shadow-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono tracking-wider">
              {batchNumber} • Eco-Passport
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE (reference/back_sn.png)                        */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[28px] overflow-hidden backface-hidden bg-[#341F5F] border border-amber-300/30"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Base Artwork Image */}
          <Image
            src="/passport/eco-passport-back.png"
            alt="Eco-Passport Signature Card Back"
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            priority
            className="object-cover w-full h-full"
          />

          {/* Dynamic Prismatic Rainbow Holographic Foil Film for Back */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
            style={{
              opacity: tilt.opacity * 0.75,
              background: `linear-gradient(
                ${135 - tilt.rotateY * 2}deg,
                rgba(255, 0, 128, 0) 0%,
                rgba(0, 255, 255, 0.4) 30%,
                rgba(255, 215, 0, 0.4) 60%,
                rgba(255, 0, 128, 0) 100%
              )`,
            }}
          />

          {/* Dynamic Specular Sheen for Back */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 mix-blend-overlay"
            style={{
              opacity: tilt.opacity * 0.8,
              background: `radial-gradient(
                circle 250px at ${100 - tilt.glintX}% ${tilt.glintY}%,
                rgba(255, 255, 255, 0.7) 0%,
                rgba(255, 255, 255, 0.15) 40%,
                transparent 70%
              )`,
            }}
          />

          {/* Gold Foil Outer Rim */}
          <div className="absolute inset-0 rounded-[22px] sm:rounded-[28px] ring-1 ring-inset ring-amber-200/40 pointer-events-none shadow-[inset_0_0_20px_rgba(255,215,0,0.25)]" />

          {/* Verified Atelier QR Code Badge (Top-Left) */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FFF2B1] shadow-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] font-mono tracking-widest uppercase font-semibold">
              Scan For Provenance
            </span>
          </div>

          {/* Recipient Provenance Badge (Bottom-Right) */}
          {passportData?.recipientName && (
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 shadow-sm pointer-events-none">
              <span className="text-[9px] font-serif italic truncate max-w-[160px]">
                Issued to: {passportData.recipientName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Flip Hint Button */}
      {interactive && (
        <div className="mt-3.5 flex items-center justify-center space-x-2 text-[11px] font-mono text-[#BB9AEF]/80">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Click card or tap flip button to inspect reverse side</span>
        </div>
      )}
    </div>
  );
}
