'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore, TeamMember } from '@/store/useStudioStore';
import {
  X,
  Upload,
  Instagram,
  Phone,
  Shield,
  Leaf,
  Feather,
  Camera,
  Check,
  Edit2,
  Code,
  Box,
  Palette,
  Mic,
} from 'lucide-react';

// Botanical Leaf Silhouette SVGs for Specimen Plates
function BotanicalWatermark({ type }: { type: string }) {
  if (type === 'indigo') {
    return (
      <svg
        className="absolute -right-6 -bottom-6 w-36 h-36 opacity-[0.07] pointer-events-none text-botanical-indigo transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 10 C35 30 20 50 25 75 C30 85 45 90 50 90 C55 90 70 85 75 75 C80 50 65 30 50 10 Z M50 25 C58 45 65 60 60 75 C55 80 50 82 50 82 C50 82 45 80 40 75 C35 60 42 45 50 25 Z" />
        <path d="M50 90 L50 98" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="40" r="6" />
        <circle cx="72" cy="40" r="6" />
        <circle cx="22" cy="55" r="7" />
        <circle cx="78" cy="55" r="7" />
      </svg>
    );
  }
  if (type === 'eucalyptus') {
    return (
      <svg
        className="absolute -right-6 -bottom-6 w-36 h-36 opacity-[0.08] pointer-events-none text-botanical-eucalyptus transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <ellipse cx="50" cy="50" rx="30" ry="24" transform="rotate(-25 50 50)" />
        <ellipse cx="65" cy="30" rx="20" ry="16" transform="rotate(15 65 30)" />
        <ellipse cx="35" cy="70" rx="22" ry="17" transform="rotate(-10 35 70)" />
        <path d="M20 85 Q50 50 80 15" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
    );
  }
  if (type === 'fern') {
    return (
      <svg
        className="absolute -right-6 -bottom-6 w-36 h-36 opacity-[0.08] pointer-events-none text-botanical-sage transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M20 90 Q40 50 80 10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M30 75 C20 70 20 65 33 72" stroke="currentColor" strokeWidth="3" />
        <path d="M35 70 C48 65 50 72 38 73" stroke="currentColor" strokeWidth="3" />
        <path d="M42 60 C30 52 32 48 45 58" stroke="currentColor" strokeWidth="3" />
        <path d="M48 54 C60 48 62 55 51 57" stroke="currentColor" strokeWidth="3" />
        <path d="M55 42 C45 35 48 30 58 40" stroke="currentColor" strokeWidth="3" />
        <path d="M62 35 C72 30 73 37 64 38" stroke="currentColor" strokeWidth="3" />
        <path d="M68 25 C60 18 63 15 70 23" stroke="currentColor" strokeWidth="3" />
        <path d="M74 18 C82 14 82 20 75 21" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }
  // oak
  return (
    <svg
      className="absolute -right-6 -bottom-6 w-36 h-36 opacity-[0.08] pointer-events-none text-botanical-marigold transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12"
      viewBox="0 0 100 100"
      fill="currentColor"
    >
      <path d="M50 15 C45 25 35 25 40 38 C30 40 32 52 42 54 C35 62 38 72 48 74 C47 82 53 82 52 74 C62 72 65 62 58 54 C68 52 70 40 60 38 C65 25 55 25 50 15 Z" />
      <path d="M50 74 L50 92" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Icon for member craft specialty
function CraftRoleIcon({ role }: { role: string }) {
  const r = role.toLowerCase();
  if (r.includes('tech') || r.includes('code') || r.includes('dev')) {
    return <Code className="w-3.5 h-3.5 text-botanical-marigold" />;
  }
  if (r.includes('3d') || r.includes('mesh')) {
    return <Box className="w-3.5 h-3.5 text-botanical-eucalyptus" />;
  }
  if (r.includes('lookbook') || r.includes('photo') || r.includes('editorial')) {
    return <Palette className="w-3.5 h-3.5 text-pink-300" />;
  }
  return <Mic className="w-3.5 h-3.5 text-botanical-marigold" />;
}

export function AboutUsModal() {
  const isAboutOpen = useStudioStore((state) => state.isAboutOpen);
  const closeAbout = useStudioStore((state) => state.closeAbout);
  const teamMembers = useStudioStore((state) => state.teamMembers);
  const updateTeamMember = useStudioStore((state) => state.updateTeamMember);
  const classLogo = useStudioStore((state) => state.classLogo);
  const updateClassLogo = useStudioStore((state) => state.updateClassLogo);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const memberInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Inline editing state for individual member details
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<TeamMember>>({});

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAboutOpen) {
        if (editingMemberId) {
          setEditingMemberId(null);
        } else {
          closeAbout();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAboutOpen, closeAbout, editingMemberId]);

  if (!isAboutOpen) return null;

  // Handle local image upload for Class Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateClassLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image upload for Team Members
  const handleMemberUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateTeamMember(id, { image: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setEditFormData({
      name: member.name,
      classRole: member.classRole,
      instagram: member.instagram,
      phone: member.phone,
    });
  };

  const saveEditing = (id: string) => {
    updateTeamMember(id, editFormData);
    setEditingMemberId(null);
  };

  const getBotanicalType = (index: number) => {
    switch (index) {
      case 0:
        return 'indigo';
      case 1:
        return 'eucalyptus';
      case 2:
        return 'fern';
      default:
        return 'oak';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        {/* Deep Forest Twilight Backdrop with Subtle Parchment Texture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeAbout}
          className="fixed inset-0 bg-[#070B09]/90 backdrop-blur-2xl"
        >
          {/* Ambient Botanical Spore Motes */}
          <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-botanical-sage/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-botanical-marigold/10 rounded-full blur-[120px] pointer-events-none" />
        </motion.div>

        {/* Master Archival Folio Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl bg-[#0D1410] border border-[#2D3F33] rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-6 sm:p-10 md:p-12 overflow-hidden my-auto text-brand-ecru z-10"
        >
          {/* Antique Brass Corner Accent Pins */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-botanical-marigold/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-botanical-marigold/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-botanical-marigold/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-botanical-marigold/40 rounded-br-sm pointer-events-none" />

          {/* Naturalist Specimen Watermark Accent */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-botanical-eucalyptus/5 blur-3xl pointer-events-none" />

          {/* Folio Header Section */}
          <div className="flex items-start justify-between border-b border-[#25362B] pb-6 mb-8 relative z-10">
            <div className="flex items-center space-x-4">
              {/* Botanical Medallion Icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-[#14211A] border border-botanical-marigold/40 flex items-center justify-center p-2.5 shadow-inner">
                <Image
                  src="/brand/orchid-flower-transparent.png"
                  alt="Orchid Icon"
                  width={44}
                  height={44}
                  className="object-contain drop-shadow"
                />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-botanical-marigold opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-botanical-marigold" />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-botanical-marigold uppercase">
                    HERBARIUM VIVUM • COHORT ARCHIVE
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-[10px] font-mono tracking-widest text-brand-sand/50 uppercase">
                    ANNO 2026
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-editorial text-white uppercase mt-0.5">
                  The Atelier Creators & Heritage
                </h2>
                <p className="text-xs text-brand-sand/65 font-light tracking-wide mt-1 max-w-xl">
                  Four botanical artisans documenting the living chemistry of eco-printed silk, natural plant dyes, and interactive digital craft.
                </p>
              </div>
            </div>

            {/* Tactile Close Button */}
            <button
              onClick={closeAbout}
              className="group p-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-botanical-marigold/50 hover:bg-botanical-marigold/10 transition-all text-brand-sand/70 hover:text-white"
              aria-label="Close Archival Folio"
              title="Close (ESC)"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Centerpiece: The Sacred Class Emblem & Heritage Seal */}
          <div className="flex flex-col items-center justify-center mb-10 relative z-10">
            <div
              className="relative group cursor-pointer"
              onClick={() => logoInputRef.current?.click()}
              title="Click to imprint or change Class Emblem"
            >
              {/* Wax Seal / Gilded Medallion Outer Bezel */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#1E2E23] via-[#152019] to-[#0A100C] border-2 border-botanical-marigold/60 p-2 shadow-[0_0_35px_rgba(212,155,66,0.18)] group-hover:border-botanical-marigold group-hover:shadow-[0_0_45px_rgba(212,155,66,0.35)] transition-all duration-300 flex items-center justify-center">
                {/* Inner Archival Stamp Ring */}
                <div className="w-full h-full rounded-full border border-dashed border-botanical-marigold/40 flex items-center justify-center p-3 relative overflow-hidden bg-black/30">
                  <Image
                    src={classLogo}
                    alt="Class Emblem"
                    width={80}
                    height={80}
                    className="object-contain max-h-full max-w-full drop-shadow filter group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Upload Seal */}
                  <div className="absolute inset-0 bg-[#070D0A]/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-full backdrop-blur-xs">
                    <Camera className="w-5 h-5 text-botanical-marigold mb-0.5" />
                    <span className="text-[8px] font-mono uppercase tracking-wider text-white">Press Seal</span>
                  </div>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-center mt-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-botanical-marigold/10 border border-botanical-marigold/30 text-[10px] font-mono tracking-widest text-botanical-marigold uppercase">
                <Shield className="w-3 h-3 text-botanical-marigold" />
                <span>CLASS EMBLEM & COHORT INSIGNIA</span>
              </div>
              <span className="block text-xs font-serif tracking-widest text-brand-sand/70 uppercase mt-1">
                Archival Cohort Insignia & Collective Lineage
              </span>
              <span className="block text-[9px] font-mono text-brand-sand/40 tracking-wider">
                Click medallion to upload custom class badge
              </span>
            </div>
          </div>

          {/* 4 Creator Botanical Dossiers (Specimen Plates) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {teamMembers.map((member, idx) => {
              const botanicalType = getBotanicalType(idx);
              const isEditing = editingMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className="group relative bg-[#111A14]/90 border border-[#27382D] hover:border-botanical-marigold/60 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  {/* Subtle Botanical Leaf Silhouette Watermark */}
                  <BotanicalWatermark type={botanicalType} />

                  {/* Top Specimen Plate Tag */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-4">
                      <span className="text-[9px] font-mono tracking-widest text-botanical-marigold uppercase flex items-center space-x-1">
                        <Feather className="w-2.5 h-2.5 mr-0.5" />
                        <span>{member.specimenNo || `PLATE 0${idx + 1}`}</span>
                      </span>

                      {/* Quick Edit Action Button */}
                      {!isEditing ? (
                        <button
                          onClick={() => startEditing(member)}
                          className="opacity-40 group-hover:opacity-100 p-1 text-brand-sand/70 hover:text-botanical-marigold transition-opacity"
                          title="Edit details"
                          aria-label={`Edit ${member.name} details`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => saveEditing(member.id)}
                          className="p-1 text-botanical-marigold hover:text-white transition-colors"
                          title="Save details"
                          aria-label={`Save ${member.name} details`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Oval Archival Portrait Slot */}
                    <div className="flex justify-center mb-4">
                      <div
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#0A0F0D] border-2 border-botanical-marigold/40 group-hover:border-botanical-marigold shadow-md cursor-pointer transition-all duration-300"
                        onClick={() => memberInputRefs.current[member.id]?.click()}
                        title="Click to upload portrait"
                      >
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={112}
                          height={112}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Hover Portrait Overlay */}
                        <div className="absolute inset-0 bg-[#070D0A]/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-full backdrop-blur-xs">
                          <Upload className="w-4 h-4 text-botanical-marigold mb-0.5" />
                          <span className="text-[8px] font-mono uppercase text-white tracking-wider">
                            Upload Photo
                          </span>
                        </div>
                        <input
                          type="file"
                          ref={(el) => {
                            memberInputRefs.current[member.id] = el;
                          }}
                          onChange={(e) => handleMemberUpload(member.id, e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Member Details or Editable Form */}
                    <div className="text-center space-y-2">
                      {!isEditing ? (
                        <>
                          {/* Name */}
                          <h4 className="font-serif text-lg text-white font-medium group-hover:text-botanical-marigold transition-colors">
                            {member.name}
                          </h4>

                          {/* Role with Icon */}
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-brand-sand/90 font-mono">
                            <CraftRoleIcon role={member.classRole} />
                            <span>{member.classRole}</span>
                          </div>

                          {/* Botanical Classification Badge */}
                          {member.botanicalDye && (
                            <div className="pt-1.5 pb-0.5">
                              <span className="block text-[10px] font-serif italic text-botanical-marigold">
                                {member.botanicalLatin}
                              </span>
                              <span className="text-[9px] font-mono uppercase tracking-widest text-brand-sand/50">
                                {member.botanicalDye}
                              </span>
                            </div>
                          )}

                          {/* Ethos Quote */}
                          {member.quote && (
                            <p className="text-[10px] font-serif italic text-brand-sand/65 px-1 leading-snug">
                              &ldquo;{member.quote}&rdquo;
                            </p>
                          )}
                        </>
                      ) : (
                        /* Inline Edit Form */
                        <div className="space-y-2 text-left pt-1">
                          <div>
                            <label className="text-[9px] font-mono text-botanical-marigold uppercase block mb-0.5">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editFormData.name || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full bg-[#0A0F0D] border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:border-botanical-marigold outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-botanical-marigold uppercase block mb-0.5">
                              Role / Class
                            </label>
                            <input
                              type="text"
                              value={editFormData.classRole || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, classRole: e.target.value })}
                              className="w-full bg-[#0A0F0D] border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:border-botanical-marigold outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-botanical-marigold uppercase block mb-0.5">
                              Instagram
                            </label>
                            <input
                              type="text"
                              value={editFormData.instagram || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, instagram: e.target.value })}
                              className="w-full bg-[#0A0F0D] border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:border-botanical-marigold outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-botanical-marigold uppercase block mb-0.5">
                              Phone
                            </label>
                            <input
                              type="text"
                              value={editFormData.phone || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                              className="w-full bg-[#0A0F0D] border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:border-botanical-marigold outline-none"
                            />
                          </div>
                          <button
                            onClick={() => saveEditing(member.id)}
                            className="w-full mt-2 py-1 rounded-lg bg-botanical-marigold text-black font-mono text-[10px] uppercase tracking-wider font-semibold hover:bg-yellow-400 transition-colors"
                          >
                            Save Specimen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plate Footer: Contact Channels */}
                  {!isEditing && (
                    <div className="pt-4 mt-4 border-t border-white/[0.08] space-y-1.5 text-xs text-brand-sand/80">
                      {/* Instagram */}
                      <div className="flex items-center justify-center space-x-1.5 text-[11px] hover:text-white transition-colors">
                        <Instagram className="w-3.5 h-3.5 text-pink-300" />
                        <span className="font-light tracking-wide">{member.instagram}</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-center space-x-1.5 text-[11px] hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-botanical-marigold" />
                        <span className="font-light tracking-wide">{member.phone}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Archival Folio Footer */}
          <div className="mt-8 pt-5 border-t border-[#25362B] flex flex-col sm:flex-row items-center justify-between text-xs text-brand-sand/55 font-light gap-2 relative z-10">
            <div className="flex items-center space-x-2">
              <Leaf className="w-3.5 h-3.5 text-botanical-marigold" />
              <span>Tap any creator portrait or the central seal to update photography and insignia.</span>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-botanical-marigold/80 uppercase">
              <span>ORCHINÉ ATELIER</span>
              <span>•</span>
              <span>FOUR-LEAF BOTANICAL HERBARIUM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
