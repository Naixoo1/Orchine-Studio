'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStudioStore } from '@/store/useStudioStore';
import { SCARF_LIST, ScarfItem } from '@/data/scarves';
import { StylingGuideModal } from '@/components/styling/StylingGuideModal';
import { ShoppingBag, Eye, Image as ImageIcon, Check, ChevronLeft, ChevronRight, Scissors, ArrowUpRight } from 'lucide-react';

export function CollectionSpotlight() {
  const activeScarfId = useStudioStore((state) => state.activeScarfId);
  const selectScarf = useStudioStore((state) => state.selectScarf);
  const addToBag = useStudioStore((state) => state.addToBag);

  const scrollTrayRef = useRef<HTMLDivElement>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Track flip view per card ('photo' vs 'details')
  const [cardViews, setCardViews] = useState<Record<string, 'photo' | 'details'>>({
    florave: 'photo',
    sylvea: 'photo',
    florielle: 'photo',
    naturea: 'photo',
  });

  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [cardImageIdx, setCardImageIdx] = useState<Record<string, number>>({});

  const setCardVersion = (id: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIdx((prev) => ({ ...prev, [id]: idx }));
  };

  const toggleCardView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardViews((prev) => ({
      ...prev,
      [id]: prev[id] === 'photo' ? 'details' : 'photo',
    }));
  };

  const handleSelect = (scarfId: ScarfItem['id']) => {
    selectScarf(scarfId);
  };

  const handleAdd = (scarfId: ScarfItem['id'], e: React.MouseEvent) => {
    e.stopPropagation();
    addToBag(scarfId, 1);
    setAddedItem(scarfId);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const scrollTray = (direction: 'left' | 'right') => {
    if (!scrollTrayRef.current) return;
    const scrollAmount = 340;
    scrollTrayRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="collection" className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 z-20">
      {/* Nike-Style Minimalist Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-neutral-800 pb-5 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block mb-1">
            Orchiné Scarf Series
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
            The Launch Editions
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick-View Styling Guide Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="bg-[#1E1E1E] hover:bg-[#2A2A2A] text-neutral-300 hover:text-white px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-colors flex items-center space-x-2 border border-neutral-700"
          >
            <Scissors className="w-3.5 h-3.5 text-neutral-400" />
            <span>Draping Guide</span>
          </button>

          {/* Nike Tray Arrow Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollTray('left')}
              className="p-2.5 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] text-neutral-300 hover:text-white transition-colors border border-neutral-800"
              aria-label="Scroll left in collection"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTray('right')}
              className="p-2.5 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] text-neutral-300 hover:text-white transition-colors border border-neutral-800"
              aria-label="Scroll right in collection"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Nike-Style Neutral Swatch Selector Chips */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mr-2 whitespace-nowrap">
          4 Editions:
        </span>
        {SCARF_LIST.map((s) => {
          const isSelected = s.id === activeScarfId;
          return (
            <button
              key={s.id}
              onClick={() => selectScarf(s.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans flex items-center space-x-2 transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-neutral-600"
                style={{ backgroundColor: s.palette.primary }}
              />
              <span className="text-[11px] uppercase tracking-wider">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scroll Snap Tray - Minimalist Nike Dark Neutral Box Layout */}
      <div
        ref={scrollTrayRef}
        className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SCARF_LIST.map((scarf) => {
          const isSelected = scarf.id === activeScarfId;
          const currentView = cardViews[scarf.id] || 'photo';
          const isJustAdded = addedItem === scarf.id;
          const activeImgIdx = cardImageIdx[scarf.id] ?? 0;
          const activePhoto = scarf.lookbookImages[activeImgIdx] || scarf.photoUrl;

          return (
            <article
              key={scarf.id}
              onClick={() => handleSelect(scarf.id)}
              className={`group flex-shrink-0 w-[290px] sm:w-[310px] snap-start rounded-xl p-4 flex flex-col justify-between transition-colors cursor-pointer bg-[#181818] border ${
                isSelected
                  ? 'border-white ring-1 ring-white/20'
                  : 'border-neutral-800 hover:border-neutral-600'
              }`}
            >
              {/* Product Media Box - Nike Neutral Framed Layout */}
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-3.5 bg-[#101010] border border-neutral-800 flex items-center justify-center">
                {currentView === 'photo' ? (
                  /* Clean Product Photography Mode */
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={activePhoto}
                      alt={`${scarf.name} view ${activeImgIdx + 1}`}
                      fill
                      sizes="320px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-200 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/15">
                        {scarf.season}
                      </span>
                    </div>

                    {/* Clean 1 / 2 / 3 Photo Version Switcher */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-1 bg-black/65 backdrop-blur-md px-1.5 py-1 rounded-full border border-white/15">
                      {scarf.lookbookImages.slice(0, 3).map((_, vIdx) => (
                        <button
                          key={vIdx}
                          onClick={(e) => setCardVersion(scarf.id, vIdx, e)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
                            activeImgIdx === vIdx
                              ? 'bg-white text-black font-semibold'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                          aria-label={`View ${scarf.name} photo ${vIdx + 1}`}
                        >
                          0{vIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Clean Philosophical Details Mode */
                  <div className="w-full h-full p-5 flex flex-col justify-between bg-[#141414]">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono block mb-1.5">
                        Filosofi Desain
                      </span>
                      <p className="text-xs text-neutral-200 leading-relaxed text-justify">
                        &quot;{scarf.philosophy}&quot;
                      </p>
                    </div>
                    <div className="text-left mt-auto pt-3 border-t border-neutral-800 text-[10px] text-neutral-400 font-mono">
                      <span>{scarf.dimensions}</span>
                      <span className="block mt-0.5 text-neutral-500">{scarf.material}</span>
                    </div>
                  </div>
                )}

                {/* Flip View Toggle Button */}
                <button
                  onClick={(e) => toggleCardView(scarf.id, e)}
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/75 hover:bg-black text-neutral-300 hover:text-white transition-colors border border-neutral-700 shadow-sm"
                  title={currentView === 'photo' ? 'Lihat Filosofi' : 'Lihat Foto'}
                  aria-label="Toggle card view"
                >
                  {currentView === 'photo' ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Product Info - Minimalist Nike Hierarchy */}
              <div className="flex flex-col flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white group-hover:text-neutral-200 transition-colors">
                      {scarf.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {scarf.subtitle}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-white ml-2">
                    ${scarf.price}
                  </span>
                </div>

                {/* Brief Philosophy */}
                <p className="text-[11px] text-neutral-400 font-normal mt-2.5 mb-4 line-clamp-2 leading-relaxed text-justify">
                  {scarf.philosophy}
                </p>

                {/* Action Buttons - Nike Minimalist Pill CTAs */}
                <div className="flex items-center space-x-2 mt-auto pt-3 border-t border-neutral-800">
                  <Link
                    href={`/store?scarf=${scarf.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 px-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Inspect 3D</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={(e) => handleAdd(scarf.id, e)}
                    className={`p-2 rounded-full transition-colors border ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#222222] hover:bg-[#303030] text-white border-neutral-700'
                    }`}
                    title="Tambah ke Keranjang"
                    aria-label={`Tambah ${scarf.name} ke keranjang`}
                  >
                    {isJustAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Styling Guide Modal */}
      <StylingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </section>
  );
}
