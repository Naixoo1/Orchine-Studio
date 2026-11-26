'use client';

import React from 'react';
import Image from 'next/image';
import { CLASS_INFO } from '@/data/team';
import { GraduationCap, Shield, Award, Compass } from 'lucide-react';

interface ClassEmblemCenterProps {
  activeTheme: string | null;
  onHoverTheme?: (theme: string | null) => void;
}

export function ClassEmblemCenter({ activeTheme, onHoverTheme }: ClassEmblemCenterProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 z-20">
      {/* Outer Ethereal Glow Pulse */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-botanical-marigold/15 via-pink-500/10 to-emerald-500/15 blur-[60px] pointer-events-none animate-pulse" />

      {/* Main Glass Emblem Disc */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-[2.5rem] glass-panel bg-gradient-to-b from-[#1F143D]/95 via-[#160E2C]/98 to-[#0E091D]/98 border-2 border-botanical-marigold/40 p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_0_60px_rgba(212,155,66,0.18)] overflow-hidden group transition-all duration-500 hover:border-botanical-marigold/70 hover:shadow-[0_0_80px_rgba(212,155,66,0.25)]">
        
        {/* Ornate Atelier Brass Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-botanical-marigold/60 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-botanical-marigold/60 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-botanical-marigold/60 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-botanical-marigold/60 rounded-br-2xl pointer-events-none" />

        {/* Dynamic Botanical Halo: Rotating Rings */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 rounded-full flex items-center justify-center p-3 bg-gradient-to-tr from-botanical-marigold/20 via-pink-500/15 to-emerald-500/20 border border-botanical-marigold/50 shadow-2xl group-hover:scale-105 transition-transform duration-500">
          
          {/* Outer Dashed Orbit */}
          <div
            className="absolute inset-[-6px] rounded-full border border-dashed border-botanical-marigold/40 pointer-events-none"
            style={{ animation: 'orbitSlow 24s linear infinite' }}
          />

          {/* Inner Counter-Rotating Ring */}
          <div
            className="absolute inset-1 rounded-full border border-dotted border-pink-400/30 pointer-events-none"
            style={{ animation: 'orbitSlowReverse 18s linear infinite' }}
          />

          {/* Central Logo Container */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <Image
              src={CLASS_INFO.badgeUrl}
              alt={CLASS_INFO.className}
              width={120}
              height={120}
              priority
              className="block w-full h-full object-contain drop-shadow-[0_0_24px_rgba(187,154,239,0.45)] transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* 4 Cardinal Mini Leaf Orbs on Ring (Representing the 4 eco-dyes) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" title="Indigo" />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" title="Eucalyptus" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#10b981]" title="Fern" />
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" title="Oak" />
        </div>

        {/* Cohort Year & School Capsule */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-botanical-marigold/15 border border-botanical-marigold/40 text-[10px] font-mono tracking-widest uppercase text-botanical-marigold mb-2.5">
          <GraduationCap className="w-3.5 h-3.5 text-botanical-marigold" />
          <span>{CLASS_INFO.year}</span>
        </div>

        {/* Class Emblem Name: "11.2" */}
        <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-luxury font-medium mb-1 drop-shadow-sm">
          {CLASS_INFO.className}
        </h2>

        {/* School Name: YOSUKA */}
        <h3 className="font-sans text-[11px] sm:text-xs tracking-widest uppercase text-brand-sand font-medium mb-2.5">
          {CLASS_INFO.school}
        </h3>

        {/* Delicate Golden Separator */}
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-botanical-marigold/60 to-transparent my-1.5" />

        {/* Class Motto */}
        <p className="font-serif italic text-xs text-botanical-marigold/95 mb-3 px-2 leading-relaxed">
          &ldquo;{CLASS_INFO.motto}&rdquo;
        </p>

        {/* Cohort Narrative */}
        <p className="text-[11px] text-brand-sand/75 font-light leading-relaxed mb-4 px-1">
          {CLASS_INFO.description}
        </p>

        {/* Bottom Metadata Badges */}
        <div className="w-full pt-3.5 border-t border-white/10 flex items-center justify-around text-[10px] font-mono uppercase tracking-widest text-brand-sand/65">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-botanical-marigold" />
            <span>4 Personas</span>
          </span>
          <span>•</span>
          <span className="text-botanical-marigold">Eco-Print</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Compass className="w-3 h-3 text-botanical-marigold" />
            <span>Interactive</span>
          </span>
        </div>
      </div>
    </div>
  );
}
