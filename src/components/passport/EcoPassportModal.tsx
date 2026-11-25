'use client';

import React from 'react';
import { useStudioStore, EcoPassportData } from '@/store/useStudioStore';
import { EcoPassportStudio } from './EcoPassportStudio';

interface EcoPassportModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  data?: EcoPassportData | null;
}

export function EcoPassportModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  data: propData,
}: EcoPassportModalProps) {
  const storeIsOpen = useStudioStore((state) => state.isEcoPassportOpen);
  const storeClose = useStudioStore((state) => state.closeEcoPassport);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const handleClose = propOnClose || storeClose;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="3D Signature Card Eco-Passport"
    >
      <EcoPassportStudio onClose={handleClose} overrideData={propData} />
    </div>
  );
}
