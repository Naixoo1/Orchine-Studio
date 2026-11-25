export interface BotanicalComponent {
  name: string;
  scientificName: string;
  sourcePart: string;
  mordant: string;
  hueContribution: string;
}

export interface MaterialPhysicalProps {
  roughness: number;
  metalness: number;
  sheen: number;
  sheenRoughness: number;
  sheenColor: string;
  clearcoat: number;
  clearcoatRoughness: number;
  transmission: number;
  thickness: number;
  ior: number;
}

export interface WavePhysicsParams {
  baseFrequency: number;
  baseSpeed: number;
  amplitude: number;
  damping: number;
  cursorInfluence: number;
}

export type ScarfId = 'florave' | 'sylvea' | 'florielle' | 'naturea';
export type LegacyScarfId = 'solstice' | 'fern-whisper' | 'indigo-flora' | 'iron-oak';

export interface ScarfItem {
  id: ScarfId | LegacyScarfId;
  name: string;
  subtitle: string;
  tagline: string;
  season: string;
  price: number;
  currency: string;
  dimensions: string;
  material: string;
  weave: string;
  weight: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    sheen: string;
    background: string;
  };
  botanicals: BotanicalComponent[];
  dyeProcess: string;
  harvestNotes: string;
  materialProps: MaterialPhysicalProps;
  wavePhysics: WavePhysicsParams;
  texturePath: string;
  photoUrl: string;
  lookbookImages: string[];
  inStock: boolean;
  editionLimit: number;
  currentEdition: number;
  story: string;
  philosophy: string;
}

const floraveItem: ScarfItem = {
  id: 'florave',
  name: 'Floravé',
  subtitle: 'Flora + Nuansa Prancis',
  tagline: 'Keindahan alam yang tumbuh menjadi karya seni pada sutra habotai.',
  season: 'Edition I',
  price: 285,
  currency: 'USD',
  dimensions: '110cm × 110cm Square',
  material: '100% Organic Silk Habotai',
  weave: 'Hand-rolled hem, 12 momme silk',
  weight: '48g',
  palette: {
    primary: '#E8C547',
    secondary: '#F4E1A1',
    accent: '#BB9AEF',
    sheen: '#FFF2B1',
    background: '#1F1735',
  },
  botanicals: [
    {
      name: 'Silver Dollar Eucalyptus',
      scientificName: 'Eucalyptus cinerea',
      sourcePart: 'Mature sun-cured leaves',
      mordant: 'Alum potassium sulfate',
      hueContribution: 'Rust red, copper halos',
    },
    {
      name: 'French Marigold',
      scientificName: 'Tagetes patula',
      sourcePart: 'Fresh petal crush',
      mordant: 'Organic soy milk primer',
      hueContribution: 'Golden amber, sunlit yellow',
    },
  ],
  dyeProcess: 'Direct leaf bundle contact steaming for 180 minutes in artisanal cedar vats.',
  harvestNotes: 'Foraged from certified biodynamic coastal groves.',
  materialProps: {
    roughness: 0.32,
    metalness: 0.04,
    sheen: 1.0,
    sheenRoughness: 0.35,
    sheenColor: '#FFF2B1',
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    transmission: 0,
    thickness: 0.35,
    ior: 1.45,
  },
  wavePhysics: {
    baseFrequency: 1.2,
    baseSpeed: 0.8,
    amplitude: 0.18,
    damping: 0.94,
    cursorInfluence: 0.35,
  },
  texturePath: '/textures/solstice.webp',
  photoUrl: '/scarves/florave.webp',
  lookbookImages: [
    '/scarves/florave.webp',
    '/lookbook/solstice-01.webp',
    '/lookbook/solstice-02.webp',
  ],
  inStock: true,
  editionLimit: 100,
  currentEdition: 24,
  philosophy: 'Flora + nuansa nama Prancis. Filosofinya adalah keindahan alam yang tumbuh menjadi karya seni.',
  story:
    'Flora + nuansa nama Prancis. Filosofinya adalah keindahan alam yang tumbuh menjadi karya seni. Menampilkan motif daun keemasan dan sulur botani halus yang membekas abadi di atas sutra.',
};

