'use client';

import React from 'react';
import { useStudioStore, View3DPreset } from '@/store/useStudioStore';
import { SCARF_LIST } from '@/data/scarves';
import { ScarfCanvas } from '@/components/canvas/ScarfCanvas';
import { ShoppingBag, Wind, Leaf } from 'lucide-react';

export function StudioStage() {
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const activeScarfId = useStudioStore((state) => state.activeScarfId);
  const selectScarf = useStudioStore((state) => state.selectScarf);
  const viewPreset = useStudioStore((state) => state.viewPreset);
  const set3DView = useStudioStore((state) => state.set3DView);
  const addToBag = useStudioStore((state) => state.addToBag);

  const viewPresets: { id: View3DPreset; label: string }[] = [
    { id: 'front', label: 'Floating Drape' },
    { id: 'drape_detail', label: 'Hem Detail' },
    { id: 'full_spin', label: '360° Spin' },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 py-8 z-10">
      {/* Left Column: Editorial Product Metadata & Interactive Controls */}
      <div className="w-full lg:w-5/12 flex flex-col items-start text-left z-20">
        {/* Season & Collection Tag */}
        <div className="flex items-center space-x-2 text-xs uppercase tracking-luxury text-botanical-marigold mb-3">
          <Leaf className="w-3.5 h-3.5 text-botanical-marigold" />
          <span>{activeScarf.season}</span>
        </div>

        {/* Scarf Title & Subtitle */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-none text-brand-ecru">
          {activeScarf.name}
        </h1>
        <p className="mt-2 text-sm md:text-base font-light text-brand-sand/70 tracking-wide">
          {activeScarf.subtitle}
        </p>

        {/* Poetic Craft Narrative */}
        <p className="mt-4 text-xs md:text-sm text-brand-sand/80 leading-relaxed font-light">
          {activeScarf.story}
        </p>

        {/* Botanical Dye Recipe Specs */}
        <div className="mt-6 w-full glass-panel p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
            <span className="text-brand-sand/50 uppercase tracking-widest text-[10px]">Material</span>
            <span className="font-serif text-brand-ecru">{activeScarf.material} ({activeScarf.weight})</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
            <span className="text-brand-sand/50 uppercase tracking-widest text-[10px]">Dimensions</span>
            <span className="font-serif text-brand-ecru">{activeScarf.dimensions}</span>
          </div>
          <div className="flex flex-col text-xs pt-1">
            <span className="text-brand-sand/50 uppercase tracking-widest text-[10px] mb-1.5">Foraged Botanicals</span>
            <div className="flex flex-wrap gap-1.5">
              {activeScarf.botanicals.map((bot) => (
                <span
                  key={bot.name}
                  className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] text-brand-sand/90"
                  title={`${bot.scientificName} • ${bot.hueContribution}`}
                >
                  {bot.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4-SKU Botanical Swatch Tray */}
        <div className="mt-6 w-full">
          <span className="text-[10px] uppercase tracking-widest text-brand-sand/50 block mb-2">
            Select Launch Edition (4 SKUs)
          </span>
          <div className="grid grid-cols-4 gap-2">
            {SCARF_LIST.map((scarf) => {
              const isSelected = scarf.id === activeScarfId;
              return (
                <button
                  key={scarf.id}
                  onClick={() => selectScarf(scarf.id)}
                  className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'glass-panel border-botanical-marigold/60 shadow-lg shadow-botanical-marigold/10'
                      : 'bg-white/[0.02] border border-white/5 hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mb-1.5 border border-white/20 shadow-sm"
                    style={{ backgroundColor: scarf.palette.primary }}
                  />
                  <span className="text-[10px] font-serif uppercase tracking-wider text-brand-ecru truncate max-w-full">
                    {scarf.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Add to Simulated Bag CTA */}
        <div className="mt-8 flex items-center space-x-4 w-full">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-brand-sand/50">Simulated Price</span>
            <span className="font-mono text-2xl text-botanical-marigold font-light">
              ${activeScarf.price} <span className="text-xs text-brand-sand/60">USD</span>
            </span>
          </div>

          <button
            onClick={() => addToBag(activeScarf.id, 1)}
            className="flex-1 glass-pill hover:bg-botanical-marigold hover:text-brand-noir transition-all py-3.5 px-6 rounded-xl font-serif text-sm tracking-luxury uppercase flex items-center justify-center space-x-2 group"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Add to Atelier Bag</span>
          </button>
        </div>
      </div>

      {/* Right Column: 3D Procedural Scarf Interactive Canvas */}
      <div className="w-full lg:w-7/12 relative flex flex-col items-center justify-center">
        {/* Top View Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* 3D View Presets */}
          <div className="flex items-center space-x-1 glass-pill p-1 rounded-full pointer-events-auto">
            {viewPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => set3DView(preset.id)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest transition-all ${
                  viewPreset === preset.id
                    ? 'bg-brand-ecru text-brand-noir font-medium'
                    : 'text-brand-sand/70 hover:text-brand-ecru'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Interactive Hint Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 glass-pill px-3 py-1 rounded-full text-[10px] text-brand-sand/60 tracking-wider uppercase">
            <Wind className="w-3 h-3 text-botanical-marigold animate-pulse" />
            <span>Cursor / Touch Wave Active</span>
          </div>
        </div>

        {/* Three.js Canvas Container */}
        <div className="w-full aspect-square max-w-[620px] rounded-3xl overflow-hidden glass-panel border border-white/10 relative">
          <ScarfCanvas />

          {/* Bottom Overlay Hint */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
            <span className="glass-pill px-4 py-1.5 rounded-full text-[10px] tracking-widest text-brand-sand/60 uppercase">
              Drag to Rotate • Touch to Ripple Silk
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
