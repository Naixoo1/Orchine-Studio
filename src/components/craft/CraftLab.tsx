'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useStudioStore } from '@/store/useStudioStore';
import { SCARF_LIST } from '@/data/scarves';

export function CraftLab() {
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const selectScarf = useStudioStore((state) => state.selectScarf);

  // 2D Macro Loupe State
  const loupeContainerRef = useRef<HTMLDivElement>(null);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50, isHovering: false });
  const [loupeImageIdx, setLoupeImageIdx] = useState(0);

  const loupePhoto = activeScarf.lookbookImages[loupeImageIdx] || activeScarf.photoUrl;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!loupeContainerRef.current) return;
    const rect = loupeContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y, isHovering: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setLoupePos((prev) => ({ ...prev, isHovering: false }));
  }, []);

  return (
    <section id="craft" className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 z-20">
      {/* Minimalist Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
          Craft Lab & Natural Formulation
        </h2>
        <p className="mt-2 text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
          Eksplorasi serat sutra organik habotai dan formulasi pigmen botani alami pada 4 koleksi utama Orchiné Studio.
        </p>
      </div>

      {/* Innovation Split View - Minimalist Nike Box Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Macro Loupe Inspector in Neutral Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            ref={loupeContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[4/5] max-w-[420px] rounded-xl overflow-hidden bg-[#181818] border border-neutral-800 cursor-crosshair select-none shadow-md"
          >
            {/* Scarf Image Base */}
            <Image
              src={loupePhoto}
              alt={`${activeScarf.name} macro view ${loupeImageIdx + 1}`}
              fill
              sizes="420px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />

            {/* Floating Magnification Loupe Lens */}
            {loupePos.isHovering && (
              <div
                className="absolute pointer-events-none w-36 h-36 rounded-full border-2 border-white shadow-2xl overflow-hidden transition-opacity duration-150"
                style={{
                  left: `${loupePos.x}%`,
                  top: `${loupePos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 25px rgba(255, 255, 255, 0.25), inset 0 0 15px rgba(0,0,0,0.8)',
                }}
              >
                {/* Magnified Image Container */}
                <div
                  className="w-[250%] h-[250%] absolute rounded-full"
                  style={{
                    left: `${-loupePos.x * 2.5 + 50}%`,
                    top: `${-loupePos.y * 2.5 + 50}%`,
                  }}
                >
                  <Image
                    src={loupePhoto}
                    alt={`${activeScarf.name} magnified`}
                    fill
                    sizes="900px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Nike-Style Version Selector Strip for Macro Inspection */}
          <div className="mt-3 flex items-center space-x-2">
            {activeScarf.lookbookImages.slice(0, 3).map((imgUrl, vIdx) => (
              <button
                key={imgUrl}
                onClick={() => setLoupeImageIdx(vIdx)}
                className={`relative w-12 h-14 rounded-lg overflow-hidden border transition-all cursor-pointer bg-[#141416] ${
                  loupeImageIdx === vIdx
                    ? 'border-white ring-1 ring-white/30'
                    : 'border-neutral-800 opacity-65 hover:opacity-100 hover:border-neutral-600'
                }`}
                aria-label={`Inspect ${activeScarf.name} version ${vIdx + 1}`}
              >
                <Image
                  src={imgUrl}
                  alt={`${activeScarf.name} version ${vIdx + 1}`}
                  fill
                  sizes="60px"
                  className="object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: 4 Clean Minimalist Dark Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCARF_LIST.map((item, idx) => {
            const isSelected = item.id === activeScarf.id;
            return (
              <div
                key={item.id}
                onClick={() => selectScarf(item.id)}
                className={`p-4 rounded-xl transition-colors cursor-pointer flex flex-col justify-between bg-[#181818] border ${
                  isSelected
                    ? 'border-white bg-[#202020] ring-1 ring-white/20'
                    : 'border-neutral-800 hover:border-neutral-600'
                }`}
              >
                <div>
                  {/* Card Header with Mini Thumbnail */}
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-700 flex-shrink-0 bg-black">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                        Model 0{idx + 1}
                      </span>
                      <h3 className="text-base font-medium text-white leading-tight">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <span className="text-[11px] text-neutral-400 font-mono block mb-2">
                    {item.subtitle}
                  </span>

                  {/* Brief, Justified Philosophical Description */}
                  <p className="text-xs text-neutral-300 font-normal leading-relaxed text-justify">
                    {item.philosophy}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="mt-3.5 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-500">{item.dimensions}</span>
                  <span className={`uppercase tracking-wider ${isSelected ? 'text-white font-semibold' : 'text-neutral-500'}`}>
                    {isSelected ? 'Aktif di Loupe' : 'Pilih Model'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