const sylveaItem: ScarfItem = {
  id: 'sylvea',
  name: 'Sylvéa',
  subtitle: 'Terinspirasi Latin Silva (Hutan)',
  tagline: 'Melambangkan keindahan alam yang hidup melalui jejak daun alami.',
  season: 'Edition II',
  price: 295,
  currency: 'USD',
  dimensions: '110cm × 110cm Square',
  material: '100% Organic Silk Habotai',
  weave: 'Hand-rolled hem, 12 momme silk',
  weight: '48g',
  palette: {
    primary: '#7C8C78',
    secondary: '#BDC7B9',
    accent: '#BB9AEF',
    sheen: '#FFF2B1',
    background: '#162019',
  },
  botanicals: [
    {
      name: 'Sword Fern',
      scientificName: 'Polystichum munitum',
      sourcePart: 'Tender fronds',
      mordant: 'Light iron mineral wash',
      hueContribution: 'Olive sage frond silhouettes',
    },
    {
      name: 'Silver Dollar Eucalyptus',
      scientificName: 'Eucalyptus cinerea',
      sourcePart: 'Mature foliage',
      mordant: 'Alum mordant',
      hueContribution: 'Sun-warmed sage and amber discs',
    },
  ],
  dyeProcess: 'Cold leaf compression followed by low-temperature mineral steam extraction.',
  harvestNotes: 'Shade-gathered in deep Pacific northwest temperate rainforest understory.',
  materialProps: {
    roughness: 0.3,
    metalness: 0.03,
    sheen: 1.0,
    sheenRoughness: 0.32,
    sheenColor: '#FFF2B1',
    clearcoat: 0.35,
    clearcoatRoughness: 0.18,
    transmission: 0,
    thickness: 0.3,
    ior: 1.45,
  },
  wavePhysics: {
    baseFrequency: 1.4,
    baseSpeed: 0.7,
    amplitude: 0.16,
    damping: 0.95,
    cursorInfluence: 0.3,
  },
  texturePath: '/textures/fern-whisper.webp',
  photoUrl: '/scarves/sylvea.webp',
  lookbookImages: [
    '/scarves/sylvea.webp',
    '/lookbook/fern-whisper-01.webp',
    '/lookbook/fern-whisper-02.webp',
  ],
  inStock: true,
  editionLimit: 75,
  currentEdition: 18,
  philosophy: 'Terinspirasi dari kata Latin silva (hutan). Melambangkan keindahan alam yang hidup.',
  story:
    'Terinspirasi dari kata Latin silva (hutan). Melambangkan keindahan alam yang hidup. Susunan rapi daun kayu putih dan pakis hutan merekam kesejukan kanopi alami.',
};

const florielleItem: ScarfItem = {
  id: 'florielle',
  name: 'Floriellé',
  subtitle: 'Kreasi Bernuansa Floral',
  tagline: 'Melambangkan kelembutan, keindahan, dan keanggunan kreasi botani.',
  season: 'Edition III',
  price: 320,
  currency: 'USD',
  dimensions: '110cm × 110cm Square',
  material: '100% Organic Silk Habotai',
  weave: 'Hand-rolled hem, 14 momme silk',
  weight: '52g',
  palette: {
    primary: '#C48B9F',
    secondary: '#E8C5D8',
    accent: '#BB9AEF',
    sheen: '#FFF2B1',
    background: '#25192E',
  },
  botanicals: [
    {
      name: 'Wild Rose & Cosmos',
      scientificName: 'Rosa canina & Cosmos bipinnatus',
      sourcePart: 'Fresh pressed petals',
      mordant: 'Alum mordant bath',
      hueContribution: 'Pastel rose and gentle petal halos',
    },
    {
      name: 'True Indigo Vat',
      scientificName: 'Indigofera tinctoria',
      sourcePart: 'Fermented leaf reduction',
      mordant: 'Naturally reduced fructose vat',
      hueContribution: 'Luminous delicate azure accents',
    },
  ],
  dyeProcess: 'Layered resist leaf clamp immersion in gentle botanical contact baths.',
  harvestNotes: 'Delicate blossom petals picked during early morning dew.',
  materialProps: {
    roughness: 0.28,
    metalness: 0.05,
    sheen: 1.0,
    sheenRoughness: 0.3,
    sheenColor: '#FFF2B1',
    clearcoat: 0.4,
    clearcoatRoughness: 0.15,
    transmission: 0,
    thickness: 0.4,
    ior: 1.46,
  },
  wavePhysics: {
    baseFrequency: 1.1,
    baseSpeed: 0.9,
    amplitude: 0.2,
    damping: 0.92,
    cursorInfluence: 0.4,
  },
  texturePath: '/textures/indigo-flora.webp',
  photoUrl: '/scarves/florielle.webp',
  lookbookImages: [
    '/scarves/florielle.webp',
    '/lookbook/indigo-flora-01.webp',
    '/lookbook/indigo-flora-02.webp',
  ],
  inStock: true,
  editionLimit: 50,
  currentEdition: 12,
  philosophy: 'Nama kreasi bernuansa floral yang melambangkan kelembutan, keindahan, dan keanggunan.',
  story:
    'Nama kreasi bernuansa floral yang melambangkan kelembutan, keindahan, dan keanggunan. Imprint kuntum bunga lembut dan bingkai sutra halus merefleksikan estetika feminin yang anggun.',
};

