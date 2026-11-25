'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useStudioStore, View3DPreset } from '@/store/useStudioStore';
import { SCARF_LIST, SCARVES, ScarfId } from '@/data/scarves';
import { ScarfCanvas } from '@/components/canvas/ScarfCanvas';
import { SlideOverBag } from '@/components/cart/SlideOverBag';
import {
  ArrowLeft,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Minus,
  Maximize2,
} from 'lucide-react';

function StoreContent() {
  const searchParams = useSearchParams();
  const activeScarf = useStudioStore((state) => state.activeScarf);
  const selectScarf = useStudioStore((state) => state.selectScarf);
  const setHeroMode = useStudioStore((state) => state.setHeroMode);
  const set3DView = useStudioStore((state) => state.set3DView);
  const viewPreset = useStudioStore((state) => state.viewPreset);
  const addToBag = useStudioStore((state) => state.addToBag);
  const openBag = useStudioStore((state) => state.openBag);
  const cart = useStudioStore((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Initialize canvas mode and honor ?scarf= query param on mount
  useEffect(() => {
    setHeroMode('canvas');
    const paramScarf = searchParams.get('scarf');
    if (paramScarf && SCARVES[paramScarf]) {
      selectScarf(paramScarf as ScarfId);
    }
  }, [searchParams, selectScarf, setHeroMode]);

  const handleAdd = () => {
    addToBag(activeScarf.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToBag(activeScarf.id, quantity);
    openBag();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const viewPresets: { label: string; preset: View3DPreset }[] = [
    { label: 'Default Drape', preset: 'front' },
    { label: 'Hem Detail', preset: 'drape_detail' },
    { label: '360° Spin', preset: 'full_spin' },
    { label: 'Top-Down', preset: 'top_down' },
  ];

  return (
    <main className="relative min-h-screen w-full bg-[#121214] text-white selection:bg-white selection:text-black flex flex-col">
      {/* 1. Minimalist Top Studio Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#161618]/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Back to Lobby Link */}
        <Link
          href="/studio"
          className="inline-flex items-center space-x-2 text-xs font-sans text-neutral-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Studio Lobby</span>
          <span className="sm:hidden">Lobby</span>
        </Link>

        {/* Center Brand Identity */}
        <div className="flex items-center space-x-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <Image
              src="/brand/3d-store-icon.png"
              alt="3D Store Icon"
              width={28}
              height={28}
              className="object-contain w-full h-full drop-shadow"
            />
          </div>
          <span className="font-serif text-lg tracking-wider uppercase text-white font-medium">
            Orchiné
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            3D Atelier
          </span>
        </div>

        {/* Right Actions: Bag */}
        <div className="flex items-center space-x-3">
          <button
            onClick={openBag}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#202022] hover:bg-[#2A2A2E] text-white border border-neutral-700 transition-colors text-xs"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-300" />
            <span className="font-mono font-medium">{totalItems}</span>
          </button>
        </div>
      </header>

      {/* 2. Main 3D Studio & Store Layout (Nike Customizer 2-Column Split) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Procedural Silk Cloth Canvas & Presets */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[620px] rounded-2xl bg-[#18181C] border border-neutral-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Scarf 3D R3F Canvas */}
            <div className="w-full h-full">
              <ScarfCanvas />
            </div>

            {/* Instruction Overlay Pill */}
            <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-700 flex items-center space-x-2 text-[10px] font-mono text-neutral-300 pointer-events-none">
              <Sparkles className="w-3 h-3 text-white" />
              <span>GPU Wave Physics & Touch Ripples</span>
            </div>

            {/* 3D View Presets Toolbar */}
            <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-center space-x-2 overflow-x-auto p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-neutral-700">
              {viewPresets.map(({ label, preset }) => {
                const isActive = viewPreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => set3DView(preset)}
                    className={`px-3 py-1 rounded-full text-[11px] font-sans transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-[11px] font-mono text-neutral-500 text-center">
            Drag to rotate • Move cursor across silk to generate compound waves
          </p>
        </div>

        {/* Right Column: Scarf Selector & Purchase Specifications */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#18181C] p-6 sm:p-7 rounded-2xl border border-neutral-800 shadow-xl">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                {activeScarf.season} • {activeScarf.material}
              </span>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded">
                #{activeScarf.currentEdition}/{activeScarf.editionLimit} Pieces
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-white font-medium mb-1">
              {activeScarf.name}
            </h1>
            <p className="text-xs text-neutral-400 font-mono mb-3">
              {activeScarf.subtitle}
            </p>

            <span className="text-2xl font-sans font-semibold text-white block mb-4">
              ${activeScarf.price} <span className="text-xs font-mono text-neutral-500 font-normal">USD</span>
            </span>

            {/* Indonesian Design Philosophy from 4ModuleDesignandName.jpeg */}
            <div className="p-3.5 rounded-xl bg-[#202024] border border-neutral-800 mb-5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Filosofi Desain
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed text-justify">
                {activeScarf.philosophy}
              </p>
            </div>
          </div>

          {/* Model Switcher Tiles (Nike ID Style 4 SKUs) */}
          <div>
            <span className="text-xs font-medium text-neutral-300 block mb-2.5">
              Select Scarf Model:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {SCARF_LIST.map((item) => {
                const isSelected = item.id === activeScarf.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectScarf(item.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center transition-colors ${
                      isSelected
                        ? 'border-white bg-[#2A2A30] ring-1 ring-white/30'
                        : 'border-neutral-800 hover:border-neutral-700 bg-[#202024]'
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-black">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-white truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botanical Specifications */}
          <div className="border-t border-neutral-800 pt-4">
            <span className="text-xs font-medium text-neutral-300 block mb-2">
              Botanical Ingredients:
            </span>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeScarf.botanicals.map((bot) => (
                <span
                  key={bot.name}
                  className="bg-[#242428] text-neutral-300 px-2.5 py-1 rounded-md text-[10px] font-mono border border-neutral-700"
                >
                  {bot.name} ({bot.mordant})
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-neutral-400 font-mono">
              <div>
                <span className="text-neutral-500 block">Dimensions:</span>
                <span className="text-neutral-200">{activeScarf.dimensions}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Weave & Finish:</span>
                <span className="text-neutral-200">{activeScarf.weave}</span>
              </div>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="border-t border-neutral-800 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Quantity</span>
              <div className="flex items-center space-x-3 bg-[#242428] border border-neutral-700 rounded-lg px-2.5 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-neutral-400 hover:text-white p-1"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-medium px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-neutral-400 hover:text-white p-1"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Primary Action Button: Add to Bag */}
            <button
              onClick={handleAdd}
              className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Atelier Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ${(activeScarf.price * quantity).toLocaleString()} USD</span>
                </>
              )}
            </button>

            {/* Secondary Action Button: Instant Checkout */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-[#242428] hover:bg-[#2C2C32] border border-neutral-700 transition-colors"
            >
              Proceed to Simulated Checkout →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Shopping Bag Drawer */}
      <SlideOverBag />
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#121214] flex items-center justify-center text-neutral-400 font-mono text-xs">
          Loading 3D Atelier Store...
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
