'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TeamMember, BOTANICAL_THEMES, BotanicalThemeSlug } from '@/data/team';
import {
  Instagram,
  Phone,
  Code2,
  Box,
  Camera,
  Mic,
  Leaf,
  Palette,
  ExternalLink,
  Droplets,
  Sun,
  Flame,
  Maximize2,
} from 'lucide-react';

interface ThemedProfileCardProps {
  member: TeamMember;
  isFocused?: boolean;
  onHover?: (slug: BotanicalThemeSlug | null) => void;
}

// Craft Role Icon
function CraftIcon({ name, className }: { name: string; className: string }) {
  switch (name) {
    case 'Code2':
      return <Code2 className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Box':
      return <Box className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    default:
      return <Leaf className={className} />;
  }
}

// Alchemy Element Icon
function ElementIcon({ slug }: { slug: BotanicalThemeSlug }) {
  switch (slug) {
    case 'indigo':
      return <Droplets className="w-3.5 h-3.5 text-sky-400" />;
    case 'eucalyptus':
      return <Sun className="w-3.5 h-3.5 text-emerald-400" />;
    case 'fern':
      return <Leaf className="w-3.5 h-3.5 text-teal-400" />;
    case 'oak':
      return <Flame className="w-3.5 h-3.5 text-amber-500" />;
  }
}

/**
 * PlantationAccessoriesFrame
 * 
 * Bespoke botanical plantation component physically encircling and embracing the profile portrait.
 * Built directly around each representative distinct profile using the authentic botanical references:
 * - Indigo: Indigofera tinctoria paired pinnate leaflets, cyan liquid vat droplets, and indigo blossoms.
 * - Eucalyptus: Eucalyptus cinerea circular glaucous silver dollar discs and golden solar stems.
 * - Sword Fern: Polystichum munitum arching serrated fern fronds and curling fiddleheads (crosiers).
 * - Iron Oak: Quercus robur lobed oak leaves, spherical gallotannic oak galls, and tannin twigs.
 */
