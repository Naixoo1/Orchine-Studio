'use client';

import React, { useMemo } from 'react';
import { BotanicalThemeSlug } from '@/data/team';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

interface BotanicalAtmosphereProps {
  activeTheme?: BotanicalThemeSlug | null;
}

export function BotanicalAtmosphere({ activeTheme }: BotanicalAtmosphereProps) {
  // Generate stable pseudorandom particles for spores, pollen & chlorophyll motes
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      'rgba(56, 189, 248, 0.75)', // Cyan / Indigo spore
      'rgba(52, 211, 153, 0.75)', // Eucalyptus sage
      'rgba(16, 185, 129, 0.75)', // Fern chlorophyll
      'rgba(245, 158, 11, 0.75)', // Oak tannin amber
      'rgba(236, 72, 153, 0.65)', // Orchid pink mote
      'rgba(254, 240, 138, 0.75)', // Golden solar pollen
    ];

    const result: Particle[] = [];
    for (let i = 0; i < 28; i++) {
      const x = (i * 3.8 + ((i * 17) % 97)) % 100;
      const y = (i * 4.1 + ((i * 23) % 93)) % 100;
      const size = 1.8 + (i % 4) * 1.3;
      const duration = 12 + (i % 10) * 2;
      const delay = (i % 7) * 1.4;
      const color = colors[i % colors.length];
      const opacity = 0.25 + (i % 5) * 0.12;

      result.push({ id: i, x, y, size, duration, delay, color, opacity });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Deep Atmospheric Ground (Spec 4.1 Progression: Midnight Iris #221D63 into Atelier Plum #341F5F and Obsidian) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181232] via-[#221D63] via-[#1E1638] to-[#120D22]" />

      {/* 2. Living 4-Corner Elemental Eco-Print Aura Glows (Infused with Spec 4.1 & 4.2 Accents) */}
      {/* Top-Left: Indigo Vat Glow (Indigo Twilight #373191 & Slate Blue #485C91) */}
      <div
        className={`absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#373191]/30 via-[#485C91]/20 to-[#582E8B]/20 blur-[110px] transform-gpu will-change-transform transition-all duration-700 ${
          activeTheme === 'indigo' ? 'scale-125 opacity-100' : 'opacity-65'
        }`}
        style={{ animationDuration: '9s' }}
      />

      {/* Bottom-Left: Eucalyptus Sage Glow (Emerald Sage & Blossom Orchid #FFC8DD / #341F5F) */}
      <div
        className={`absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-[#341F5F]/25 to-[#FFC8DD]/10 blur-[110px] transform-gpu will-change-transform transition-all duration-700 ${
          activeTheme === 'eucalyptus' ? 'scale-125 opacity-100' : 'opacity-65'
        }`}
        style={{ animationDuration: '11s' }}
      />

      {/* Top-Right: Sword Fern Chlorophyll Glow (Forest Chlorophyll & Lavender #BB9AEF / #582E8B) */}
      <div
        className={`absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-green-500/15 via-[#582E8B]/22 to-[#BB9AEF]/12 blur-[110px] transform-gpu will-change-transform transition-all duration-700 ${
          activeTheme === 'fern' ? 'scale-125 opacity-100' : 'opacity-65'
        }`}
        style={{ animationDuration: '10s' }}
      />

      {/* Bottom-Right: Iron Oak Tannin Amber Glow (Warm Peach #FF9E69 & Warm Cream #FFF2B1) */}
      <div
        className={`absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#FF9E69]/18 via-[#FFF2B1]/10 to-[#341F5F]/25 blur-[110px] transform-gpu will-change-transform transition-all duration-700 ${
          activeTheme === 'oak' ? 'scale-125 opacity-100' : 'opacity-65'
        }`}
        style={{ animationDuration: '8s' }}
      />

      {/* Epicenter: Central Class Orchid & Royal Violet Steam (#582E8B, #BB9AEF, #FFC8DD) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-gradient-to-b from-[#582E8B]/24 via-[#BB9AEF]/14 to-[#FFC8DD]/8 blur-[130px] pointer-events-none transform-gpu will-change-transform" />

      {/* Nike-Style Perimeter Vignette: Zero Collision with Cards and Typography */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />

      {/* 
        3. VARIETY OF ECO-PRINT PLANTATION NATURE SILHOUETTES
        Silhouettes inspired directly by the 4 references:
        - Eucalyptus cinerea (Silver Dollar round discs)
        - Polystichum munitum (Forest Sword Fern fronds)
        - Indigofera tinctoria (Indigo compound pinnate leaves)
        - Quercus robur (Lobed Oak leaves and gall spheres)
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06] mix-blend-screen">
        {/* Silver Dollar Eucalyptus Branch (Top-Center / Left) */}
        <svg
          className="absolute top-[8%] left-[6%] w-[380px] h-[380px] text-emerald-300 animate-pulse transform-gpu will-change-transform"
          style={{ animationDuration: '14s' }}
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20 180 Q80 120 160 30" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="150" cy="45" r="22" />
          <circle cx="130" cy="65" r="25" opacity="0.85" />
          <circle cx="110" cy="88" r="28" />
          <circle cx="85" cy="112" r="30" opacity="0.85" />
          <circle cx="60" cy="140" r="32" />
        </svg>

        {/* Forest Sword Fern Fronds (Bottom-Left margin) */}
        <svg
          className="absolute -bottom-10 left-[2%] w-[440px] h-[440px] text-teal-300 transform-gpu will-change-transform"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20 190 Q90 100 185 20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M45 160 C25 150 25 135 55 152" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M60 148 C85 136 86 150 66 154" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M75 130 C50 114 55 102 82 126" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M90 120 C114 106 118 120 98 126" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M105 100 C82 86 86 74 112 96" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 90 C145 76 150 90 128 98" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M135 70 C118 58 122 48 142 66" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M150 62 C170 50 174 62 155 70" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        </svg>

        {/* True Indigo Pinnate Foliage Sprig (Top-Right margin) */}
        <svg
          className="absolute top-[12%] right-[5%] w-[400px] h-[400px] text-sky-300 transform-gpu will-change-transform"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M100 20 Q100 110 100 180" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="30" rx="9" ry="16" />
          <ellipse cx="78" cy="55" rx="10" ry="17" transform="rotate(-30 78 55)" />
          <ellipse cx="122" cy="55" rx="10" ry="17" transform="rotate(30 122 55)" />
          <ellipse cx="74" cy="85" rx="11" ry="19" transform="rotate(-30 74 85)" />
          <ellipse cx="126" cy="85" rx="11" ry="19" transform="rotate(30 126 85)" />
          <ellipse cx="70" cy="118" rx="12" ry="21" transform="rotate(-30 70 118)" />
          <ellipse cx="130" cy="118" rx="12" ry="21" transform="rotate(30 130 118)" />
          <ellipse cx="68" cy="150" rx="12" ry="21" transform="rotate(-30 68 150)" />
          <ellipse cx="132" cy="150" rx="12" ry="21" transform="rotate(30 132 150)" />
        </svg>

        {/* Iron Oak Branch with Lobed Leaves & Spherical Galls (Bottom-Right margin) */}
        <svg
          className="absolute bottom-[6%] right-[6%] w-[420px] h-[420px] text-amber-300 transform-gpu will-change-transform"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M100 20 C88 35 70 35 76 55 C58 58 62 76 80 80 C66 94 72 110 90 114 C88 128 98 128 96 114 C116 110 122 94 108 80 C126 76 130 58 112 55 C118 35 100 35 100 20 Z" />
          <path d="M96 114 L96 175" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          {/* Spherical Gall apples hanging from twig */}
          <circle cx="140" cy="130" r="22" />
          <circle cx="140" cy="130" r="19" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="55" cy="140" r="16" />
        </svg>
      </div>

      {/* 4. Subtle Eco-Print Fabric Weave Texture Simulation */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFF 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 5. Drifting Spores, Chlorophyll & Pollen Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full transition-opacity transform-gpu will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: p.opacity,
            animation: `botanicalDrift ${p.duration}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Inject Keyframe for Smooth Organic Drift */}
      <style jsx global>{`
        @keyframes botanicalDrift {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
          }
          50% {
            transform: translate3d(18px, -28px, 0) scale(1.15);
          }
          100% {
            transform: translate3d(-14px, -52px, 0) scale(0.85);
          }
        }
        @keyframes orbitSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbitSlowReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
