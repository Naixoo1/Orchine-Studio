/**
 * Orchiné Studio - Atelier Team & Class Configuration
 *
 * Single source of truth for the About Us / Credits page.
 * Anchored to canonical botanical eco-print plantation references:
 * - IndigoLeaves.jpg (Indigofera tinctoria)
 * - SilverDollarEucalyptus.jpg (Eucalyptus cinerea)
 * - ForestSwordFern.jpg (Polystichum munitum)
 * - IronOakGall.png (Quercus robur & Gallotannins)
 */

export type BotanicalThemeSlug = 'indigo' | 'eucalyptus' | 'fern' | 'oak';

export interface PlantationAccessory {
  label: string;
  value: string;
  category: 'morphology' | 'pigment' | 'mordant' | 'harvest';
}

export interface BotanicalThemeConfig {
  slug: BotanicalThemeSlug;
  title: string;
  botanicalTitle: string;
  scientificName: string;
  plantFamily: string;
  paletteName: string;
  primaryHex: string;
  accentHex: string;
  glowRgba: string;
  cardBgGradient: string;
  borderClass: string;
  borderHoverClass: string;
  tagBgClass: string;
  tagTextClass: string;
  craftRoleTag: string;
  craftIconName: 'Code2' | 'Palette' | 'Leaf' | 'Flame' | 'Box' | 'Camera' | 'Mic';
  elementalStage: string;
  tagline: string;
  botanicalImage: string;
  referenceSource: string;
  plantationHabitat: string;
  harvestSeason: string;
  plantationAccessories: PlantationAccessory[];
}

