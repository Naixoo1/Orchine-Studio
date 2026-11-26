'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { SCARF_LIST } from '@/data/scarves';

const STYLING_MODES = [
  'French Bias Knot',
  'Draped Shoulder Shawl',
  'Botanical Crown Wrap',
  'Editorial Cape Drape',
];

export function LookbookGrid() {
  const [selectedVersions, setSelectedVersions] = useState<Record<string, number>>({});

  return (
    <section id="lookbook" className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 z-20">
      {/* Minimalist Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-neutral-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-400 mb-1 font-mono">
            <Camera className="w-3.5 h-3.5 text-neutral-400" />
            <span>Styled in Nature</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
            Editorial Lookbook
          </h2>
        </div>
        <p className="text-xs md:text-sm text-neutral-400 max-w-md font-light leading-relaxed">
          Dokumentasi estetika 4 desain scarf dalam pencahayaan alami, menampilkan perpaduan harmoni antara seni kain dan keindahan botani.
        </p>
      </div>

      {/* 4 Clean Minimalist Dark Cards - Nike Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SCARF_LIST.map((item, idx) => {
          const vIdx = selectedVersions[item.id] ?? 0;
          const activeImg = item.lookbookImages[vIdx] || item.photoUrl;

          return (
            <article
              key={item.id}
              className="group relative rounded-xl p-4 flex flex-col justify-between overflow-hidden bg-[#181818] border border-neutral-800 hover:border-neutral-600 transition-colors"
            >
              {/* Real Scarf Photography Box */}
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-2.5 bg-[#101010] border border-neutral-800">
                <Image
                  src={activeImg}
                  alt={`${item.name} lookbook ${vIdx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-200 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/15">
                    {STYLING_MODES[idx]}
                  </span>
                </div>
              </div>

              {/* Nike-Style 1 / 2 / 3 Lookbook Version Strip */}
              <div className="grid grid-cols-3 gap-1.5 mb-3.5">
                {item.lookbookImages.slice(0, 3).map((imgUrl, thumbIdx) => (
                  <button
                    key={imgUrl}
                    onClick={() =>
                      setSelectedVersions((prev) => ({ ...prev, [item.id]: thumbIdx }))
                    }
                    className={`relative aspect-[4/5] rounded-md overflow-hidden border transition-all cursor-pointer bg-[#101010] ${
                      vIdx === thumbIdx
                        ? 'border-white'
                        : 'border-neutral-800 opacity-65 hover:opacity-100 hover:border-neutral-600'
                    }`}
                    aria-label={`${item.name} lookbook version ${thumbIdx + 1}`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${item.name} thumbnail ${thumbIdx + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>

            {/* Typography & Philosophical Description */}
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-lg font-medium text-white group-hover:text-neutral-200 transition-colors">
                  {item.name}
                </h3>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  Model 0{idx + 1}
                </span>
              </div>

              <span className="text-[11px] text-neutral-400 font-mono mb-2 block">
                {item.subtitle}
              </span>

              <p className="text-xs text-neutral-300 font-normal leading-relaxed text-justify">
                {item.philosophy}
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>100% Sutra Habotai</span>
                <span className="text-neutral-400">110 × 110 cm</span>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
