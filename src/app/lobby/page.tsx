'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioHeader } from '@/components/layout/StudioHeader';
import { ArrowRight } from 'lucide-react';

export default function LobbyPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Play Orchéllia voice greeting (voice-only assistance mode)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playGreeting = async () => {
      try {
        audio.muted = false;
        await audio.play();
        setIsVoicePlaying(true);
        setNeedsGesture(false);
      } catch (err) {
        console.warn('Autoplay audio policy triggered, awaiting user interaction:', err);
        setNeedsGesture(true);
      }
    };

    const timer = setTimeout(playGreeting, 400);

    return () => {
      clearTimeout(timer);
      audio.pause();
    };
  }, []);

  const handleUserGesture = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setIsVoicePlaying(true);
          setNeedsGesture(false);
        })
        .catch(() => {});
    }
  };

  const handleEnterStudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/studio');
    }, 600);
  };

  return (
    <main
      onClick={needsGesture ? handleUserGesture : undefined}
      className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#1C1438] via-[#341F5F] to-[#120D22] text-[#FFF2B1] select-none relative overflow-hidden"
    >
      {/* Hidden Audio Player for Orchéllia's Voice Greeting */}
      <audio
        ref={audioRef}
        src="/videos/orchellia-in-lobby.mp4"
        playsInline
        onPlay={() => setIsVoicePlaying(true)}
        onEnded={() => setIsVoicePlaying(false)}
        onError={() => setIsVoicePlaying(false)}
      />

      {/* 1. Unified Atelier Top Header */}
      <StudioHeader variant="solid" />

      {/* 2. Nike-Inspired Non-Colliding Multi-Accent Atmospheric Stage (Spec 4.1 & 4.2) */}
      <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden select-none">
        {/* Center Stage: Royal Orchid Violet (#582E8B) & Blossom Pink (#FFC8DD) Soft Halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[680px] aspect-square rounded-full bg-gradient-to-b from-[#582E8B]/25 via-[#FFC8DD]/10 to-transparent blur-[60px] transform-gpu will-change-transform" />

        {/* Center Pet Spotlight: Lavender Orchid (#BB9AEF) Focused Glow */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[420px] aspect-square rounded-full bg-[#BB9AEF]/18 blur-[50px] transform-gpu will-change-transform" />

        {/* Top-Left: Indigo Twilight (#373191) & Slate Blue (#485C91) Ambient Depth */}
        <div className="absolute -top-16 -left-16 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#373191]/25 via-[#485C91]/18 to-transparent blur-[60px] transform-gpu will-change-transform" />

        {/* Bottom-Right: Warm Peach (#FF9E69) & Warm Cream (#FFF2B1) Harvest Glow */}
        <div className="absolute -bottom-20 -right-20 w-[440px] h-[440px] rounded-full bg-gradient-to-tl from-[#FF9E69]/14 via-[#FFF2B1]/10 to-transparent blur-[60px] transform-gpu will-change-transform" />

        {/* Edge Vignette: Deep perimeter darkness ensuring zero collision with UI and copy */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/45" />

        {/* Ambient Botanical Spores in the 4 Spec Accents */}
        <span
          className="absolute top-[20%] left-[18%] w-1.5 h-1.5 rounded-full bg-[#FFF2B1]/80 shadow-[0_0_8px_#FFF2B1] animate-ping"
          style={{ animationDuration: '5s' }}
        />
        <span
          className="absolute top-[32%] right-[22%] w-2 h-2 rounded-full bg-[#BB9AEF]/80 shadow-[0_0_10px_#BB9AEF] animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <span
          className="absolute top-[72%] left-[20%] w-2 h-2 rounded-full bg-[#FFC8DD]/80 shadow-[0_0_10px_#FFC8DD] animate-pulse"
          style={{ animationDuration: '5.5s' }}
        />
        <span
          className="absolute top-[80%] right-[24%] w-1.5 h-1.5 rounded-full bg-[#FF9E69]/80 shadow-[0_0_8px_#FF9E69] animate-ping"
          style={{ animationDuration: '6.5s' }}
        />
      </div>

      {/* 3. Main Nike-Style Editorial Stage */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center relative z-10 py-6 sm:py-10">
        
        {/* Nike Category Eyebrow */}
        <div className="mb-2">
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#BB9AEF] uppercase">
            ORCHÉLLIA • VOICE COMPANION
          </span>
        </div>

        {/* Nike High-Impact Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight uppercase text-[#FFF2B1] leading-none mb-3">
          MEET ORCHÉLLIA
        </h1>

        {/* Clean, Decisive Subline */}
        <p className="text-xs sm:text-sm md:text-base text-[#FFF2B1]/80 max-w-md mx-auto font-sans font-medium tracking-wide mb-4">
          Spoken voice intelligence guided by botanical silk craft.
        </p>

        {/* Hero Character Visual (Prominently Center-Staged) */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: isTransitioning ? 0 : 1,
              scale: isTransitioning ? 1.05 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative flex flex-col items-center justify-center my-1 sm:my-2"
          >
            {/* Reactive Voice Glow Ring */}
            {isVoicePlaying && (
              <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-3xl animate-pulse pointer-events-none scale-125" />
            )}

            {/* Floating Orchéllia Subject (Dynamic video model from Orchéllia AI Opening) */}
            <motion.div
              animate={{
                y: isVoicePlaying ? [0, -6, 0] : [0, -10, 0],
              }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
              }}
              className="relative w-[280px] sm:w-[380px] md:w-[460px] aspect-square flex items-center justify-center transform-gpu"
            >
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#582E8B]/35 via-[#BB9AEF]/20 to-transparent blur-2xl pointer-events-none transform-gpu" />
              <div
                className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center pointer-events-none z-10"
                style={{
                  maskImage: 'radial-gradient(circle at center, black 58%, transparent 92%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 58%, transparent 92%)',
                }}
              >
                <video
                  src="/videos/orchellia-opening.mp4"
                  poster="/brand/orchellia-transparent.png"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Orchéllia Orchid Companion"
                  className="w-full h-full object-cover mix-blend-screen pointer-events-none scale-110"
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Nike-Style Action Cluster: Primary CTA */}
        <div className="flex items-center justify-center mt-4 z-20">
          {/* Primary Nike Pill Button */}
          <button
            onClick={handleEnterStudio}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-black font-sans font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span>ENTER ATELIER</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* 4. Smooth Transition Overlay to 3D Studio */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-[#100B1E] pointer-events-none flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <span className="w-3 h-3 rounded-full bg-botanical-marigold animate-ping" />
              <p className="font-serif italic text-sm tracking-luxury text-white/80">
                Entering 3D Scarf Studio...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Bottom Breathing Room */}
      <div className="h-6 sm:h-8 w-full" />
    </main>
  );
}
