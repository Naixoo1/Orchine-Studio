'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudioStore } from '@/store/useStudioStore';
import { SettingsDrawer } from '@/components/settings/SettingsDrawer';

export default function LandingPage() {
  const router = useRouter();
  const openSettings = useStudioStore((state) => state.openSettings);

  const handleClickEnter = () => {
    router.push('/lobby');
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#242D49] via-[#241A3E] to-[#140E26] select-none overflow-hidden">
      {/* 1. Multi-Accent Botanical Atmosphere (Spec 4.1 & 4.2 Non-Colliding Nike Art Direction) */}
      <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
        {/* Central Blossom Orchid (#FFC8DD) & Lavender (#BB9AEF) Halo */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-[#FFC8DD]/16 via-[#BB9AEF]/14 to-transparent blur-[140px] animate-pulse"
          style={{ animationDuration: '8s' }}
        />

        {/* Bottom-Left: Warm Peach (#FF9E69) & Warm Cream (#FFF2B1) Solar Dye Accent */}
        <div
          className="absolute -bottom-16 -left-16 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#FF9E69]/14 via-[#FFF2B1]/10 to-transparent blur-[130px]"
        />

        {/* Top-Right: Royal Orchid Violet (#582E8B) & Indigo Twilight (#373191) */}
        <div
          className="absolute -top-16 -right-16 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-[#582E8B]/22 via-[#373191]/18 to-transparent blur-[140px]"
        />

        {/* Center-Bottom: Slate Blue (#485C91) & Atelier Plum (#341F5F) Foundation Ground */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[540px] h-[280px] rounded-full bg-gradient-to-r from-[#485C91]/22 via-[#341F5F]/22 to-[#485C91]/22 blur-[110px]"
        />

        {/* Edge Vignette: Deep contrast perimeter ensuring zero collision with UI controls */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/45" />

        {/* Floating Spores in the 4 Spec Accents */}
        <span
          className="absolute top-[22%] left-[16%] w-1.5 h-1.5 rounded-full bg-[#FFF2B1]/70 shadow-[0_0_8px_#FFF2B1] animate-ping"
          style={{ animationDuration: '4.5s' }}
        />
        <span
          className="absolute top-[68%] left-[24%] w-2 h-2 rounded-full bg-[#FFC8DD]/70 shadow-[0_0_10px_#FFC8DD] animate-pulse"
          style={{ animationDuration: '5.5s' }}
        />
        <span
          className="absolute top-[28%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#BB9AEF]/70 shadow-[0_0_8px_#BB9AEF] animate-ping"
          style={{ animationDuration: '5s' }}
        />
        <span
          className="absolute top-[76%] right-[22%] w-2 h-2 rounded-full bg-[#FF9E69]/70 shadow-[0_0_10px_#FF9E69] animate-pulse"
          style={{ animationDuration: '6.5s' }}
        />
      </div>

      {/* 2. Top Header Bar (Anchored to reference/LandingPage.png) */}
      <header className="w-full z-20 px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Top-Left: 3-line hamburger menu icon matching LandingPage.png */}
        <button
          onClick={openSettings}
          className="p-2 sm:p-2.5 rounded-2xl hover:bg-white/10 transition-all text-white/90 hover:text-white focus:outline-none cursor-pointer group"
          aria-label="Open Atelier Directory"
          title="Directory & Settings"
        >
          <div className="space-y-1.5 w-6 sm:w-7 flex flex-col justify-center">
            <span className="block w-full h-[2.5px] bg-white rounded-full group-hover:scale-x-105 transition-transform" />
            <span className="block w-full h-[2.5px] bg-white rounded-full group-hover:scale-x-105 transition-transform" />
            <span className="block w-full h-[2.5px] bg-white rounded-full group-hover:scale-x-105 transition-transform" />
          </div>
        </button>

        {/* Top-Right: 3D Store Vitrine Icon Feature & Orchid About Us Icon */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* 3D Store Glass Vitrine Icon Link */}
          <Link
            href="/store"
            className="p-1 sm:p-1.5 rounded-2xl hover:bg-white/10 transition-all group focus:outline-none cursor-pointer relative flex items-center justify-center"
            aria-label="3D Interactive Store & Procedural Silk Simulation"
            title="3D Store • Interactive Silk Drape Model"
          >
            <span className="absolute inset-0 rounded-full bg-[#BB9AEF]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <Image
                src="/brand/3d-store-icon.png"
                alt="3D Store Vitrine"
                width={56}
                height={56}
                priority
                className="object-contain w-full h-full transform group-hover:scale-110 transition-transform drop-shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 px-1 py-[0.5px] rounded-[4px] bg-[#BB9AEF] text-[7.5px] font-mono font-bold text-[#140E26] shadow-md leading-none tracking-tight">
                3D
              </span>
            </div>
          </Link>

          {/* Orchid Icon Link for Dedicated About Us Page */}
          <Link
            href="/about"
            className="p-1 sm:p-1.5 rounded-2xl hover:bg-white/10 transition-all group focus:outline-none cursor-pointer relative flex items-center justify-center"
            aria-label="About Us"
            title="About Us • The Atelier Team & Cohort 11.2"
          >
            <span className="absolute inset-0 rounded-full bg-pink-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <Image
                src="/brand/orchid-flower-transparent.png"
                alt="About Us Orchid"
                width={56}
                height={56}
                priority
                className="object-contain w-full h-full transform group-hover:scale-110 transition-transform drop-shadow-md"
              />
            </div>
          </Link>
        </div>
      </header>

      {/* 3. Center Stage: Exact Replica of LandingPage.png with Botanical Depth */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 max-h-full z-10">
        {/* Large Centered Logo: Orchiné Studio (Padded Uncropped 950x445) */}
        <div className="relative w-full max-w-[320px] sm:max-w-[500px] md:max-w-[640px] lg:max-w-[740px] aspect-[950/445] max-h-[40vh] flex items-center justify-center mb-8 sm:mb-12 animate-in zoom-in-95 duration-500">
          <Image
            src="/brand/orchine-studio-title.png"
            alt="Orchiné Studio"
            fill
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* The Famous "CLICK" Pill Button with Organic Botanical Tactile Feedback */}
        <button
          onClick={handleClickEnter}
          className="relative px-10 sm:px-14 py-3 sm:py-4 rounded-full bg-white text-[#2B3B68] font-bold text-lg sm:text-2xl tracking-wider shadow-2xl hover:scale-105 active:scale-95 hover:bg-white/95 hover:shadow-white/30 transition-all duration-300 cursor-pointer focus:outline-none animate-in fade-in slide-in-from-bottom-6 duration-700 font-sans group overflow-hidden"
        >
          {/* Subtle internal sheen on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-pink-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10">CLICK</span>
        </button>

        {/* Cohort Provenance Micro-Label */}
        <div className="mt-8 flex items-center space-x-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
          <span>Botanical Eco-Print Scarves • Cohort 11.2</span>
        </div>
      </div>

      {/* Subtle Bottom Spacer */}
      <div className="h-6 sm:h-10 w-full" />

      {/* Global Settings & Navigation Drawer */}
      <SettingsDrawer />
    </main>
  );
}
