'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import { SettingsDrawer } from '@/components/settings/SettingsDrawer';

interface StudioHeaderProps {
  variant?: 'solid' | 'transparent';
  showNavMenu?: boolean;
}

export function StudioHeader({ variant = 'solid', showNavMenu = true }: StudioHeaderProps) {
  const pathname = usePathname();
  const openSettings = useStudioStore((state) => state.openSettings);

  return (
    <>
      <header
        className={`w-full z-40 transition-colors duration-300 ${
          variant === 'solid'
            ? 'bg-gradient-to-r from-[#221D63]/95 via-[#373191]/90 to-[#341F5F]/95 shadow-lg border-b border-[#BB9AEF]/20 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between">
          {/* Left: Hamburger Menu (if showNavMenu) + Orchiné Studio Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {showNavMenu && (
              <button
                onClick={openSettings}
                className="p-1.5 rounded-xl hover:bg-white/10 text-[#FFF2B1]/80 hover:text-white transition-all group focus:outline-none cursor-pointer"
                aria-label="Open Directory and Settings Menu"
                title="Directory & Settings"
              >
                <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
              </button>
            )}

            <Link href="/studio" className="flex items-center space-x-2 group focus:outline-none" title="Orchiné Studio • Lobby">
              <div className="relative h-9 sm:h-11 w-40 sm:w-52 flex items-center">
                <Image
                  src="/brand/orchine-header-logo-transparent.png"
                  alt="Orchiné Studio"
                  width={420}
                  height={195}
                  priority
                  className="object-contain h-full w-auto drop-shadow-sm group-hover:brightness-110 transition-all"
                />
              </div>
            </Link>
          </div>

          {/* Right: 3D Store Vitrine Icon Feature & Orchid Icon Link for Dedicated About Us Page */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* 3D Store Glass Vitrine Icon Link (Replaces 3D Store text option) */}
            <Link
              href="/store"
              className={`p-1 sm:p-1.5 rounded-2xl transition-all group focus:outline-none relative flex items-center justify-center ${
                pathname === '/store'
                  ? 'bg-white/20 ring-1 ring-white/40 shadow-inner'
                  : 'hover:bg-white/10'
              }`}
              aria-label="Open 3D Interactive Store & Procedural Silk Simulation"
              title="3D Store • Interactive Silk Drape Model"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                {/* Ambient glass vitrine aura on hover */}
                <span className="absolute inset-0 rounded-full bg-[#BB9AEF]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src="/brand/3d-store-icon.png"
                  alt="3D Store Vitrine"
                  width={48}
                  height={48}
                  priority
                  className="object-contain w-full h-full transform group-hover:scale-110 transition-transform drop-shadow"
                />
                {/* High-fashion micro 3D badge pill */}
                <span className="absolute -bottom-0.5 -right-0.5 px-1 py-[0.5px] rounded-[4px] bg-[#BB9AEF] text-[7.5px] font-mono font-bold text-[#140E26] shadow-md leading-none tracking-tight">
                  3D
                </span>
              </div>
            </Link>

            {/* About Us Orchid Flower Icon Link */}
            <Link
              href="/about"
              className={`p-1 sm:p-1.5 rounded-2xl transition-all group focus:outline-none relative flex items-center justify-center ${
                pathname === '/about'
                  ? 'bg-white/20 ring-1 ring-white/40 shadow-inner'
                  : 'hover:bg-white/10'
              }`}
              aria-label="Open About Us Team & Class Details"
              title="About Us • The Atelier Team"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                {/* Ambient petal aura on hover */}
                <span className="absolute inset-0 rounded-full bg-pink-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src="/brand/orchid-flower-transparent.png"
                  alt="About Us Orchid"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full transform group-hover:scale-110 transition-transform drop-shadow"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Settings & Navigation Drawer */}
      <SettingsDrawer />
    </>
  );
}
