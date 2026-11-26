'use client';

import dynamic from 'next/dynamic';
import React from 'react';

function ScarfCanvasLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-brand-noir/40 backdrop-blur-sm rounded-2xl border border-white/5">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-botanical-marigold/30 animate-ping" />
        <div className="w-8 h-8 rounded-full border border-botanical-marigold border-t-transparent animate-spin" />
      </div>
      <span className="mt-4 font-serif text-sm tracking-luxury uppercase text-brand-sand/70">
        Weaving Atelier Scarf...
      </span>
      <span className="text-[10px] tracking-widest text-brand-sand/40 uppercase mt-1">
        Procedural Silk Geometry
      </span>
    </div>
  );
}

export const ScarfCanvas = dynamic(
  () => import('./ScarfScene').then((mod) => mod.ScarfScene),
  {
    ssr: false,
    loading: () => <ScarfCanvasLoading />,
  }
);
