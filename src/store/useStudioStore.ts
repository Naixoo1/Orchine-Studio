import { create } from 'zustand';
import { SCARVES, ScarfItem, DEFAULT_SCARF_ID } from '../data/scarves';
import { TEAM_MEMBERS } from '../data/team';
import { ambientSound } from '../utils/ambientAudio';

export type View3DPreset = 'front' | 'drape_detail' | 'full_spin' | 'top_down';
export type HeroMode = 'film' | 'canvas';
export type SectionId = 'hero' | 'collection' | 'craft' | 'lookbook';

export interface CartItem {
  scarfId: ScarfItem['id'];
  quantity: number;
  price: number;
}

export interface UIHighlightState {
  active: boolean;
  targetId: string | null;
  explanation: string | null;
}

export interface ZoomState {
  isZoomed: boolean;
  target: string | null;
  level: number;
}

export interface EcoPassportData {
  orderId: string;
  batchNumber: string;
  recipientName: string;
  date: string;
  coordinates: string;
  scarfName?: string;
  totalPaidUSD?: number;
}

const PASSPORT_COUNTER_KEY = 'orchine_passport_counter';
const PASSPORT_EDITIONS_KEY = 'orchine_minted_passports';

export function formatPassportSerial(index: number): string {
  const safeIndex = Math.max(0, Math.floor(index));
  return `#${String(safeIndex).padStart(4, '0')}`;
}

export interface TeamMember {
  id: string;
  name: string;
  classRole: string;
  classGrade?: string;
  instagram: string;
  instagramUrl?: string;
  phone: string;
  image: string;
  specimenNo?: string;
  botanicalDye?: string;
  botanicalLatin?: string;
  element?: string;
  quote?: string;
  themeSlug?: 'indigo' | 'eucalyptus' | 'fern' | 'oak';
}

export interface UserSettings {
  username: string;
  realName: string;
  theme: 'dark' | 'light';
}

export interface StudioState {
  // Scarf Selection
  activeScarfId: ScarfItem['id'];
  activeScarf: ScarfItem;

  // Hero Mode
  heroMode: HeroMode;

  // 3D Canvas State
  viewPreset: View3DPreset;
  cursor: {
    x: number; // Normalized -1 to 1
    y: number; // Normalized -1 to 1
    isHovering: boolean;
    intensity: number;
  };

  // Orchéllia UI Spotlight
  uiHighlight: UIHighlightState;

  // Orchéllia UI & Canvas Zoom
  zoomState: ZoomState;

  // Shopping Bag
  isBagOpen: boolean;
  cart: CartItem[];

  // Ambient Audio
  isAudioMuted: boolean;

  // Settings & Navigation Drawer
  isSettingsOpen: boolean;
  settings: UserSettings;

  // About Us Team Modal
  isAboutOpen: boolean;
  classLogo: string;
  teamMembers: TeamMember[];

  // Digital Eco-Passport & 3D Signature Card
  isEcoPassportOpen: boolean;
  activePassportData: EcoPassportData | null;
  passportCounter: number;
  mintedPassports: EcoPassportData[];
  hasHydratedPassports: boolean;

  // Actions
  selectScarf: (scarfId: ScarfItem['id']) => void;
  setHeroMode: (mode: HeroMode) => void;
  set3DView: (preset: View3DPreset) => void;
  setCursor: (coords: { x: number; y: number; isHovering?: boolean; intensity?: number }) => void;
  highlightUI: (targetId: string | null, explanation?: string | null) => void;
  clearUIHighlight: () => void;
  setZoom: (target: string | null, level?: number) => void;
  resetZoom: () => void;
  openBag: () => void;
  closeBag: () => void;
  toggleBag: () => void;
  addToBag: (scarfId?: ScarfItem['id'], quantity?: number) => void;
  removeFromBag: (scarfId: ScarfItem['id']) => void;
  updateBagQuantity: (scarfId: ScarfItem['id'], quantity: number) => void;
  toggleAudio: () => void;
  setAudioMuted: (muted: boolean) => void;

  // Settings Drawer Actions
  toggleSettings: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;

  // About Us Actions
  toggleAbout: () => void;
  openAbout: () => void;
  closeAbout: () => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  updateClassLogo: (logoUrl: string) => void;

