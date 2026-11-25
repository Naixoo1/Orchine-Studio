'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStudioStore } from '@/store/useStudioStore';
import { Compass, FlaskConical, Camera, Mic, Users, ShoppingBag } from 'lucide-react';

export function FeatureQuickNav() {
  const openBag = useStudioStore((state) => state.openBag);
  const activePassportData = useStudioStore((state) => state.activePassportData);
  const hydratePassports = useStudioStore((state) => state.hydratePassports);
  const cart = useStudioStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    hydratePassports();
  }, [hydratePassports]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-10 z-20">
      <div className="rounded-2xl p-6 sm:p-7 bg-[#181818] border border-neutral-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              Atelier Directory
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white">
              Studio Navigation & Quick Links
            </h3>
          </div>
          <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
            Akses langsung ke galeri 3D model, katalog peluncuran, formulasi laboratorium kriya, dan direktori tim.
          </p>
        </div>

        {/* Feature Navigation Buttons - Nike Clean Neutral Dark Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          {/* 1. Dedicated 3D Interactive Store (Primary Highlight) */}
          <Link
            href="/store"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white hover:bg-neutral-200 text-black transition-colors text-center group"
          >
            <div className="relative w-6 h-6 mb-1.5 flex items-center justify-center">
              <Image
                src="/brand/3d-store-icon.png"
                alt="3D Store Icon"
                width={28}
                height={28}
                className="object-contain w-full h-full group-hover:scale-110 transition-transform drop-shadow"
              />
            </div>
            <span className="font-semibold text-xs tracking-wide">
              3D Store
            </span>
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-tighter mt-0.5">
              Cloth Simulation
            </span>
          </Link>

          {/* 2. Collection Tray */}
          <button
            onClick={() => scrollTo('collection')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white border border-neutral-800 hover:border-neutral-700 transition-colors text-center group"
          >
            <Compass className="w-5 h-5 text-neutral-300 mb-2 group-hover:scale-105 transition-transform" />
            <span className="font-medium text-xs tracking-wide">
              Collection
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter mt-0.5">
              4 Scarf Models
            </span>
          </button>

          {/* 3. Craft Lab */}
          <button
            onClick={() => scrollTo('craft')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white border border-neutral-800 hover:border-neutral-700 transition-colors text-center group"
          >
            <FlaskConical className="w-5 h-5 text-neutral-300 mb-2 group-hover:scale-105 transition-transform" />
            <span className="font-medium text-xs tracking-wide">
              Craft Lab
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter mt-0.5">
              Formulation
            </span>
          </button>

          {/* 4. Lookbook */}
          <button
            onClick={() => scrollTo('lookbook')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white border border-neutral-800 hover:border-neutral-700 transition-colors text-center group"
          >
            <Camera className="w-5 h-5 text-neutral-300 mb-2 group-hover:scale-105 transition-transform" />
            <span className="font-medium text-xs tracking-wide">
              Lookbook
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter mt-0.5">
              Styled in Nature
            </span>
          </button>

          {/* 5. About Us */}
          <Link
            href="/about"
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white border border-neutral-800 hover:border-neutral-700 transition-colors text-center group"
          >
            <Users className="w-5 h-5 text-neutral-300 mb-2 group-hover:scale-105 transition-transform" />
            <span className="font-medium text-xs tracking-wide">
              About Us
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter mt-0.5">
              Cohort 11.2
            </span>
          </Link>

          {/* 6. Shopping Bag */}
          <button
            onClick={openBag}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white border border-neutral-800 hover:border-neutral-700 transition-colors text-center group relative"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-300 mb-2 group-hover:scale-105 transition-transform" />
            <span className="font-medium text-xs tracking-wide">
              Atelier Bag
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-tighter mt-0.5">
              {totalItems > 0 ? `${totalItems} items` : 'View Cart'}
            </span>
            {totalItems > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Minimalist 3D Signature Card Spotlight */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="relative w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0">
              <Image
                src="/brand/3d-store-icon.png"
                alt="3D Signature Card"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="font-serif text-sm text-white font-medium">
                  3D Limited Signature Card
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {activePassportData?.batchNumber || '#0000'}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Full-page 3D rotating showcase of our numbered digital eco-passport.
              </p>
            </div>
          </div>

          <Link
            href="/passport"
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-mono font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer flex-shrink-0"
          >
            <span>Open 3D Card</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
