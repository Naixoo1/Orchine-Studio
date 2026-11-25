'use client';

import React from 'react';

const TICKER_ITEMS = [
  'Complimentary Simulated Delivery',
  '100% Organic Silk Habotai (12 Momme)',
  'Direct Leaf Contact Steamed',
  'Limited Edition Batch #024/100',
  'Natural Eucalyptus & Living Indigo Vats',
  'Artisanal Hand-Rolled Hems',
];

export function MarqueeTicker() {
  return (
    <div className="w-full bg-[#191444] border-b border-[#BB9AEF]/15 py-2 overflow-hidden select-none z-30 transform-gpu">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Repeat twice for continuous infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 mx-4">
            <span className="text-[10px] uppercase tracking-luxury text-[#FFF2B1]/85 font-light">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BB9AEF]/80 shadow-[0_0_6px_#BB9AEF]" />
          </div>
        ))}
      </div>
    </div>
  );
}