  // Digital Eco-Passport Actions
  openEcoPassport: (data?: Partial<EcoPassportData>) => void;
  closeEcoPassport: () => void;
  toggleEcoPassport: () => void;
  hydratePassports: () => void;
  mintEcoPassport: (data?: Partial<Omit<EcoPassportData, 'batchNumber'>>) => EcoPassportData;
  selectPassportEdition: (batchNumber: string) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  // Initial Scarf
  activeScarfId: DEFAULT_SCARF_ID,
  activeScarf: SCARVES[DEFAULT_SCARF_ID],

  // Initial Hero Mode
  heroMode: 'canvas',

  // Initial 3D Canvas
  viewPreset: 'front',
  cursor: {
    x: 0,
    y: 0,
    isHovering: false,
    intensity: 0,
  },

  // Initial UI Highlight
  uiHighlight: {
    active: false,
    targetId: null,
    explanation: null,
  },

  // Initial Zoom
  zoomState: {
    isZoomed: false,
    target: null,
    level: 1.0,
  },

  // Initial Bag
  isBagOpen: false,
  cart: [],

  // Initial Audio
  isAudioMuted: true,

  // Initial Settings & Navigation
  isSettingsOpen: false,
  settings: {
    username: 'OrchineVisitor',
    realName: 'Atelier Guest',
    theme: 'dark',
  },

  // Initial About Us Team
  isAboutOpen: false,
  classLogo: '/brand/orchid-flower-transparent.png',
  teamMembers: TEAM_MEMBERS,

  // Initial Eco-Passport State
  isEcoPassportOpen: false,
  activePassportData: null,
  passportCounter: 0,
  mintedPassports: [],
  hasHydratedPassports: false,

  // Actions
  selectScarf: (scarfId) => {
    const scarf = SCARVES[scarfId];
    if (scarf) {
      set({
        activeScarfId: scarfId,
        activeScarf: scarf,
      });
    }
  },

  setHeroMode: (mode) => set({ heroMode: mode }),

  set3DView: (preset) => set({ viewPreset: preset }),

  setCursor: ({ x, y, isHovering, intensity }) =>
    set((state) => ({
      cursor: {
        x,
        y,
        isHovering: isHovering !== undefined ? isHovering : state.cursor.isHovering,
        intensity: intensity !== undefined ? intensity : state.cursor.intensity,
      },
    })),

  highlightUI: (targetId, explanation = null) =>
    set({
      uiHighlight: {
        active: Boolean(targetId),
        targetId,
        explanation: explanation ?? null,
      },
    }),

  clearUIHighlight: () =>
    set({
      uiHighlight: {
        active: false,
        targetId: null,
        explanation: null,
      },
    }),

  setZoom: (target, level = 1.6) =>
    set({
      zoomState: {
        isZoomed: Boolean(target),
        target,
        level: target ? level : 1.0,
      },
    }),

  resetZoom: () =>
    set({
      zoomState: {
        isZoomed: false,
        target: null,
        level: 1.0,
      },
    }),

  openBag: () => set({ isBagOpen: true }),
  closeBag: () => set({ isBagOpen: false }),
  toggleBag: () => set((state) => ({ isBagOpen: !state.isBagOpen })),