const natureaItem: ScarfItem = {
  id: 'naturea',
  name: 'Naturéa',
  subtitle: 'Nature + Sentuhan Elegan',
  tagline: 'Keindahan alami yang dituangkan secara elegan ke dalam setiap helai kain.',
  season: 'Edition IV',
  price: 310,
  currency: 'USD',
  dimensions: '110cm × 110cm Square',
  material: '100% Organic Silk Habotai',
  weave: 'Hand-rolled hem, 12 momme silk',
  weight: '48g',
  palette: {
    primary: '#D49B42',
    secondary: '#8E5A23',
    accent: '#BB9AEF',
    sheen: '#FFF2B1',
    background: '#231826',
  },
  botanicals: [
    {
      name: 'English Oak Galls',
      scientificName: 'Quercus robur',
      sourcePart: 'Crushed tannin galls',
      mordant: 'Aged iron mineral water',
      hueContribution: 'Warm amber, smoke taupe, and mineral veining',
    },
    {
      name: 'Eucalyptus & Teak Leaf',
      scientificName: 'Tectona grandis',
      sourcePart: 'Sun-warmed mature leaves',
      mordant: 'Natural tannin self-mordanting',
      hueContribution: 'Terracotta and ochre gradients',
    },
  ],
  dyeProcess: 'High-tannin mineral bath with draped botanical contact steaming.',
  harvestNotes: 'Foraged fallen galls gathered beneath centenarian oak groves.',
  materialProps: {
    roughness: 0.35,
    metalness: 0.04,
    sheen: 0.95,
    sheenRoughness: 0.38,
    sheenColor: '#FFF2B1',
    clearcoat: 0.28,
    clearcoatRoughness: 0.22,
    transmission: 0,
    thickness: 0.45,
    ior: 1.45,
  },
  wavePhysics: {
    baseFrequency: 1.0,
    baseSpeed: 0.75,
    amplitude: 0.17,
    damping: 0.96,
    cursorInfluence: 0.32,
  },
  texturePath: '/textures/iron-oak.webp',
  photoUrl: '/scarves/naturea.webp',
  lookbookImages: [
    '/scarves/naturea.webp',
    '/lookbook/iron-oak-01.webp',
    '/lookbook/iron-oak-02.webp',
  ],
  inStock: true,
  editionLimit: 60,
  currentEdition: 31,
  philosophy: 'Nature + sentuhan elegan. Menggambarkan keindahan alami yang dituangkan ke dalam setiap helai kain.',
  story:
    'Nature + sentuhan elegan. Menggambarkan keindahan alami yang dituangkan ke dalam setiap helai kain. Gradasi tanah dan mineral hangat menghasilkan selendang megah bercorak organik.',
};

export const SCARVES: Record<string, ScarfItem> = {
  // Primary 4 SKUs from 4ModuleDesignandName.jpeg
  florave: floraveItem,
  sylvea: sylveaItem,
  florielle: florielleItem,
  naturea: natureaItem,

  // Backwards compatibility aliases
  solstice: floraveItem,
  'fern-whisper': sylveaItem,
  'indigo-flora': florielleItem,
  'iron-oak': natureaItem,
};

export const SCARF_LIST: ScarfItem[] = [
  floraveItem,
  sylveaItem,
  florielleItem,
  natureaItem,
];

export const DEFAULT_SCARF_ID: ScarfId = 'florave';
