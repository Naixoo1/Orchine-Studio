'use client';

import React from 'react';
import { EcoPassportStudio } from '@/components/passport/EcoPassportStudio';
import { SlideOverBag } from '@/components/cart/SlideOverBag';

export default function PassportPage() {
  return (
    <main className="relative min-h-screen w-full">
      <EcoPassportStudio />
      <SlideOverBag />
    </main>
  );
}
