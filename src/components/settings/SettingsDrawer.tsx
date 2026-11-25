'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '@/store/useStudioStore';
import {
  X,
  Compass,
  Moon,
  Sun,
  User,
  Award,
  ExternalLink,
  Check,
  ShieldCheck,
  Palette,
  Layers,
  ArrowRight,
  Leaf,
  Flower2,
  Users,
} from 'lucide-react';

export function SettingsDrawer() {
  const pathname = usePathname();
  const isSettingsOpen = useStudioStore((state) => state.isSettingsOpen);
  const closeSettings = useStudioStore((state) => state.closeSettings);
  const activePassportData = useStudioStore((state) => state.activePassportData);
  const settings = useStudioStore((state) => state.settings);
  const updateSettings = useStudioStore((state) => state.updateSettings);

  const activeSerial = activePassportData?.batchNumber || '#0000';

  const navigationItems = [
    {
      href: '/',
      title: 'Landing Page',
      subtitle: 'Welcome stage & portal',
      icon: Leaf,
      badge: 'Opening',
    },
    {
      href: '/studio',
      title: 'Atelier Lobby',
      subtitle: 'Hero video ad, collection & craft',
      icon: Layers,
      badge: 'Lobby',
    },
    {
      href: '/store',
      title: '3D Interactive Store',
      subtitle: 'Procedural silk cloth & purchase',
      icon: Compass,
      image: '/brand/3d-store-icon.png',
      badge: '3D Canvas',
    },
    {
      href: '/passport',
      title: '3D Signature Card',
      subtitle: 'Full-page Digital Eco-Passport',
      icon: Award,
      badge: activeSerial,
    },
    {
      href: '/lobby',
      title: 'Orchéllia Voice Lobby',
      subtitle: 'Voice companion greeting stage',
      icon: Flower2,
      badge: 'Voice',
    },
    {
      href: '/about',
      title: 'About Us • The Creators',
      subtitle: 'Cohort 11.2 & YOSUKA collective',
      icon: Users,
      image: '/brand/orchid-flower-transparent.png',
      badge: 'Cohort 11.2',
    },
  ];

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex select-none">
          {/* 1. Backdrop Overlay with Smooth Blur Dissolve */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={closeSettings}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl -z-10"
            aria-hidden="true"
          />

          {/* 2. Slide-Over Editorial Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 32,
              mass: 0.85,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md h-full bg-[#221D63]/95 text-[#FFF2B1] border-r border-[#BB9AEF]/20 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl scrollbar-thin scrollbar-thumb-white/10"
            role="dialog"
            aria-modal="true"
            aria-label="Atelier Directory and Settings"
          >
            {/* Ambient Background Gradient Orb in Royal Orchid Violet #582E8B */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#582E8B]/25 via-[#BB9AEF]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10">
              {/* Header: Branding, Title & Close Button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#582E8B]/40 to-[#BB9AEF]/20 border border-[#BB9AEF]/40 flex items-center justify-center shadow-[0_0_15px_rgba(187,154,239,0.3)] flex-shrink-0">
                    <Compass className="w-5 h-5 text-[#BB9AEF] animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg tracking-luxury uppercase text-[#FFF2B1] leading-tight">
                      Atelier Directory
                    </h2>
                    <span className="text-[10px] font-mono tracking-widest text-[#BB9AEF] uppercase">
                      Settings & Navigation
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeSettings}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-brand-sand/70 hover:text-white transition-all flex items-center justify-center active:scale-90 cursor-pointer"
                  aria-label="Close Settings Drawer"
                  title="Close Directory"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Section 1: Navigation Directory */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-sand/50">
                    Atelier Pages
                  </span>
                  <span className="text-[9px] font-mono text-botanical-marigold/80 tracking-widest uppercase">
                    6 Destinations
                  </span>
                </div>

                <nav className="space-y-2.5" aria-label="Atelier Navigation Links">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSettings}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group relative border ${
                          isActive
                            ? 'bg-botanical-marigold/15 border-botanical-marigold/60 shadow-[0_0_20px_rgba(212,155,66,0.15)] text-white'
                            : 'glass-panel bg-white/[0.03] border-white/10 hover:border-botanical-marigold/40 hover:bg-white/[0.07] text-brand-sand/90'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 p-1 ${
                              isActive
                                ? 'bg-botanical-marigold/20 border border-botanical-marigold/40 text-botanical-marigold'
                                : 'bg-white/5 border border-white/10 text-brand-sand/70 group-hover:text-botanical-marigold'
                            }`}
                          >
                            {item.image ? (
                              <div className="relative w-6 h-6 flex items-center justify-center">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={24}
                                  height={24}
                                  className="object-contain w-full h-full drop-shadow"
                                />
                              </div>
                            ) : (
                              <item.icon className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-serif text-sm tracking-wide transition-colors truncate block ${
                                  isActive
                                    ? 'text-botanical-marigold font-medium'
                                    : 'text-white group-hover:text-botanical-marigold'
                                }`}
                              >
                                {item.title}
                              </span>
                              {isActive && (
                                <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase bg-botanical-marigold text-brand-noir font-bold">
                                  Current
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-brand-sand/60 font-light truncate block">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        <ArrowRight
                          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                            isActive
                              ? 'text-botanical-marigold translate-x-0'
                              : 'text-brand-sand/40 group-hover:text-botanical-marigold group-hover:translate-x-1'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Section 2: User Profile Settings */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-sand/50">
                    Visitor Persona
                  </span>
                  <div className="flex items-center space-x-1 text-[9px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Auto-Saved</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-panel bg-white/[0.02] border border-white/10 space-y-3.5">
                  <div>
                    <label className="text-xs text-brand-sand/80 font-medium flex items-center space-x-1.5 mb-1.5">
                      <User className="w-3.5 h-3.5 text-botanical-marigold" />
                      <span>Username</span>
                    </label>
                    <input
                      type="text"
                      value={settings.username}
                      onChange={(e) => updateSettings({ username: e.target.value })}
                      placeholder="e.g. SilkTraveler"
                      className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold/80 focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3.5 text-xs text-white placeholder:text-brand-sand/30 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-brand-sand/80 font-medium flex items-center space-x-1.5 mb-1.5">
                      <Award className="w-3.5 h-3.5 text-botanical-marigold" />
                      <span>Real Name (for Eco-Passport COA)</span>
                    </label>
                    <input
                      type="text"
                      value={settings.realName}
                      onChange={(e) => updateSettings({ realName: e.target.value })}
                      placeholder="e.g. Atelier Guest"
                      className="w-full bg-[#18112C] border border-white/15 focus:border-botanical-marigold/80 focus:ring-1 focus:ring-botanical-marigold/50 rounded-xl py-2 px-3.5 text-xs text-white placeholder:text-brand-sand/30 focus:outline-none transition-all"
                    />
                  </div>

                  <Link
                    href="/passport"
                    onClick={closeSettings}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-neutral-700 hover:border-neutral-500 text-xs font-mono text-neutral-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Open 3D Signature Card ({activeSerial})</span>
                  </Link>
                </div>
              </div>

              {/* Section 3: Atelier Theme Mode */}
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-sand/50 block mb-3">
                  Atmospheric Mode
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {/* Dark Mode Card */}
                  <button
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`p-3.5 rounded-2xl flex flex-col justify-between transition-all duration-200 border relative group cursor-pointer text-left ${
                      settings.theme === 'dark'
                        ? 'bg-gradient-to-b from-[#25154D]/90 to-[#18112C]/90 border-botanical-marigold shadow-lg ring-1 ring-botanical-marigold/40'
                        : 'glass-panel bg-white/[0.02] border-white/10 text-brand-sand/70 hover:bg-white/[0.05]'
                    }`}
                  >
                    {settings.theme === 'dark' && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-botanical-marigold text-brand-noir flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-3 text-purple-300">
                      <Moon className="w-4 h-4 text-botanical-marigold" />
                    </div>
                    <div>
                      <span className="font-serif text-xs text-white block">Dark Mode</span>
                      <span className="text-[10px] text-brand-sand/60 font-light block">
                        Nocturnal Violet
                      </span>
                    </div>
                  </button>

                  {/* Light Mode Card */}
                  <button
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`p-3.5 rounded-2xl flex flex-col justify-between transition-all duration-200 border relative group cursor-pointer text-left ${
                      settings.theme === 'light'
                        ? 'bg-gradient-to-b from-[#FAF7F2]/90 to-[#EAE4D8]/90 border-botanical-marigold text-[#25154D] shadow-lg ring-1 ring-botanical-marigold/40'
                        : 'glass-panel bg-white/[0.02] border-white/10 text-brand-sand/70 hover:bg-white/[0.05]'
                    }`}
                  >
                    {settings.theme === 'light' && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-botanical-marigold text-brand-noir flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <div className="w-7 h-7 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center mb-3 text-yellow-300">
                      <Sun className="w-4 h-4 text-yellow-300" />
                    </div>
                    <div>
                      <span
                        className={`font-serif text-xs block ${
                          settings.theme === 'light' ? 'text-[#25154D] font-medium' : 'text-white'
                        }`}
                      >
                        Light Mode
                      </span>
                      <span
                        className={`text-[10px] font-light block ${
                          settings.theme === 'light' ? 'text-[#25154D]/70' : 'text-brand-sand/60'
                        }`}
                      >
                        Botanical Silk
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Specifications & Status */}
            <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between text-[10px] text-brand-sand/50 font-mono tracking-widest uppercase">
              <span>ORCHINÉ ATELIER v1.4</span>
              <span>SOL VOICE READY</span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