function PlantationAccessoriesFrame({
  slug,
  primaryHex,
  accentHex,
}: {
  slug: BotanicalThemeSlug;
  primaryHex: string;
  accentHex: string;
}) {
  if (slug === 'indigo') {
    return (
      <svg
        className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none z-10 transition-transform duration-700 group-hover:scale-105"
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <filter id="indigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring Glow */}
        <circle cx="130" cy="130" r="102" stroke="url(#indigoGrad)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
        <circle cx="130" cy="130" r="96" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />

        {/* Left Foliage Branch: Pinnate Indigo Stem with 5 Leaflet Pairs */}
        <path d="M36 175 Q60 110 105 55" stroke="url(#indigoGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="44" cy="165" rx="7" ry="14" fill="#38BDF8" fillOpacity="0.85" transform="rotate(-40 44 165)" />
        <ellipse cx="64" cy="172" rx="6" ry="12" fill="#6366F1" fillOpacity="0.75" transform="rotate(35 64 172)" />
        <ellipse cx="58" cy="132" rx="7.5" ry="15" fill="#38BDF8" fillOpacity="0.9" transform="rotate(-35 58 132)" />
        <ellipse cx="78" cy="138" rx="6.5" ry="13" fill="#6366F1" fillOpacity="0.8" transform="rotate(40 78 138)" />
        <ellipse cx="76" cy="98" rx="8" ry="15" fill="#38BDF8" fillOpacity="0.85" transform="rotate(-30 76 98)" />
        <ellipse cx="96" cy="104" rx="7" ry="13" fill="#6366F1" fillOpacity="0.8" transform="rotate(45 96 104)" />
        <ellipse cx="100" cy="68" rx="7.5" ry="14" fill="#38BDF8" fillOpacity="0.9" transform="rotate(-25 100 68)" />

        {/* Top-Right Flowering Sprig: Papilionaceous Indigo Flowers */}
        <path d="M165 55 Q205 105 224 175" stroke="url(#indigoGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Blossom Petals */}
        <path d="M152 46 C158 36 170 38 168 48 C166 58 154 56 152 46 Z" fill="#818CF8" />
        <circle cx="160" cy="48" r="4.5" fill="#38BDF8" />
        <ellipse cx="182" cy="74" rx="8" ry="15" fill="#38BDF8" fillOpacity="0.85" transform="rotate(35 182 74)" />
        <ellipse cx="162" cy="80" rx="7" ry="13" fill="#6366F1" fillOpacity="0.75" transform="rotate(-40 162 80)" />
        <ellipse cx="202" cy="112" rx="8.5" ry="16" fill="#38BDF8" fillOpacity="0.9" transform="rotate(40 202 112)" />
        <ellipse cx="182" cy="120" rx="7.5" ry="14" fill="#6366F1" fillOpacity="0.8" transform="rotate(-35 182 120)" />
        <ellipse cx="216" cy="154" rx="8" ry="15" fill="#38BDF8" fillOpacity="0.85" transform="rotate(45 216 154)" />
        <ellipse cx="196" cy="162" rx="7" ry="13" fill="#6366F1" fillOpacity="0.75" transform="rotate(-30 196 162)" />

        {/* Cyan Vat Droplets */}
        <circle cx="70" cy="40" r="3.5" fill="#38BDF8" filter="url(#indigoGlow)" />
        <circle cx="195" cy="40" r="3" fill="#818CF8" filter="url(#indigoGlow)" />
        <circle cx="130" cy="235" r="4" fill="#38BDF8" filter="url(#indigoGlow)" />
      </svg>
    );
  }

  if (slug === 'eucalyptus') {
    return (
      <svg
        className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none z-10 transition-transform duration-700 group-hover:scale-105"
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="eucGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="eucGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Orbiting Disc Ring */}
        <circle cx="130" cy="130" r="102" stroke="url(#eucGrad)" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.55" />
        <circle cx="130" cy="130" r="96" stroke="#34D399" strokeWidth="1" opacity="0.3" />

        {/* Left Climbing Eucalyptus Branch with Paired Silver Dollar Discs */}
        <path d="M45 210 Q40 130 95 45" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
        {/* Silver Dollar Round Discs */}
        <circle cx="48" cy="180" r="16" fill="#34D399" fillOpacity="0.8" />
        <circle cx="48" cy="180" r="14" stroke="#A7F3D0" strokeWidth="1" opacity="0.6" />
        <circle cx="68" cy="170" r="14" fill="#059669" fillOpacity="0.75" />

        <circle cx="42" cy="130" r="18" fill="#34D399" fillOpacity="0.85" />
        <circle cx="42" cy="130" r="16" stroke="#A7F3D0" strokeWidth="1.2" opacity="0.6" />
        <circle cx="62" cy="120" r="15" fill="#059669" fillOpacity="0.75" />

        <circle cx="56" cy="82" r="17" fill="#34D399" fillOpacity="0.8" />
        <circle cx="56" cy="82" r="15" stroke="#A7F3D0" strokeWidth="1" opacity="0.6" />
        <circle cx="76" cy="74" r="14" fill="#059669" fillOpacity="0.7" />

        <circle cx="86" cy="46" r="14" fill="#34D399" fillOpacity="0.85" />

        {/* Right Branch with Golden Solar Seed Pods & Eucalyptus Leaves */}
        <path d="M215 210 Q220 130 165 45" stroke="url(#eucGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="212" cy="180" r="16" fill="#34D399" fillOpacity="0.8" />
        <circle cx="192" cy="170" r="14" fill="#059669" fillOpacity="0.75" />

        <circle cx="218" cy="130" r="18" fill="#F59E0B" fillOpacity="0.75" />
        <circle cx="218" cy="130" r="15" stroke="#FDE68A" strokeWidth="1.2" opacity="0.6" />
        <circle cx="198" cy="120" r="15" fill="#34D399" fillOpacity="0.75" />

        <circle cx="204" cy="82" r="17" fill="#34D399" fillOpacity="0.8" />
        <circle cx="184" cy="74" r="14" fill="#F59E0B" fillOpacity="0.7" />

        <circle cx="174" cy="46" r="14" fill="#34D399" fillOpacity="0.85" />

        {/* Solar Motes */}
        <circle cx="130" cy="25" r="4" fill="#F59E0B" filter="url(#eucGlow)" />
        <circle cx="130" cy="235" r="3.5" fill="#34D399" filter="url(#eucGlow)" />
      </svg>
    );
  }

  if (slug === 'fern') {
    return (
      <svg
        className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none z-10 transition-transform duration-700 group-hover:scale-105"
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="fernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="fernGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="130" cy="130" r="102" stroke="url(#fernGrad)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
        <circle cx="130" cy="130" r="96" stroke="#10B981" strokeWidth="1" opacity="0.3" />

        {/* Left Arching Sword Fern Frond (Polystichum munitum) */}
        <path d="M40 215 Q30 110 110 35" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        {/* Serrated Pinnae Pairs */}
        <path d="M42 190 Q22 185 36 175 Q48 180 44 190 Z" fill="#10B981" fillOpacity="0.85" />
        <path d="M52 185 Q72 180 58 172 Q46 178 52 185 Z" fill="#047857" fillOpacity="0.8" />

        <path d="M38 155 Q16 148 32 140 Q46 146 40 155 Z" fill="#10B981" fillOpacity="0.9" />
        <path d="M50 150 Q72 144 56 136 Q44 142 50 150 Z" fill="#047857" fillOpacity="0.85" />

        <path d="M40 120 Q18 112 36 104 Q48 110 42 120 Z" fill="#10B981" fillOpacity="0.9" />
        <path d="M54 116 Q76 108 60 100 Q48 108 54 116 Z" fill="#047857" fillOpacity="0.85" />

        <path d="M52 88 Q32 80 50 72 Q62 78 54 88 Z" fill="#10B981" fillOpacity="0.85" />
        <path d="M66 84 Q88 76 72 68 Q60 76 66 84 Z" fill="#047857" fillOpacity="0.8" />

        <path d="M78 60 Q60 52 76 46 Q86 52 80 60 Z" fill="#10B981" />
        <path d="M90 56 Q108 48 94 42 Q84 48 90 56 Z" fill="#047857" />

        {/* Right Fanning Sword Frond */}
        <path d="M220 215 Q230 110 150 35" stroke="url(#fernGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M218 190 Q238 185 224 175 Q212 180 216 190 Z" fill="#10B981" fillOpacity="0.85" />
        <path d="M208 185 Q188 180 202 172 Q214 178 208 185 Z" fill="#047857" fillOpacity="0.8" />

        <path d="M222 155 Q244 148 228 140 Q214 146 220 155 Z" fill="#10B981" fillOpacity="0.9" />
        <path d="M210 150 Q188 144 204 136 Q216 142 210 150 Z" fill="#047857" fillOpacity="0.85" />

        <path d="M220 120 Q242 112 224 104 Q212 110 218 120 Z" fill="#10B981" fillOpacity="0.9" />
        <path d="M206 116 Q184 108 200 100 Q212 108 206 116 Z" fill="#047857" fillOpacity="0.85" />

        <path d="M208 88 Q228 80 210 72 Q198 78 206 88 Z" fill="#10B981" fillOpacity="0.85" />
        <path d="M194 84 Q172 76 188 68 Q200 76 194 84 Z" fill="#047857" fillOpacity="0.8" />

        {/* Curled Fiddlehead Crosier (Circinate Vernation) at base */}
        <path d="M130 225 C122 225 116 231 116 238 C116 244 122 249 128 248 C133 247 136 242 135 237 C134 233 130 231 127 233" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* Spore Mote */}
        <circle cx="130" cy="25" r="3.5" fill="#34D399" filter="url(#fernGlow)" />
      </svg>
    );
  }

  // Iron Oak Gall (Quercus robur & Gallotannins)
  return (
    <svg
      className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none z-10 transition-transform duration-700 group-hover:scale-105"
      viewBox="0 0 260 260"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="oakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="oakGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient Orbiting Disc Ring */}
      <circle cx="130" cy="130" r="102" stroke="url(#oakGrad)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
      <circle cx="130" cy="130" r="96" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />

      {/* Left Oak Foliage: Classic Sinuate Lobed Leaf (Quercus robur) */}
      <path
        d="M45 205 C35 190 25 175 35 160 C22 155 24 135 38 128 C26 120 30 102 46 98 C36 85 46 70 62 72 C58 58 72 48 86 56 L95 65"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#F59E0B"
        fillOpacity="0.4"
      />
      {/* Veins */}
      <path d="M45 205 Q65 140 95 65" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Right Flank: Arching Branch with Spherical Oak Galls (Gallotannic Apples) */}
      <path d="M215 205 Q225 130 170 55" stroke="url(#oakGrad)" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* 3 Prominent Spherical Oak Galls directly on the branch */}
      <circle cx="218" cy="165" r="17" fill="#F59E0B" fillOpacity="0.9" />
      <circle cx="218" cy="165" r="15" stroke="#FDE68A" strokeWidth="1.2" opacity="0.7" strokeDasharray="3 3" />
      <circle cx="215" cy="162" r="5" fill="#B45309" opacity="0.6" />

      <circle cx="210" cy="115" r="19" fill="#D97706" fillOpacity="0.9" />
      <circle cx="210" cy="115" r="17" stroke="#FDE68A" strokeWidth="1.2" opacity="0.8" strokeDasharray="4 3" />
      <circle cx="206" cy="111" r="6" fill="#78350F" opacity="0.7" />

      <circle cx="188" cy="72" r="15" fill="#F59E0B" fillOpacity="0.85" />
      <circle cx="188" cy="72" r="13" stroke="#FDE68A" strokeWidth="1" opacity="0.7" strokeDasharray="3 2" />

      {/* Tannin Mote */}
      <circle cx="130" cy="25" r="4" fill="#F59E0B" filter="url(#oakGlow)" />
      <circle cx="130" cy="235" r="3.5" fill="#D97706" filter="url(#oakGlow)" />
    </svg>
  );
}

