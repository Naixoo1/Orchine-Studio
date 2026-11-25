'use client';

import React, { useState } from 'react';
import { X, Scissors, Check, ChevronRight } from 'lucide-react';

interface StylingMethod {
  id: string;
  name: string;
  subtitle: string;
  bestFor: string;
  steps: string[];
  illustrationGradient: string;
  accentColor: string;
}

const STYLING_METHODS: StylingMethod[] = [
  {
    id: 'french-knot',
    name: 'The Parisian Bias Knot',
    subtitle: 'Classic Collarbone Drape',
    bestFor: 'Tailored blazers, silk shirts, daily tailored elegance',
    steps: [
      'Fold the square silk habotai diagonally corner-to-corner into a long bias band (approx. 5cm wide).',
      'Drape gently around the neck with both ends falling forward.',
      'Cross one end over the other and pull through the collar loop.',
      'Gently adjust the loose botanical leaf print so the Eucalyptus halos rest flush against the neck.',
    ],
    illustrationGradient: 'from-[#582E8B]/40 via-[#221D63] to-[#1A164E]',
    accentColor: '#BB9AEF',
  },
  {
    id: 'draped-shawl',
    name: 'The Draped Shoulder Shawl',
    subtitle: 'Open Evening Canopy',
    bestFor: 'Cocktail dresses, outdoor sunset gatherings, crisp evenings',
    steps: [
      'Open the 110cm square scarf completely to reveal the full botanical composition.',
      'Fold in half diagonally into an open triangle.',
      'Drape the wide point down your back and wrap the wings softly around each shoulder.',
      'Tie a loose organic half-knot at the chest or fasten with an artisanal horn pin.',
    ],
    illustrationGradient: 'from-[#7C8C78]/30 via-[#121613] to-[#0E0D0C]',
    accentColor: '#7C8C78',
  },
  {
    id: 'headwrap',
    name: 'The Botanical Crown Wrap',
    subtitle: 'Bohemian Tucked Headwrap',
    bestFor: 'Coastal travel, sunny garden strolls, hair protection',
    steps: [
      'Fold the scarf into an oversized triangle.',
      'Place the long straight edge across your forehead, just above the brow line.',
      'Gather both long ends behind the nape of the neck beneath your hair.',
      'Tie securely in a double knot, letting the excess habotai silk cascade down your back.',
    ],
    illustrationGradient: 'from-[#4D6B8A]/30 via-[#0B1118] to-[#0E0D0C]',
    accentColor: '#4D6B8A',
  },
];

interface StylingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StylingGuideModal({ isOpen, onClose }: StylingGuideModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const currentMethod = STYLING_METHODS[activeTab];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative cursor-default animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-botanical-marigold" />
            <span className="font-serif text-lg tracking-luxury uppercase text-brand-ecru">
              Draping & Styling Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-brand-sand/50 hover:text-brand-ecru transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex border-b border-white/10 bg-white/[0.02] overflow-x-auto">
          {STYLING_METHODS.map((method, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={method.id}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 min-w-[160px] py-3.5 px-4 text-xs font-serif uppercase tracking-wider text-center transition-all ${
                  isActive
                    ? 'border-b-2 border-botanical-marigold text-brand-ecru bg-white/5 font-medium'
                    : 'text-brand-sand/60 hover:text-brand-ecru hover:bg-white/[0.03]'
                }`}
              >
                {method.name}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Method Overview Banner */}
          <div
            className={`p-6 rounded-2xl bg-gradient-to-br ${currentMethod.illustrationGradient} border border-white/10 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-botanical-marigold glass-pill px-2.5 py-0.5 rounded-full">
                {currentMethod.subtitle}
              </span>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentMethod.accentColor }} />
            </div>
            <h3 className="font-serif text-2xl text-brand-ecru">{currentMethod.name}</h3>
            <p className="text-xs text-brand-sand/70 font-light mt-1">
              <strong className="text-brand-ecru font-medium">Best For:</strong> {currentMethod.bestFor}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-brand-sand/50 block font-mono">
              Step-by-Step Technique
            </span>
            {currentMethod.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 text-xs text-brand-sand/90 glass-pill p-3 rounded-xl"
              >
                <span className="w-5 h-5 rounded-full bg-botanical-marigold/20 border border-botanical-marigold/50 font-mono text-[10px] text-botanical-marigold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-light leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-brand-sand/60">
          <span>All 4 launch editions use 110cm × 110cm square silk habotai.</span>
          <button
            onClick={onClose}
            className="glass-pill px-4 py-1.5 rounded-full text-brand-ecru hover:bg-white/10 transition-colors uppercase tracking-widest text-[10px] font-mono"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
