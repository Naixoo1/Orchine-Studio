'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudioHeader } from '@/components/layout/StudioHeader';
import { BotanicalAtmosphere } from '@/components/about/BotanicalAtmosphere';
import { ClassEmblemCenter } from '@/components/about/ClassEmblemCenter';
import { ThemedProfileCard } from '@/components/about/ThemedProfileCard';
import { ConstellationVines } from '@/components/about/ConstellationVines';
import { BotanicalSpecimenGallery } from '@/components/about/BotanicalSpecimenGallery';
import { TEAM_MEMBERS, BotanicalThemeSlug, BOTANICAL_THEMES } from '@/data/team';
import {
  ArrowLeft,
  Shield,
  Leaf,
  Droplets,
  Sun,
  Flame,
  Layers,
  Compass,
} from 'lucide-react';

export default function AboutUsPage() {
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState<BotanicalThemeSlug | null>(null);

  // Split into left 2 profiles and right 2 profiles around the central class emblem
  const leftProfiles = [TEAM_MEMBERS[0], TEAM_MEMBERS[1]]; // Indigo, Eucalyptus
  const rightProfiles = [TEAM_MEMBERS[2], TEAM_MEMBERS[3]]; // Fern, Oak

  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#181232] via-[#221D63] to-[#120D22] text-[#FFF2B1] select-none relative overflow-x-hidden">
      {/* 1. Atelier Top Header (Synchronized across all pages) */}
      <StudioHeader variant="solid" />

      {/* 2. Living Botanical Eco-Print Atmosphere (Spores, Pollen, Leaf Veins & Elemental Ambient Glows) */}
      <BotanicalAtmosphere activeTheme={activeTheme} />

      {/* 3. Main Page Content Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full relative z-10">
        
        {/* Navigation Breadcrumb / Return Trigger */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 border-b border-white/10 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-brand-sand/70 hover:text-botanical-marigold transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Atelier</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-botanical-marigold animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-botanical-marigold uppercase">
              Cohort 11.2 • YOSUKA Atelier
            </span>
          </div>
        </div>

        {/* Page Title & Editorial Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-botanical-marigold/30 text-botanical-marigold text-xs font-mono uppercase tracking-widest mb-4 shadow-lg">
            <Shield className="w-3.5 h-3.5" />
            <span>Botanical Artisans & Engineering Collective</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-luxury leading-tight mb-4">
            Imprinted by Nature,
            <br />
            <span className="italic font-light text-brand-sand">Engineered by Us</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-brand-sand/85 font-serif leading-relaxed max-w-2xl mx-auto px-2">
            Meet the four distinctive personas behind Orchiné Studio. Rooted in the living chemistry of botanical eco-print textiles, each artisan commands a natural element — synthesized into procedural WebGL physics and conversational AI.
          </p>

          {/* Interactive Botanical Theme Quick-Selector Filter */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTheme(null)}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTheme === null
                  ? 'bg-white/20 border-white text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-brand-sand/70 hover:text-white'
              }`}
            >
              All 4 Personas
            </button>

            <button
              onClick={() => setActiveTheme(activeTheme === 'indigo' ? null : 'indigo')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTheme === 'indigo'
                  ? 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'bg-white/5 border-white/10 text-brand-sand/70 hover:text-sky-300'
              }`}
            >
              <Droplets className="w-3 h-3 text-sky-400" />
              <span>Fermented Indigo</span>
            </button>

            <button
              onClick={() => setActiveTheme(activeTheme === 'eucalyptus' ? null : 'eucalyptus')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTheme === 'eucalyptus'
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  : 'bg-white/5 border-white/10 text-brand-sand/70 hover:text-emerald-300'
              }`}
            >
              <Sun className="w-3 h-3 text-emerald-400" />
              <span>Silver Dollar Eucalyptus</span>
            </button>

            <button
              onClick={() => setActiveTheme(activeTheme === 'fern' ? null : 'fern')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTheme === 'fern'
                  ? 'bg-teal-500/25 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 border-white/10 text-brand-sand/70 hover:text-teal-300'
              }`}
            >
              <Leaf className="w-3 h-3 text-teal-400" />
              <span>Sword Fern</span>
            </button>

            <button
              onClick={() => setActiveTheme(activeTheme === 'oak' ? null : 'oak')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTheme === 'oak'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-white/5 border-white/10 text-brand-sand/70 hover:text-amber-300'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Iron Oak Gall</span>
            </button>
          </div>
        </div>

        {/* 4. The 2×2 Radial Constellation Surrounding Central Class Logo */}
        <div className="relative mb-16">
          {/* SVG Animated Vine Connector Canvas (Visible on Desktop) */}
          <ConstellationVines activeTheme={activeTheme} />

          {/* Responsive 3-Column Radial Constellation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Wing: 2 Profile Cards (Member 1: Indigo & Member 2: Eucalyptus) */}
            <div className="lg:col-span-4 space-y-8 flex flex-col order-2 lg:order-1">
              {leftProfiles.map((member) => (
                <ThemedProfileCard
                  key={member.id}
                  member={member}
                  isFocused={activeTheme === member.themeSlug}
                  onHover={(slug) => setActiveTheme(slug)}
                />
              ))}
            </div>

            {/* Center Wing: The Grand Procedural Class Emblem (11.2 - YOSUKA) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 my-4 lg:my-0">
              <ClassEmblemCenter
                activeTheme={activeTheme}
                onHoverTheme={(slug) => setActiveTheme(slug as BotanicalThemeSlug | null)}
              />
            </div>

            {/* Right Wing: 2 Profile Cards (Member 3: Sword Fern & Member 4: Iron Oak) */}
            <div className="lg:col-span-4 space-y-8 flex flex-col order-3">
              {rightProfiles.map((member) => (
                <ThemedProfileCard
                  key={member.id}
                  member={member}
                  isFocused={activeTheme === member.themeSlug}
                  onHover={(slug) => setActiveTheme(slug)}
                />
              ))}
            </div>

          </div>
        </div>

        {/* 5. Living Plantation Reference Herbarium Gallery (Visual Details, No Essay Text) */}
        <BotanicalSpecimenGallery />
      </div>
    </main>
  );
}