export const BOTANICAL_THEMES: Record<BotanicalThemeSlug, BotanicalThemeConfig> = {
  indigo: {
    slug: 'indigo',
    title: 'The Digital Loom',
    botanicalTitle: 'Fermented Indigo Vat',
    scientificName: 'Indigofera tinctoria',
    plantFamily: 'Fabaceae (Legume Family)',
    paletteName: 'Midnight Indigo & Cyan Luminescence',
    primaryHex: '#38BDF8',
    accentHex: '#6366F1',
    glowRgba: 'rgba(56, 189, 248, 0.25)',
    cardBgGradient: 'from-[#0A1226]/95 via-[#0F1B3B]/95 to-[#070D1E]/95',
    borderClass: 'border-sky-500/35',
    borderHoverClass: 'hover:border-sky-400 hover:shadow-[0_0_40px_rgba(56,189,248,0.3)]',
    tagBgClass: 'bg-sky-500/15',
    tagTextClass: 'text-sky-300',
    craftRoleTag: 'Lead Developer',
    craftIconName: 'Code2',
    elementalStage: 'Stage IV: Natural Vat Oxidation & Reduction',
    tagline: 'Weaving real-time WebGL ripples, dynamic cloth physics, and Next.js reactive architecture.',
    botanicalImage: '/botanicals/indigo-leaves.webp',
    referenceSource: 'reference/IndigoLeaves.jpg',
    plantationHabitat: 'Subtropical riverine loam & humid terrace groves',
    harvestSeason: 'Mid-summer morning dew harvest',
    plantationAccessories: [
      { label: 'Leaf Morphology', value: 'Odd-Pinnate 9–13 Leaflets', category: 'morphology' },
      { label: 'Active Pigment', value: 'Indican to Indigotin Reduction', category: 'pigment' },
      { label: 'Vat Recipe', value: 'Wood Ash Alkali & Date Sugar', category: 'mordant' },
      { label: 'Eco-Print Role', value: 'Atmospheric Oxygenation Bloom', category: 'harvest' },
    ],
  },
  eucalyptus: {
    slug: 'eucalyptus',
    title: 'The Botanical Designer',
    botanicalTitle: 'Silver Dollar Eucalyptus',
    scientificName: 'Eucalyptus cinerea',
    plantFamily: 'Myrtaceae (Myrtle Family)',
    paletteName: 'Silvery Sage & Solar Ochre',
    primaryHex: '#34D399',
    accentHex: '#F59E0B',
    glowRgba: 'rgba(52, 211, 153, 0.25)',
    cardBgGradient: 'from-[#0A2218]/95 via-[#133324]/95 to-[#061710]/95',
    borderClass: 'border-emerald-500/35',
    borderHoverClass: 'hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(52,211,153,0.3)]',
    tagBgClass: 'bg-emerald-500/15',
    tagTextClass: 'text-emerald-300',
    craftRoleTag: 'Web Designer',
    craftIconName: 'Palette',
    elementalStage: 'Stage III: High-Heat Solar Steaming & Interface Design',
    tagline: 'Sculpting high-density silk interface layouts and organic botanical visual architecture.',
    botanicalImage: '/botanicals/eucalyptus-leaves.webp',
    referenceSource: 'reference/SilverDollarEucalyptus.jpg',
    plantationHabitat: 'Sunny granite ridges & well-drained tablelands',
    harvestSeason: 'Midday solar zenith canopy harvest',
    plantationAccessories: [
      { label: 'Leaf Morphology', value: 'Glaucous Orbicular Paired Discs', category: 'morphology' },
      { label: 'Active Pigment', value: 'Cineole & Flavonoid Tannins', category: 'pigment' },
      { label: 'Vat Recipe', value: 'Alum Hydrate & Copper Halos', category: 'mordant' },
      { label: 'Eco-Print Role', value: 'Sun-Warmed Amber Contact Bleed', category: 'harvest' },
    ],
  },
  fern: {
    slug: 'fern',
    title: 'The Botanical Artisan',
    botanicalTitle: 'Forest Sword Fern',
    scientificName: 'Polystichum munitum',
    plantFamily: 'Dryopteridaceae (Wood Fern Family)',
    paletteName: 'Lush Chlorophyll & Deep Foliage',
    primaryHex: '#10B981',
    accentHex: '#F472B6',
    glowRgba: 'rgba(16, 185, 129, 0.25)',
    cardBgGradient: 'from-[#0D2417]/95 via-[#163623]/95 to-[#081810]/95',
    borderClass: 'border-teal-500/35',
    borderHoverClass: 'hover:border-teal-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    tagBgClass: 'bg-teal-500/15',
    tagTextClass: 'text-teal-300',
    craftRoleTag: 'Ecoprint Maker',
    craftIconName: 'Leaf',
    elementalStage: 'Stage II: Leaf Contact Bundling & Chlorophyll Imprint',
    tagline: 'Mastering natural contact print transfer, leaf placement composition, and artisanal dyeing.',
    botanicalImage: '/botanicals/sword-fern.webp',
    referenceSource: 'reference/ForestSwordFern.jpg',
    plantationHabitat: 'Pacific coastal rainforest understory moss beds',
    harvestSeason: 'Morning mist shade gathering',
    plantationAccessories: [
      { label: 'Leaf Morphology', value: 'Bipinnatifid Serrate Fronds', category: 'morphology' },
      { label: 'Active Pigment', value: 'Chlorophyllin & Lignin Resists', category: 'pigment' },
      { label: 'Vat Recipe', value: 'Weak Ferrous Mineral Liquor', category: 'mordant' },
      { label: 'Eco-Print Role', value: 'Ghost Frond Skeletal Silhouettes', category: 'harvest' },
    ],
  },
  oak: {
    slug: 'oak',
    title: 'The Botanical Artisan',
    botanicalTitle: 'Iron Oak Gall Tannin',
    scientificName: 'Quercus robur tannin',
    plantFamily: 'Fagaceae (Beech & Oak Family)',
    paletteName: 'Warm Tannin Amber & Earth Mineral',
    primaryHex: '#F59E0B',
    accentHex: '#D97706',
    glowRgba: 'rgba(245, 158, 11, 0.25)',
    cardBgGradient: 'from-[#23150A]/95 via-[#36200F]/95 to-[#160D06]/95',
    borderClass: 'border-amber-500/35',
    borderHoverClass: 'hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]',
    tagBgClass: 'bg-amber-500/15',
    tagTextClass: 'text-amber-300',
    craftRoleTag: 'Ecoprint Maker',
    craftIconName: 'Flame',
    elementalStage: 'Stage I: Mineral Tannin & Iron Mordanting Fixation',
    tagline: 'Refining botanical pigment mordanting, fabric scouring, and mineral-iron color fastness.',
    botanicalImage: '/botanicals/oak-gall.webp',
    referenceSource: 'reference/IronOakGall.png',
    plantationHabitat: 'Centenarian temperate oak groves & alluvial clay',
    harvestSeason: 'Autumn fallen woodland floor foraging',
    plantationAccessories: [
      { label: 'Leaf Morphology', value: 'Lobed Sinuate & Spherical Galls', category: 'morphology' },
      { label: 'Active Pigment', value: 'Pure Gallotannic Acid (65%+)', category: 'pigment' },
      { label: 'Vat Recipe', value: 'Bog Iron & Ferrous Mineral Water', category: 'mordant' },
      { label: 'Eco-Print Role', value: 'Permanent Archival Charcoal Ink', category: 'harvest' },
    ],
  },
};

