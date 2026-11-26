'use client';

import React, { useEffect, useRef } from 'react';

interface TransparentOrchelliaVideoProps {
  src?: string;
  className?: string;
  ariaLabel?: string;
  maxDimension?: number;
}

/**
 * TransparentOrchelliaVideo
 *
 * Renders a dark-background MP4 character video onto a 2D canvas with real-time
 * luminance-keyed alpha transparency so Orchéllia floats cleanly by herself
 * with zero black backdrop or dark shadow.
 */
export function TransparentOrchelliaVideo({
  src = '/videos/orchellia-opening.mp4',
  className = 'w-full h-full object-contain',
  ariaLabel = 'Orchéllia Orchid Companion',
  maxDimension = 384,
}: TransparentOrchelliaVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let rafId = 0;
    let cancelled = false;

    const ensurePlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const renderFrame = () => {
      if (cancelled) return;

      if (!document.hidden && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const aspect = video.videoWidth / video.videoHeight;
        const targetW =
          aspect >= 1
            ? Math.min(maxDimension, video.videoWidth)
            : Math.round(Math.min(maxDimension, video.videoHeight) * aspect);
        const targetH =
          aspect >= 1
            ? Math.round(targetW / aspect)
            : Math.min(maxDimension, video.videoHeight);

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(video, 0, 0, targetW, targetH);

        const frame = ctx.getImageData(0, 0, targetW, targetH);
        const data = frame.data;

        const lowCutoff = 26;
        const highCutoff = 76;
        const range = highCutoff - lowCutoff;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const maxChannel = r > g ? (r > b ? r : b) : (g > b ? g : b);

          if (maxChannel <= lowCutoff) {
            data[i + 3] = 0;
          } else if (maxChannel < highCutoff) {
            const t = (maxChannel - lowCutoff) / range;
            const smoothAlpha = t * t * (3 - 2 * t);
            data[i + 3] = Math.round(smoothAlpha * 255);

            // Lift semi-transparent edge pixels slightly to eliminate dark halo fringe
            const lift = Math.min(1.6, 1 / Math.max(smoothAlpha, 0.35));
            data[i] = Math.min(255, Math.round(r * lift));
            data[i + 1] = Math.min(255, Math.round(g * lift));
            data[i + 2] = Math.min(255, Math.round(b * lift));
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    ensurePlay();
    video.addEventListener('canplay', ensurePlay);
    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      video.removeEventListener('canplay', ensurePlay);
    };
  }, [maxDimension, src]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        width={maxDimension}
        height={maxDimension}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed w-px h-px opacity-0 pointer-events-none -z-50"
      />
      <canvas
        ref={canvasRef}
        width={maxDimension}
        height={maxDimension}
        role="img"
        aria-label={ariaLabel}
        style={{ contain: 'layout style paint' }}
        className={`block ${className}`}
      />
    </>
  );
}
