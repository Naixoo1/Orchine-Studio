'use client';

import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';
import type { Card3DHandle } from './HolographicCard3DScene';

function Card3DLoading() {
  return (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center select-none">
      <div className="w-8 h-8 rounded-full border-2 border-white/25 border-t-white animate-spin mb-3" />
      <span className="font-mono text-xs uppercase tracking-widest text-white/75">
        Preparing 3D Signature Card...
      </span>
    </div>
  );
}

const DynamicCardScene = dynamic(
  () => import('./HolographicCard3DScene').then((mod) => mod.HolographicCard3DScene),
  {
    ssr: false,
    loading: () => <Card3DLoading />,
  }
);

interface HolographicCard3DProps {
  serialNumber?: string;
  isFlipped?: boolean;
  autoRotate?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  className?: string;
}

export const HolographicCard3D = forwardRef<Card3DHandle, HolographicCard3DProps>(
  function HolographicCard3D(
    {
      serialNumber = '#0000',
      isFlipped = false,
      autoRotate = true,
      onFlipChange,
      className = '',
    },
    ref
  ) {
    return (
      <div className={`w-full h-full min-h-[420px] ${className}`}>
        <DynamicCardScene
          ref={ref}
          serialNumber={serialNumber}
          isFlipped={isFlipped}
          autoRotate={autoRotate}
          onFlipChange={onFlipChange}
        />
      </div>
    );
  }
);