export function ThemedProfileCard({ member, isFocused, onHover }: ThemedProfileCardProps) {
  const theme = BOTANICAL_THEMES[member.themeSlug];
  const [viewMode, setViewMode] = useState<'avatar' | 'specimen'>('avatar');
  const isPortraitPhoto = !member.image.endsWith('orchid-flower-transparent.png');

  // Botanical color spectrum dots
  const dyeSpectrum = {
    indigo: ['#38BDF8', '#2563EB', '#1E3A8A', '#0F172A'],
    eucalyptus: ['#A7F3D0', '#34D399', '#059669', '#F59E0B'],
    fern: ['#6EE7B7', '#10B981', '#047857', '#064E3B'],
    oak: ['#FDE68A', '#F59E0B', '#B45309', '#1F2937'],
  }[member.themeSlug];

  return (
    <div
      onMouseEnter={() => onHover?.(member.themeSlug)}
      onMouseLeave={() => onHover?.(null)}
      className={`w-full rounded-[2.5rem] glass-panel bg-gradient-to-b ${theme.cardBgGradient} border ${theme.borderClass} ${theme.borderHoverClass} p-6 sm:p-7 shadow-2xl relative overflow-hidden group transition-all duration-500 flex flex-col items-center text-center ${
        isFocused ? 'ring-2 ring-white/60 scale-[1.02]' : ''
      }`}
      style={{
        boxShadow: isFocused ? `0 0 45px ${theme.glowRgba}` : undefined,
      }}
    >
      {/* Ambient Top Light Beam */}
      <div
        className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-28 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-500"
        style={{ backgroundColor: theme.primaryHex }}
      />

      {/* Top Header Row: Plate Specimen & Botanical Tag */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span
            className="text-[10px] font-mono tracking-widest uppercase font-bold"
            style={{ color: theme.primaryHex }}
          >
            {member.specimenNo}
          </span>
          <span className="text-[10px] text-white/30">•</span>
          <span className="text-[10px] font-mono tracking-wider text-brand-sand/70 uppercase">
            {theme.title}
          </span>
        </div>

        <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full ${theme.tagBgClass} border border-white/10`}>
          <ElementIcon slug={member.themeSlug} />
          <span className={`text-[10px] font-mono tracking-wide ${theme.tagTextClass}`}>
            {theme.botanicalTitle}
          </span>
        </div>
      </div>

      {/* 
        DOMINANT VISUAL STAGE: INTACT PLANTATION ACCESSORIES COMPONENT AROUND PROFILE
        The plantation accessories (indigo sprigs, eucalyptus discs, sword fern fronds, oak galls)
        are built as an intact physical framing component embracing the circular profile.
      */}
      <div
        onClick={() => setViewMode(viewMode === 'avatar' ? 'specimen' : 'avatar')}
        className="relative w-44 h-44 sm:w-52 sm:h-52 my-3 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500 z-10 cursor-pointer"
        title="Click to toggle between Profile Portrait and Botanical Macro Specimen"
      >
        {/* Intact Bespoke Plantation Accessories Component Around the Profile */}
        <PlantationAccessoriesFrame
          slug={member.themeSlug}
          primaryHex={theme.primaryHex}
          accentHex={theme.accentHex}
        />

        {/* Ambient Back Glow */}
        <div
          className="absolute inset-2 rounded-full opacity-60 blur-md group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${theme.primaryHex}, ${theme.accentHex})` }}
        />

        {/* Central Portrait & Specimen Frame */}
        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-[#160E2A] border-2 border-white/30 shadow-2xl flex items-center justify-center z-10 ${
            viewMode === 'avatar' && !isPortraitPhoto ? 'p-2' : ''
          }`}
        >
          {viewMode === 'avatar' ? (
            isPortraitPhoto ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 384px, 512px"
                quality={95}
                unoptimized
                priority
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 160px, 176px"
                priority
                className="object-contain p-4 w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.35)] transition-transform duration-300 group-hover:scale-105"
              />
            )
          ) : (
            <div className="relative w-full h-full rounded-full overflow-hidden animate-in fade-in duration-300">
              <Image
                src={theme.botanicalImage}
                alt={theme.scientificName}
                fill
                sizes="(max-width: 640px) 160px, 176px"
                className="object-cover w-full h-full scale-105 filter brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-2.5 inset-x-2 text-center">
                <span className="text-[9px] font-mono tracking-widest uppercase text-white/90 bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                  {theme.scientificName}
                </span>
              </div>
            </div>
          )}

          {/* Subtle Hover Lens Badge (In-situ visual cue) */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            <Maximize2 className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* 
        VISUAL DYE SPECTRUM ACCENT RIBBON
      */}
      <div className="flex items-center space-x-1.5 my-1.5 z-10">
        {dyeSpectrum.map((color, idx) => (
          <span
            key={idx}
            className="w-2.5 h-2.5 rounded-full border border-white/25 shadow-sm"
            style={{ backgroundColor: color }}
            title={`Natural Eco-Print Pigment Tone ${idx + 1}`}
          />
        ))}
      </div>

      {/* 
        CLEAN EDITORIAL PROFILE CONTENT (Inspired by About Us Profile .png)
      */}
      <div className="w-full flex flex-col items-center mt-2 space-y-2 z-10">
        {/* Name: Editorial Serif */}
        <h3
          className="font-serif text-xl sm:text-2xl text-white tracking-luxury font-medium transition-colors duration-300 drop-shadow-sm px-2"
          style={{ color: isFocused ? theme.primaryHex : undefined }}
        >
          {member.name}
        </h3>

        {/* Role Pill with Craft Icon (Exact style from reference/About Us Profile .png) */}
        <div
          className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-medium tracking-wide shadow-sm"
          style={{ color: theme.primaryHex }}
        >
          <CraftIcon name={theme.craftIconName} className="w-3.5 h-3.5" />
          <span>{member.classRole}</span>
        </div>

        {/* Class Grade & Student Attendance Number Pill */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-brand-sand/80 uppercase">
          <span>Class {member.classGrade}</span>
          <span>•</span>
          <span>Absen {member.studentNo}</span>
        </div>

        {/* Botanical Latin Classification (Subtle 1-line detail) */}
        <p className="text-xs font-serif italic text-brand-sand/80 pt-0.5">
          {theme.scientificName} <span className="text-[10px] font-mono not-italic text-brand-sand/50">({theme.plantFamily})</span>
        </p>

        {/* Personal Craft Quote */}
        {member.quote && member.quote.trim().length > 0 ? (
          <p className="font-serif italic text-xs text-brand-sand/90 leading-relaxed max-w-xs px-2 py-1">
            &ldquo;{member.quote}&rdquo;
          </p>
        ) : null}

        {/* Bottom Contact Slots: Clickable Instagram & Phone */}
        <div className="w-full pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Instagram Slot */}
          <a
            href={member.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl glass-pill hover:bg-white/10 text-brand-sand/85 hover:text-white transition-all group/link"
            title={`Open ${member.instagram} on Instagram`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
            <span className="font-mono text-[11px] truncate">{member.instagram}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity ml-1" />
          </a>

          {/* Phone Slot */}
          <a
            href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl glass-pill hover:bg-white/10 text-brand-sand/85 hover:text-white transition-all group/phone"
            title={`Call ${member.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="font-mono text-[11px] truncate">{member.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
