'use client';

import React from 'react';
import { BotanicalThemeSlug } from '@/data/team';

interface ConstellationVinesProps {
  activeTheme: BotanicalThemeSlug | null;
}

export function ConstellationVines({ activeTheme }: ConstellationVinesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block -z-5 overflow-visible">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient: Center to Top-Left (Indigo) */}
          <linearGradient id="vineIndigo" x1="50%" y1="50%" x2="20%" y2="25%">
            <stop offset="0%" stopColor="#BB9AEF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
          </linearGradient>

          {/* Gradient: Center to Bottom-Left (Eucalyptus) */}
          <linearGradient id="vineEucalyptus" x1="50%" y1="50%" x2="20%" y2="75%">
            <stop offset="0%" stopColor="#BB9AEF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
          </linearGradient>

          {/* Gradient: Center to Top-Right (Fern) */}
          <linearGradient id="vineFern" x1="50%" y1="50%" x2="80%" y2="25%">
            <stop offset="0%" stopColor="#BB9AEF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
          </linearGradient>

          {/* Gradient: Center to Bottom-Right (Oak) */}
          <linearGradient id="vineOak" x1="50%" y1="50%" x2="80%" y2="75%">
            <stop offset="0%" stopColor="#BB9AEF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="vineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Vine to Top-Left (Member 1: Indigo) */}
        <path
          d="M 520 400 C 430 360, 320 300, 240 220"
          stroke="url(#vineIndigo)"
          strokeWidth={activeTheme === 'indigo' ? '3' : '1.5'}
          strokeDasharray="6 4"
          filter="url(#vineGlow)"
          className="transition-all duration-500 opacity-60"
        />
        {/* Animated Spore Sap Pulse */}
        <circle cx="360" cy="300" r={activeTheme === 'indigo' ? '4' : '2.5'} fill="#38BDF8" className="animate-ping" style={{ animationDuration: '3s' }} />

        {/* 2. Vine to Bottom-Left (Member 2: Eucalyptus) */}
        <path
          d="M 520 420 C 430 460, 320 520, 240 600"
          stroke="url(#vineEucalyptus)"
          strokeWidth={activeTheme === 'eucalyptus' ? '3' : '1.5'}
          strokeDasharray="6 4"
          filter="url(#vineGlow)"
          className="transition-all duration-500 opacity-60"
        />
        <circle cx="360" cy="520" r={activeTheme === 'eucalyptus' ? '4' : '2.5'} fill="#34D399" className="animate-ping" style={{ animationDuration: '3.5s' }} />

        {/* 3. Vine to Top-Right (Member 3: Sword Fern) */}
        <path
          d="M 680 400 C 770 360, 880 300, 960 220"
          stroke="url(#vineFern)"
          strokeWidth={activeTheme === 'fern' ? '3' : '1.5'}
          strokeDasharray="6 4"
          filter="url(#vineGlow)"
          className="transition-all duration-500 opacity-60"
        />
        <circle cx="840" cy="300" r={activeTheme === 'fern' ? '4' : '2.5'} fill="#10B981" className="animate-ping" style={{ animationDuration: '3.2s' }} />

        {/* 4. Vine to Bottom-Right (Member 4: Iron Oak) */}
        <path
          d="M 680 420 C 770 460, 880 520, 960 600"
          stroke="url(#vineOak)"
          strokeWidth={activeTheme === 'oak' ? '3' : '1.5'}
          strokeDasharray="6 4"
          filter="url(#vineGlow)"
          className="transition-all duration-500 opacity-60"
        />
        <circle cx="840" cy="520" r={activeTheme === 'oak' ? '4' : '2.5'} fill="#F59E0B" className="animate-ping" style={{ animationDuration: '3.8s' }} />
      </svg>
    </div>
  );
}