export interface TeamMember {
  id: string;
  name: string;
  classRole: string;
  classGrade: string;
  studentNo: string;
  instagram: string;
  instagramUrl: string;
  phone: string;
  image: string;
  specimenNo: string;
  botanicalDye: string;
  botanicalLatin: string;
  element: string;
  quote?: string;
  themeSlug: BotanicalThemeSlug;
  botanicalImage?: string;
  plantationAccessoryTag?: string;
}

export interface ClassEmblem {
  title: string;
  className: string;
  school: string;
  motto: string;
  year: string;
  badgeUrl: string;
  description: string;
}

export const CLASS_INFO: ClassEmblem = {
  title: 'Orchiné Atelier Cohort',
  className: '11.2',
  school: 'SMA Yos Sudarso Karawang (YOSUKA)',
  motto: 'Imprinted by Nature, Driven by Technology',
  year: 'Class of 2026',
  badgeUrl: '/brand/class-logo.png',
  description:
    'A multidisciplinary student collective uniting the artisanal craft of botanical eco-print textiles with procedural WebGL computing, Next.js architecture, and conversational AI engineering.',
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Alvaro Febryan Angkawijaya',
    classRole: 'Lead Developer',
    classGrade: '11.2',
    studentNo: '02',
    instagram: '@naixxynn',
    instagramUrl: 'https://instagram.com/naixxynn',
    phone: '081284693819',
    image: '/team/alvaro.jpg',
    specimenNo: 'PLATE I • NO. 02',
    botanicalDye: 'Fermented Indigo',
    botanicalLatin: 'Indigofera tinctoria',
    element: 'Natural Vat Reduction & WebGL Shader Physics',
    quote: '',
    themeSlug: 'indigo',
    botanicalImage: '/botanicals/indigo-leaves.webp',
    plantationAccessoryTag: 'Pinnate Foliage & Earthenware Vat Halo',
  },
  {
    id: 'member-2',
    name: 'Marvell Leonard Rudyanto',
    classRole: 'Web Designer',
    classGrade: '11.2',
    studentNo: '15',
    instagram: '@ppellziox',
    instagramUrl: 'https://instagram.com/ppellziox',
    phone: '081293067992',
    image: '/team/marvel.jpg',
    specimenNo: 'PLATE II • NO. 15',
    botanicalDye: 'Silver Dollar Eucalyptus',
    botanicalLatin: 'Eucalyptus cinerea',
    element: 'Solar Steam & Botanical Interface Design',
    quote: '',
    themeSlug: 'eucalyptus',
    botanicalImage: '/botanicals/eucalyptus-leaves.webp',
    plantationAccessoryTag: 'Glaucous Orbicular Discs & Solar Mordant',
  },
  {
    id: 'member-3',
    name: 'Cecilia Leticya',
    classRole: 'Ecoprint Maker',
    classGrade: '11.2',
    studentNo: '05',
    instagram: '@ofcceciliaaa_',
    instagramUrl: 'https://instagram.com/ofcceciliaaa_',
    phone: '082172299199',
    image: '/team/cecilia.jpg',
    specimenNo: 'PLATE III • NO. 05',
    botanicalDye: 'Sword Fern',
    botanicalLatin: 'Polystichum munitum',
    element: 'Forest Chlorophyll Transfer & Eco-Print Alchemy',
    quote: '',
    themeSlug: 'fern',
    botanicalImage: '/botanicals/sword-fern.webp',
    plantationAccessoryTag: 'Bipinnatifid Frond & Rainforest Spore Matrix',
  },
  {
    id: 'member-4',
    name: 'Naomi Felicya Ariyandy',
    classRole: 'Ecoprint Maker',
    classGrade: '11.2',
    studentNo: '17',
    instagram: '@nmfcya',
    instagramUrl: 'https://instagram.com/nmfcya',
    phone: '087880301112',
    image: '/team/naomi.jpg',
    specimenNo: 'PLATE IV • NO. 17',
    botanicalDye: 'Iron Oak Gall',
    botanicalLatin: 'Quercus robur tannin',
    element: 'Mineral Tannin Extraction & Textile Mordanting',
    quote: '',
    themeSlug: 'oak',
    botanicalImage: '/botanicals/oak-gall.webp',
    plantationAccessoryTag: 'Centenarian Oak Gall & Ferrous Mineral Ink',
  },
];
