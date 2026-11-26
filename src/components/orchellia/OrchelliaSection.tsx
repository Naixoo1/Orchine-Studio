'use client';

import React, { useState, useRef } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Bot, Play, Pause, Compass, Eye, ShoppingBag, Volume2, ArrowRight, HelpCircle } from 'lucide-react';

export function OrchelliaSection() {
  const [activeVideo, setActiveVideo] = useState<'opening' | 'tutorial'>('opening');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGuideStep, setActiveGuideStep] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const selectScarf = useStudioStore((state) => state.selectScarf);
  const set3DView = useStudioStore((state) => state.set3DView);
  const setHeroMode = useStudioStore((state) => state.setHeroMode);
  const addToBag = useStudioStore((state) => state.addToBag);
  const highlightUI = useStudioStore((state) => state.highlightUI);

  const handleVideoSwitch = (type: 'opening' | 'tutorial') => {
    setActiveVideo(type);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Live Demo Interactive Actions: Orchéllia actively controls the website
  const guidedDemos = [
    {
      title: '1. Scarf Silk Inspection',
      desc: 'Orchéllia rotates the 3D habotai silk to reveal delicate edge seams and hem details.',
      action: () => {
        setActiveGuideStep(0);
        selectScarf('solstice');
        set3DView('drape_detail');
        setHeroMode('canvas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        highlightUI('canvas', 'Observing high-density silk weave under grazing specular illumination.');
      },
    },
    {
      title: '2. Botanical Colorway Switch',
      desc: 'Orchéllia swaps the active atelier batch to Indigo Flora fermented in bacterial vats.',
      action: () => {
        setActiveGuideStep(1);
        selectScarf('indigo-flora');
        set3DView('front');
        setHeroMode('canvas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      title: '3. 2.5× Macro Loupe Tour',
      desc: 'Orchéllia smooth-scrolls to the Craft Lab to examine microscopic leaf tannin bleed.',
      action: () => {
        setActiveGuideStep(2);
        const el = document.getElementById('craft');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        highlightUI('craft', 'Fallen oak galls gathered beneath centenarian oak groves.');
      },
    },
    {
      title: '4. Atelier Bag Addition',
      desc: 'Orchéllia adds Fern Whisper to your simulated shopping bag and opens the drawer.',
      action: () => {
        setActiveGuideStep(3);
        addToBag('fern-whisper', 1);
      },
    },
  ];

  return (
    <section id="orchellia-guide" className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-24 z-20">
      {/* Nike-Style Feature Headline Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#BB9AEF] mb-2">
            <Bot className="w-4 h-4 text-[#BB9AEF] animate-pulse" />
            <span className="text-[#FFC8DD]">Interactive Atelier Service • Intelligent Guidance</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#FFF2B1] tracking-tight">
            Meet Orchéllia AI Companion
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#FFF2B1]/75 max-w-md font-light">
          Your personal conversational guide through botanical eco-printing traditions. Orchéllia explains techniques and commands the 3D atelier in real time.
        </p>
      </div>

      {/* Main Split Layout: Left Video Player ⟷ Right Live Demo Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Video Stage (Opening & Tutorial Reference Videos) */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Top Video Controls Switcher */}
          <div className="flex items-center justify-between mb-4 z-10">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BB9AEF] animate-ping" />
              <span className="text-xs font-serif uppercase tracking-wider text-[#FFF2B1]">
                {activeVideo === 'opening' ? 'Orchéllia Introduction' : 'Interactive Website Tutorial'}
              </span>
            </div>

            <div className="flex items-center space-x-2 glass-pill p-1 rounded-full border border-[#BB9AEF]/20">
              <button
                onClick={() => handleVideoSwitch('opening')}
                className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider transition-all ${
                  activeVideo === 'opening'
                    ? 'bg-[#BB9AEF] text-[#221D63] font-semibold'
                    : 'text-[#FFF2B1]/70 hover:text-[#FFF2B1]'
                }`}
              >
                Opening Video
              </button>
              <button
                onClick={() => handleVideoSwitch('tutorial')}
                className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider transition-all ${
                  activeVideo === 'tutorial'
                    ? 'bg-[#BB9AEF] text-[#221D63] font-semibold'
                    : 'text-[#FFF2B1]/70 hover:text-[#FFF2B1]'
                }`}
              >
                Live Demo Tutorial
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-brand-charcoal border border-white/10 shadow-inner group">
            <video
              ref={videoRef}
              key={activeVideo}
              src={activeVideo === 'opening' ? '/videos/orchellia-opening.mp4' : '/videos/orchellia-tutorial.mp4'}
              poster="/brand/orchellia-transparent.png"
              width={1280}
              height={720}
              preload="none"
              playsInline
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="block w-full h-full object-cover"
            />

            {/* Video Play/Pause Overlay Overlay */}
            <div
              onClick={togglePlay}
              className={`absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <div className="w-16 h-16 rounded-full glass-panel border border-[#BB9AEF] flex items-center justify-center text-[#BB9AEF] shadow-2xl transition-transform group-hover:scale-110">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
              </div>
            </div>

            {/* Video Caption Bar */}
            <div className="absolute bottom-3 inset-x-3 glass-pill px-3 py-1.5 rounded-xl flex items-center justify-between text-[10px] text-[#FFF2B1]/80 font-mono pointer-events-none">
              <span>{activeVideo === 'opening' ? 'Canonical Reference: Orchéllia AI Opening' : 'Canonical Reference: AI Orchéllia Tutorial'}</span>
              <span className="text-[#BB9AEF]">Click anywhere to {isPlaying ? 'pause' : 'play'}</span>
            </div>
          </div>

          {/* Video Summary Note */}
          <p className="mt-4 text-xs text-[#FFF2B1]/70 font-light leading-relaxed">
            {activeVideo === 'opening'
              ? 'Watch how Orchéllia introduces first-time visitors to the botanical scarf atelier, welcoming them to explore organic silk Habotai.'
              : 'Follow Orchéllia step-by-step as she demonstrates how to use the 3D scarf controls, toggle friend lookbook photography, and trigger simulated checkout.'}
          </p>
        </div>

        {/* Right Column: Interactive Live Demo Guide (Orchéllia Commands the Site) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#BB9AEF] mb-3">
              <Compass className="w-3.5 h-3.5 text-[#BB9AEF]" />
              <span className="text-[#FFC8DD]">Interactive Live Demo</span>
            </div>
            <h3 className="font-serif text-2xl text-brand-ecru mb-2">
              Experience Site Control
            </h3>
            <p className="text-xs text-brand-sand/70 font-light leading-relaxed mb-6">
              Click any guided demo below to see Orchéllia physically control the website layout, rotate the 3D silk mesh, and navigate sections:
            </p>

            {/* Interactive Guided Action Cards */}
            <div className="space-y-3">
              {guidedDemos.map((demo, idx) => {
                const isActive = activeGuideStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={demo.action}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start justify-between group ${
                      isActive
                        ? 'glass-panel border-[#BB9AEF]/70 shadow-lg'
                        : 'glass-pill hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-sm text-[#FFF2B1] group-hover:text-[#BB9AEF] transition-colors">
                          {demo.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#FFF2B1]/70 font-light mt-1 leading-snug">
                        {demo.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#BB9AEF] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assistant Direct Prompt Footer */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-sand/50">
            <span>Powered by OpenAI & Web Speech API</span>
            <span className="font-mono text-[#BB9AEF]">4 Demos Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
