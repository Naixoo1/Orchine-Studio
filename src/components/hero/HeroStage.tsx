'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronDown, Volume2, VolumeX } from 'lucide-react';

export function HeroStage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-play video backsound and handle browser audio autoplay policies gracefully
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 0.85;

    // Attempt to start playback with sound enabled
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // If browser policy blocked unmuted autoplay, start muted
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});

          // Automatically unmute on the very first user interaction anywhere on the page
          const enableAudioOnGesture = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 0.85;
              videoRef.current.play().catch(() => {});
              setIsMuted(false);
            }
            window.removeEventListener('click', enableAudioOnGesture);
            window.removeEventListener('keydown', enableAudioOnGesture);
            window.removeEventListener('touchstart', enableAudioOnGesture);
          };

          window.addEventListener('click', enableAudioOnGesture, { once: true });
          window.addEventListener('keydown', enableAudioOnGesture, { once: true });
          window.addEventListener('touchstart', enableAudioOnGesture, { once: true });
        });
    }
  }, []);

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 0.85;
      video.play().catch(() => {});
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-[#181232]">
      {/* Background Looping Cinematic Video with Continuous Sound */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/hero-loop.mp4"
          autoPlay
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Subtle Vignette Gradients for Luxury Atelier Ambiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181232] via-transparent to-[#181232]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#221D63]/20 to-[#120D22]/60 pointer-events-none" />
      </div>

      {/* Explore Collection Downward Chevron Indicator */}
      <button
        onClick={scrollToCollection}
        className="absolute bottom-8 z-20 flex flex-col items-center text-[#FFF2B1]/80 hover:text-[#FFF2B1] transition-colors group cursor-pointer"
        aria-label="Scroll to collection"
      >
        <span className="text-[10px] uppercase tracking-luxury mb-1.5 group-hover:tracking-[0.3em] transition-all text-[#BB9AEF] font-mono">
          Explore Collection
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#BB9AEF]" />
      </button>

      {/* Sound Toggle Control Pill */}
      <button
        onClick={toggleSound}
        className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center space-x-2 px-3.5 py-2 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
        aria-label={isMuted ? 'Turn on hero backsound' : 'Mute hero backsound'}
        title={isMuted ? 'Klik untuk nyalakan suara video' : 'Suara video aktif'}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-neutral-400" />
            <span className="text-[11px] font-mono text-neutral-300">
              Backsound Muted
            </span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-300">
              Backsound On
            </span>
          </>
        )}
      </button>
    </section>
  );
}