  addToBag: (scarfId, quantity = 1) => {
    const targetId = scarfId ?? get().activeScarfId;
    const scarf = SCARVES[targetId];
    if (!scarf) return;

    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.scarfId === targetId);
      if (existingIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += quantity;
        return { cart: updatedCart, isBagOpen: true };
      }
      return {
        cart: [...state.cart, { scarfId: targetId, quantity, price: scarf.price }],
        isBagOpen: true,
      };
    });
  },

  removeFromBag: (scarfId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.scarfId !== scarfId),
    })),

  updateBagQuantity: (scarfId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((item) => item.scarfId !== scarfId) };
      }
      return {
        cart: state.cart.map((item) =>
          item.scarfId === scarfId ? { ...item, quantity } : item
        ),
      };
    }),

  toggleAudio: () => {
    const nextMuted = !get().isAudioMuted;
    set({ isAudioMuted: nextMuted });
    if (typeof window !== 'undefined' && ambientSound) {
      if (nextMuted) {
        ambientSound.pause();
      } else {
        ambientSound.play();
      }
    }
  },
  setAudioMuted: (muted) => {
    set({ isAudioMuted: muted });
    if (typeof window !== 'undefined' && ambientSound) {
      if (muted) {
        ambientSound.pause();
      } else {
        ambientSound.play();
      }
    }
  },

  // Settings Drawer Actions
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // About Us Actions
  toggleAbout: () => set((state) => ({ isAboutOpen: !state.isAboutOpen })),
  openAbout: () => set({ isAboutOpen: true }),
  closeAbout: () => set({ isAboutOpen: false }),
  updateTeamMember: (id, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      ),
    })),
  updateClassLogo: (logoUrl) => set({ classLogo: logoUrl }),

  // Digital Eco-Passport Actions
  hydratePassports: () => {
    if (typeof window === 'undefined' || get().hasHydratedPassports) return;
    try {
      const rawCounter = window.localStorage.getItem(PASSPORT_COUNTER_KEY);
      const rawEditions = window.localStorage.getItem(PASSPORT_EDITIONS_KEY);
      const parsedCounter = rawCounter ? Math.max(0, parseInt(rawCounter, 10) || 0) : 0;
      const parsedEditions: EcoPassportData[] = rawEditions ? JSON.parse(rawEditions) : [];
      const validEditions = Array.isArray(parsedEditions) ? parsedEditions : [];
      const latestEdition = validEditions.length > 0 ? validEditions[validEditions.length - 1] : null;
      set({
        passportCounter: Math.max(parsedCounter, validEditions.length),
        mintedPassports: validEditions,
        activePassportData: get().activePassportData || latestEdition,
        hasHydratedPassports: true,
      });
    } catch {
      set({ hasHydratedPassports: true });
    }
  },
  mintEcoPassport: (data) => {
    get().hydratePassports();
    const state = get();
    const currentIndex = state.passportCounter;
    const batchNumber = formatPassportSerial(currentIndex);
    const newPassport: EcoPassportData = {
      orderId: data?.orderId || `ORCH-2026-${String(currentIndex).padStart(4, '0')}`,
      batchNumber,
      recipientName: data?.recipientName || state.settings.realName || 'Patron of the Atelier',
      date:
        data?.date ||
        new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      coordinates: data?.coordinates || '37°46\'29.7"N 122°25\'09.8"W',
      scarfName: data?.scarfName || state.activeScarf.name,
      totalPaidUSD: data?.totalPaidUSD ?? state.activeScarf.price,
    };

    const nextCounter = currentIndex + 1;
    const updatedEditions = [...state.mintedPassports, newPassport];

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(PASSPORT_COUNTER_KEY, String(nextCounter));
        window.localStorage.setItem(PASSPORT_EDITIONS_KEY, JSON.stringify(updatedEditions));
      } catch {
        // Ignore storage quota errors in restricted browsers
      }
    }

    set({
      passportCounter: nextCounter,
      mintedPassports: updatedEditions,
      activePassportData: newPassport,
    });

    return newPassport;
  },
  selectPassportEdition: (batchNumber) => {
    const found = get().mintedPassports.find((p) => p.batchNumber === batchNumber);
    if (found) {
      set({ activePassportData: found });
    }
  },
  openEcoPassport: (data) => {
    const currentActive = get().activePassportData;
    set({
      isEcoPassportOpen: true,
      activePassportData: {
        orderId: data?.orderId || currentActive?.orderId || 'ORCH-2026-X84K',
        batchNumber: data?.batchNumber || currentActive?.batchNumber || '#0000',
        recipientName: data?.recipientName || currentActive?.recipientName || 'Patron of the Atelier',
        date:
          data?.date ||
          currentActive?.date ||
          new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        coordinates: data?.coordinates || currentActive?.coordinates || '37°46\'29.7"N 122°25\'09.8"W',
        scarfName: data?.scarfName || currentActive?.scarfName || 'Botanical Eco-Print Silk',
        totalPaidUSD: data?.totalPaidUSD ?? currentActive?.totalPaidUSD ?? 285,
      },
    });
  },
  closeEcoPassport: () => set({ isEcoPassportOpen: false }),
  toggleEcoPassport: () =>
    set((state) => ({ isEcoPassportOpen: !state.isEcoPassportOpen })),
}));
