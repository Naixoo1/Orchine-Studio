'use client';

import React from 'react';
import Link from 'next/link';
import { useStudioStore } from '@/store/useStudioStore';
import { ShoppingBag, Volume2, VolumeX } from 'lucide-react';

export function StudioNav() {
  const cart = useStudioStore((state) => state.cart);
  const toggleBag = useStudioStore((state) => state.toggleBag);
  const isAudioMuted = useStudioStore((state) => state.isAudioMuted);
  const toggleAudio = useStudioStore((state) => state.toggleAudio);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-5 px-6 md:px-12 border-b border-white/10 z-30">
      {/* Brand Monogram & Title */}
      <div className="flex flex-col">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-serif tracking-luxury font-light uppercase text-brand-ecru">
            Orchiné
          </span>
          <span className="text-[10px] font-mono tracking-widest text-botanical-marigold border border-botanical-marigold/30 px-1.5 py-0.5 rounded">
            STUDIO
          </span>
        </Link>
        <span className="text-[9px] uppercase tracking-luxury text-brand-sand/50">
          Botanical Eco-Print Silk Atelier
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest text-brand-sand/70">
        <a href="#collection" className="hover:text-brand-ecru transition-colors">
          Collection
        </a>
        <a href="#craft" className="hover:text-brand-ecru transition-colors">
          Craft Lab
        </a>
        <a href="#lookbook" className="hover:text-brand-ecru transition-colors">
          Lookbook
        </a>
      </nav>

      {/* Actions: Ambient Audio + Bag Trigger */}
      <div className="flex items-center space-x-3">
        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleAudio}
          className="p-2 rounded-full glass-pill hover:text-brand-ecru text-brand-sand/60 transition-colors"
          title={isAudioMuted ? 'Unmute forest breeze ambience' : 'Mute ambience'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-botanical-marigold" />}
        </button>

        {/* Slide-over Bag Trigger */}
        <button
          onClick={toggleBag}
          className="glass-pill hover:bg-white/10 transition-all py-1.5 px-3.5 rounded-full flex items-center space-x-2 text-xs uppercase tracking-wider text-brand-ecru"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-botanical-marigold" />
          <span>Bag</span>
          <span className="w-4 h-4 rounded-full bg-botanical-marigold text-brand-noir font-mono text-[10px] flex items-center justify-center font-bold">
            {totalItems}
          </span>
        </button>
      </div>
    </header>
  );
}
