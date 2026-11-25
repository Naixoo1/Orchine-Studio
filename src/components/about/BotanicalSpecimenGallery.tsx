'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BOTANICAL_THEMES, BotanicalThemeSlug } from '@/data/team';
import { Eye, ZoomIn, Sparkles, Layers, Maximize2 } from 'lucide-react';

interface SpecimenSlide {
  slug: BotanicalThemeSlug;
  plateNo: string;
  scientificName: string;
  commonName: string;
  family: string;
  image: string;
  dyeColors: string[];
  elementalRole: string;
}

const SPECIMENS: SpecimenSlide[] = [
  {
    slug: 'indigo',
    plateNo: 'HERBARIUM PLATE I',
    scientificName: 'Indigofera tinctoria',
    commonName: 'Fermented Indigo',
    family: 'Fabaceae',
    image: '/botanicals/indigo-leaves.webp',
    dyeColors: ['#38BDF8', '#2563EB', '#1E3A8A', '#0F172A'],
    elementalRole: 'Living Vat Reduction',
  },
  {
    slug: 'eucalyptus',
    plateNo: 'HERBARIUM PLATE II',
    scientificName: 'Eucalyptus cinerea',
    commonName: 'Silver Dollar Eucalyptus',
    family: 'Myrtaceae',
    image: '/botanicals/eucalyptus-leaves.webp',
    dyeColors: ['#A7F3D0', '#34D399', '#059669', '#F59E0B'],
    elementalRole: 'Solar Steam Halos',
  },
  {
    slug: 'fern',
    plateNo: 'HERBARIUM PLATE III',
    scientificName: 'Polystichum munitum',
    commonName: 'Forest Sword Fern',
    family: 'Dryopteridaceae',
    image: '/botanicals/sword-fern.webp',
    dyeColors: ['#6EE7B7', '#10B981', '#047857', '#064E3B'],
    elementalRole: 'Chlorophyll Vein Resists',
  },
  {
    slug: 'oak',
    plateNo: 'HERBARIUM PLATE IV',
    scientificName: 'Quercus robur & Gallotannins',
    commonName: 'Iron Oak Gall',
    family: 'Fagaceae',
    image: '/botanicals/oak-gall.webp',
    dyeColors: ['#FDE68A', '#F59E0B', '#B45309', '#1F2937'],
    elementalRole: 'Mineral Iron Mordanting',
  },
];

export function BotanicalSpecimenGallery() {
  const [activeSpecimen, setActiveSpecimen] = useState<BotanicalThemeSlug | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <section className="w-full mb-16 relative z-10">
      {/* Visual Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-white/10 pb-4 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#BB9AEF] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#BB9AEF] shadow-[0_0_8px_#BB9AEF]" />
            <span className="text-[#FFC8DD]">Living Plantation References • Botanical Archive</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#FFF2B1] tracking-tight">
            The Botanical Source Herbarium
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-[#FFF2B1]/60">
          <span>4 Canonical Species</span>
          <span>•</span>
          <span className="text-[#BB9AEF]">Eco-Print Contact Media</span>
        </div>
      </div>

      {/* 4-Column Visual Herbarium Specimen Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SPECIMENS.map((item) => {
          const theme = BOTANICAL_THEMES[item.slug];
          const isSelected = activeSpecimen === item.slug;

          return (
            <div
              key={item.slug}
              onClick={() => setActiveSpecimen(isSelected ? null : item.slug)}
              className={`rounded-[2rem] glass-panel bg-gradient-to-b from-[#181232]/95 via-[#1A1438]/95 to-[#100B22]/98 border p-4 sm:p-5 relative overflow-hidden group cursor-pointer transition-all duration-500 flex flex-col justify-between ${
                isSelected
                  ? 'border-white/50 ring-2 ring-white/30 scale-[1.02] shadow-[0_0_35px_rgba(187,154,239,0.3)]'
                  : 'border-white/10 hover:border-white/30 hover:shadow-2xl'
              }`}
            >
              {/* Top Plate Meta */}
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest mb-3 border-b border-white/10 pb-2.5">
                <span className="text-[#BB9AEF] font-semibold">{item.plateNo}</span>
                <span className="text-[#FFF2B1]/60">{item.family}</span>
              </div>

              {/* Dominant Photographic Specimen Window */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/50 border border-white/10 group-hover:border-white/25 transition-all shadow-inner my-1">
                <Image
                  src={item.image}
                  alt={item.scientificName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 filter brightness-105"
                />

                {/* Subtle Glass Sheen & Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Corner Quick Inspect Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedImage(item.image);
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-black/90 cursor-pointer shadow-lg z-20"
                  title="Inspect Botanical Macro Specimen"
                  aria-label={`View macro image for ${item.scientificName}`}
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#FFF2B1]" />
                </button>

                {/* Bottom Specimen Label on Photo */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] font-mono pointer-events-none">
                  <span className="text-white font-medium bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                    {item.commonName}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryHex }} />
                </div>
              </div>

              {/* Scientific Nomenclature & Natural Dye Swatch Spectrum */}
              <div className="mt-3 pt-2 space-y-2">
                <div>
                  <h3 className="font-serif italic text-sm text-[#FFF2B1] font-medium leading-tight">
                    {item.scientificName}
                  </h3>
                  <span className="text-[10px] font-mono tracking-wider text-[#BB9AEF] uppercase block mt-0.5">
                    {item.elementalRole}
                  </span>
                </div>

                {/* Natural Botanical Dye Color Yield Swatches */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#FFF2B1]/50">
                    Pigment Swatch
                  </span>
                  <div className="flex items-center space-x-1">
                    {item.dyeColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={`Extracted Botanical Pigment ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal for Macro Botanical Inspection */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src={zoomedImage}
                alt="Botanical Macro Specimen"
                fill
                className="object-contain p-2"
              />
            </div>
            <button
              onClick={() => setZoomedImage(null)}
              className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FFF2B1] font-mono text-xs uppercase tracking-widest cursor-pointer transition-all"
            >
              Close Specimen Lens
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
