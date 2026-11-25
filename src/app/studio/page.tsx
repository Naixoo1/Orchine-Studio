'use client';

import React from 'react';
import Link from 'next/link';
import { StudioHeader } from '@/components/layout/StudioHeader';
import { StudioAtmosphere } from '@/components/layout/StudioAtmosphere';
import { StaticCohortBanner } from '@/components/layout/StaticCohortBanner';
import { HeroStage } from '@/components/hero/HeroStage';
import { CollectionSpotlight } from '@/components/collection/CollectionSpotlight';
import { FeatureQuickNav } from '@/components/navigation/FeatureQuickNav';
import { CraftLab } from '@/components/craft/CraftLab';
import { LookbookGrid } from '@/components/lookbook/LookbookGrid';
import { OrchelliaPet } from '@/components/orchellia/OrchelliaPet';
import { SlideOverBag } from '@/components/cart/SlideOverBag';

export default function StudioPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col bg-[#181232] text-[#FFF2B1] selection:bg-[#BB9AEF] selection:text-[#221D63] overflow-x-hidden">
      {/* 0. Nike-Inspired Non-Colliding Multi-Accent Atmospheric Canvas (Spec 4.1 & 4.2) */}
      <StudioAtmosphere />

      {/* 1. Static Cohort Banner (Class Emblem & Teammate Credits) */}
      <StaticCohortBanner />

      {/* 2. Unified Studio Header (Centered Logo, 3-Line Menu Left, Orchid Right) */}
      <StudioHeader variant="solid" />

      {/* 3. Hero Stage: Dual-Mode Cinematic Film ⟷ 3D Canvas (Scroll-Linked Parallax) */}
      <HeroStage />

      {/* 4. Collection Spotlight (Nike ID-Style Horizontal Snap Tray + Botanical Swatch Selector) */}
      <CollectionSpotlight />

      {/* 5. Studio Navigation & Feature Quick-Jumps (Streamlined) */}
      <FeatureQuickNav />

      {/* 6. Craft Lab & Natural Formulation (2.5× Macro Loupe + 4 Launch Models) */}
      <CraftLab />

      {/* 7. Editorial Lookbook ("Styled in Nature" Masonry Grid + Interactive Radar Pins) */}
      <LookbookGrid />

      {/* 8. Living Orchid Pet Companion & ChatGPT-Style Dock Pill */}
      <OrchelliaPet />

      {/* 9. Slide-Over Shopping Bag Drawer + Digital Eco-Passport COA */}
      <SlideOverBag />

      {/* 10. Editorial Botanical Footer */}
      <footer className="w-full border-t border-[#BB9AEF]/15 bg-[#1A164E]/90 py-16 px-6 md:px-12 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Manifesto Column */}
          <div className="max-w-md">
            <span className="font-serif text-2xl uppercase tracking-luxury text-[#FFF2B1] block mb-3">
              Orchiné Studio
            </span>
            <p className="text-xs text-[#FFF2B1]/70 font-light leading-relaxed">
              An atelier dedicated to the fugitive pigments of leaves, bark, and mineral waters. Each scarf is steamed on 100% organic silk habotai in limited batches of 100 or fewer. Imprinted by nature, never repeated.
            </p>
            <span className="text-[10px] font-mono text-[#BB9AEF] tracking-widest uppercase block mt-4">
              Botanical Eco-Print Scarves • Multi-Page Atelier Suite
            </span>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-[#FFF2B1]/70">
            <div>
              <span className="font-serif text-sm uppercase tracking-luxury text-[#FFF2B1] block mb-3">
                Navigation
              </span>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-botanical-marigold transition-colors">
                    Landing Page
                  </Link>
                </li>
                <li>
                  <Link href="/studio" className="hover:text-botanical-marigold transition-colors">
                    Atelier Lobby
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="hover:text-botanical-marigold transition-colors text-white font-medium flex items-center space-x-1">
                    <span>✦ 3D Interactive Store</span>
                  </Link>
                </li>
                <li>
                  <Link href="/lobby" className="hover:text-botanical-marigold transition-colors">
                    Orchéllia Voice Lobby
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-botanical-marigold transition-colors flex items-center space-x-1.5 text-botanical-marigold/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-botanical-marigold animate-pulse" />
                    <span>About Us & Cohort 11.2</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-serif text-sm uppercase tracking-luxury text-white block mb-3">
                Alchemy
              </span>
              <ul className="space-y-2">
                <li>
                  <a href="#craft" className="hover:text-botanical-marigold transition-colors">
                    Cedar Steaming
                  </a>
                </li>
                <li>
                  <a href="#craft" className="hover:text-botanical-marigold transition-colors">
                    Fermented Indigo
                  </a>
                </li>
                <li>
                  <a href="#craft" className="hover:text-botanical-marigold transition-colors">
                    Oak Gall Tannins
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-serif text-sm uppercase tracking-luxury text-white block mb-3">
                Provenance
              </span>
              <p className="text-[11px] leading-relaxed text-brand-sand/60">
                Crafted in small botanical batches. 100% biodegradable and chemical-free.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-sand/40">
          <span>&copy; {new Date().getFullYear()} Orchiné Studio. All rights reserved.</span>
          <span className="font-mono text-[10px] text-botanical-marigold tracking-widest uppercase mt-2 sm:mt-0">
            Imprinted by Nature
          </span>
        </div>
      </footer>
    </main>
  );
}
