'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  RefreshCw,
  Play,
  Pause,
  Download,
  Camera,
  Check,
  Layers,
  ShoppingBag,
  Crosshair,
  X,
} from 'lucide-react';
import { useStudioStore, EcoPassportData } from '@/store/useStudioStore';
import { HolographicCard3D } from './HolographicCard3D';
import type { Card3DHandle } from './HolographicCard3DScene';
import { downloadFrontCardPng } from '@/utils/signatureCardTexture';

interface EcoPassportStudioProps {
  onClose?: () => void;
  overrideData?: EcoPassportData | null;
}

export function EcoPassportStudio({
  onClose,
  overrideData,
}: EcoPassportStudioProps) {
  const activePassportData = useStudioStore((state) => state.activePassportData);
  const mintedPassports = useStudioStore((state) => state.mintedPassports);
  const hydratePassports = useStudioStore((state) => state.hydratePassports);
  const selectPassportEdition = useStudioStore((state) => state.selectPassportEdition);
  const openBag = useStudioStore((state) => state.openBag);
  const cart = useStudioStore((state) => state.cart);

  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [downloadState, setDownloadState] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<'editions' | 'download' | null>(null);

  const card3DRef = useRef<Card3DHandle>(null);

  useEffect(() => {
    hydratePassports();
  }, [hydratePassports]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openMenu) {
          setOpenMenu(null);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openMenu, onClose]);

  const currentPassport = overrideData || activePassportData;
  const activeSerial = currentPassport?.batchNumber || '#0000';
  const totalBagItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const triggerDownloadUrl = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFlipToggle = (nextFlipped?: boolean) => {
    const target = nextFlipped !== undefined ? nextFlipped : !isFlipped;
    setAutoRotate(false);
    setIsFlipped(target);
  };

  const handleSpinOnce = () => {
    card3DRef.current?.spinOnce();
  };

  const handleResetView = () => {
    card3DRef.current?.resetView();
    setIsFlipped(false);
  };

  const handleDownloadFront = async () => {
    setDownloadState('front');
    try {
      await downloadFrontCardPng(
        activeSerial,
        `Orchine-SignatureCard-${activeSerial.replace('#', '')}-Front.png`
      );
    } finally {
      setTimeout(() => setDownloadState(null), 1600);
    }
  };

  const handleDownloadBack = () => {
    setDownloadState('back');
    triggerDownloadUrl(
      '/passport/eco-passport-back.png',
      `Orchine-SignatureCard-${activeSerial.replace('#', '')}-Back.png`
    );
    setTimeout(() => setDownloadState(null), 1600);
  };

  const handleCaptureSnapshot = () => {
    if (!card3DRef.current) return;
    setDownloadState('snapshot');
    const dataUrl = card3DRef.current.captureSnapshot();
    if (dataUrl) {
      triggerDownloadUrl(
        dataUrl,
        `Orchine-3DCard-${activeSerial.replace('#', '')}.png`
      );
    }
    setTimeout(() => setDownloadState(null), 1600);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden select-none text-white bg-gradient-to-b from-[#6978B6] via-[#7A84C4] to-[#5661A2]"
      onClick={() => openMenu && setOpenMenu(null)}
    >
      {/* Luminous Gallery Center Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.34) 0%, rgba(235, 224, 255, 0.16) 42%, transparent 72%)',
        }}
      />

      {/* 1. Minimal Top Bar: Back + #0000 Badge + Bag */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-2 flex items-center justify-between">
        {onClose ? (
          <button
            onClick={onClose}
            className="h-11 w-11 rounded-full bg-[#241B58]/35 hover:bg-[#241B58]/55 backdrop-blur-md border border-white/25 text-white transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Close"
            title="Close"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/studio"
            className="h-11 w-11 rounded-full bg-[#241B58]/35 hover:bg-[#241B58]/55 backdrop-blur-md border border-white/25 text-white transition-colors flex items-center justify-center"
            aria-label="Back to Studio"
            title="Back to Studio"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}

        <div className="px-4 py-1.5 rounded-full bg-[#241B58]/40 backdrop-blur-md border border-white/25 flex items-center space-x-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-300" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold tracking-wider text-white">
            {activeSerial}
          </span>
        </div>

        <button
          onClick={openBag}
          className="h-11 px-3.5 rounded-full bg-[#241B58]/35 hover:bg-[#241B58]/55 backdrop-blur-md border border-white/25 text-white text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer"
          aria-label="Open Bag"
          title="Bag"
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>{totalBagItems}</span>
        </button>
      </header>

      {/* 2. Expansive Full-Page 3D Card Stage */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center min-h-[60vh] px-2 sm:px-6">
        <div className="w-full h-[68vh] sm:h-[74vh] max-w-6xl">
          <HolographicCard3D
            ref={card3DRef}
            serialNumber={activeSerial}
            isFlipped={isFlipped}
            autoRotate={autoRotate}
            onFlipChange={(flipped) => handleFlipToggle(flipped)}
            className="w-full h-full"
          />
        </div>
      </main>

      {/* 3. Icon-Only Pill Control Dock + Compact #0000 Edition Selector */}
      <footer
        className="relative z-30 w-full max-w-2xl mx-auto px-4 pb-6 pt-2 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Editions Visual Picker Popover */}
        {openMenu === 'editions' && (
          <div className="mb-3 w-full max-w-xs rounded-2xl bg-[#251D58]/95 backdrop-blur-xl border border-white/25 p-2.5 shadow-2xl">
            {mintedPassports.length === 0 ? (
              <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-white">
                  #0000
                </span>
                <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-0.5">
                {mintedPassports.map((edition) => {
                  const isActive = edition.batchNumber === activeSerial;
                  return (
                    <button
                      key={`${edition.batchNumber}-${edition.orderId}`}
                      onClick={() => {
                        selectPassportEdition(edition.batchNumber);
                        setOpenMenu(null);
                      }}
                      className={`w-full h-11 px-3 rounded-xl border transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#221D63] border-white font-semibold'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                      }`}
                    >
                      <span className="font-mono text-xs">{edition.batchNumber}</span>
                      {isActive && <Check className="w-4 h-4" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Download Visual Popover */}
        {openMenu === 'download' && (
          <div className="mb-3 w-full max-w-xs rounded-2xl bg-[#251D58]/95 backdrop-blur-xl border border-white/25 p-2.5 shadow-2xl space-y-1.5">
            <button
              onClick={handleDownloadFront}
              className="w-full h-11 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Front PNG</span>
              {downloadState === 'front' ? (
                <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              ) : (
                <Download className="w-4 h-4 text-white/80" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={handleDownloadBack}
              className="w-full h-11 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Back PNG</span>
              {downloadState === 'back' ? (
                <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              ) : (
                <Download className="w-4 h-4 text-white/80" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={handleCaptureSnapshot}
              className="w-full h-11 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>3D Snapshot</span>
              {downloadState === 'snapshot' ? (
                <Check className="w-4 h-4 text-emerald-300" aria-hidden="true" />
              ) : (
                <Camera className="w-4 h-4 text-white/80" aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        {/* Floating Icon-Only Control Dock + Compact #0000 Edition Pill */}
        <div className="flex items-center justify-center gap-2 p-2 rounded-full bg-[#241B58]/45 backdrop-blur-xl border border-white/25 shadow-2xl">
          {/* Flip Front / Back */}
          <button
            onClick={() => handleFlipToggle()}
            aria-pressed={isFlipped}
            aria-label={isFlipped ? 'Flip to Front' : 'Flip to Back'}
            title={isFlipped ? 'Flip to Front' : 'Flip to Back'}
            className="h-11 w-11 rounded-full bg-white text-[#221D63] hover:bg-[#FFF2B1] transition-colors flex items-center justify-center cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Spin 360 */}
          <button
            onClick={handleSpinOnce}
            aria-label="Spin 360°"
            title="Spin 360°"
            className="h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            aria-pressed={autoRotate}
            aria-label={autoRotate ? 'Pause Auto-Rotate' : 'Start Auto-Rotate'}
            title={autoRotate ? 'Pause Auto-Rotate' : 'Auto-Rotate'}
            className={`h-11 w-11 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
              autoRotate
                ? 'bg-white/30 text-white border border-white/40'
                : 'bg-white/15 hover:bg-white/25 text-white/85'
            }`}
          >
            {autoRotate ? (
              <Pause className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Compact #0000 Editions Pill */}
          <button
            onClick={() => setOpenMenu((m) => (m === 'editions' ? null : 'editions'))}
            aria-expanded={openMenu === 'editions'}
            aria-label="Select Edition"
            title="Editions"
            className={`h-11 px-3.5 rounded-full text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer ${
              openMenu === 'editions'
                ? 'bg-white text-[#221D63] font-semibold'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>{activeSerial}</span>
          </button>

          {/* Download Menu */}
          <button
            onClick={() => setOpenMenu((m) => (m === 'download' ? null : 'download'))}
            aria-expanded={openMenu === 'download'}
            aria-label="Download"
            title="Download"
            className={`h-11 w-11 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
              openMenu === 'download'
                ? 'bg-white text-[#221D63]'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Reset Camera View */}
          <button
            onClick={handleResetView}
            aria-label="Reset View"
            title="Reset View"
            className="h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex items-center justify-center cursor-pointer"
          >
            <Crosshair className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>
  );
}
