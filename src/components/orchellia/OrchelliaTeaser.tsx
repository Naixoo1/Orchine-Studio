'use client';

import React, { useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { MessageSquare, Bot, Mic, ChevronUp, ChevronDown, Compass, ArrowRight } from 'lucide-react';

export function OrchelliaTeaser() {
  const [isOpen, setIsOpen] = useState(false);
  const selectScarf = useStudioStore((state) => state.selectScarf);
  const set3DView = useStudioStore((state) => state.set3DView);
  const setHeroMode = useStudioStore((state) => state.setHeroMode);
  const addToBag = useStudioStore((state) => state.addToBag);
  const highlightUI = useStudioStore((state) => state.highlightUI);

  const suggestionChips = [
    {
      label: 'Show Solstice in 3D',
      action: () => {
        selectScarf('solstice');
        setHeroMode('canvas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'Rotate to Hem Detail',
      action: () => {
        set3DView('drape_detail');
        setHeroMode('canvas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'Add Fern Whisper to Bag',
      action: () => {
        addToBag('fern-whisper', 1);
      },
    },
    {
      label: 'Explore Craft Lab',
      action: () => {
        const el = document.getElementById('craft');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        highlightUI('craft', 'Biodynamic cedar vats maintain 98°C steam for 180 minutes.');
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Console Card */}
      {isOpen && (
        <div className="mb-3 w-80 glass-panel p-5 rounded-2xl border border-botanical-marigold/40 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-botanical-marigold animate-pulse" />
              <span className="font-serif text-sm tracking-luxury uppercase text-brand-ecru">
                Orchéllia Voice Companion
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-botanical-marigold glass-pill px-1.5 py-0.5 rounded">
              STUDIO GUIDE
            </span>
          </div>

          <p className="text-xs text-brand-sand/80 font-light leading-relaxed mb-4">
            Hello, I am Orchéllia, your atelier guide. Select any quick action below to interact with the collection:
          </p>

          {/* Quick Action Suggestion Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-brand-sand/50 block mb-1">
              Atelier Actions
            </span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={chip.action}
                className="w-full text-left glass-pill hover:bg-white/10 py-1.5 px-3 rounded-xl text-xs font-serif text-brand-sand/90 hover:text-brand-ecru transition-all flex items-center justify-between group"
              >
                <span>&quot;{chip.label}&quot;</span>
                <ArrowRight className="w-3 h-3 text-botanical-marigold opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Orb Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel hover:border-botanical-marigold/70 transition-all p-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 group cursor-pointer border border-white/10"
        title="Orchéllia Voice AI Assistant"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-botanical-marigold/30 animate-ping" />
          <div className="w-8 h-8 rounded-full bg-botanical-marigold/20 border border-botanical-marigold/60 flex items-center justify-center">
            <Bot className="w-4 h-4 text-botanical-marigold group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-start pr-1 text-left">
          <span className="font-serif text-xs uppercase tracking-luxury text-brand-ecru leading-none">
            Orchéllia
          </span>
          <span className="text-[9px] uppercase tracking-widest text-botanical-marigold font-mono">
            {isOpen ? 'Close Console' : 'Guide Assistant'}
          </span>
        </div>

        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-brand-sand/60" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-brand-sand/60" />
        )}
      </button>
    </div>
  );
}
