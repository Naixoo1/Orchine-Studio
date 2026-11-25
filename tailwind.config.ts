import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ecru: '#FFF2B1', // Harmonized with User Font Cream #FFF2B1
          bone: '#EFECE4',
          sand: '#E3DFD5',
          noir: '#161616',
          charcoal: '#222222',
          muted: '#737373',
        },
        atelier: {
          // Font Palette
          purple: '#BB9AEF',
          cream: '#FFF2B1',
          blossom: '#FFC8DD',
          pink: '#FFC8DD',
          peach: '#FF9E69',
          // Base & Background Palette
          royal: '#582E8B',
          slate: '#485C91',
          indigo: '#373191',
          midnight: '#221D63',
          plum: '#341F5F',
        },
        botanical: {
          eucalyptus: '#8A9A86',
          marigold: '#BB9AEF', // Re-mapped to #BB9AEF: instantly shifts all 250+ existing text accents from orange to lavender purple
          orchid: '#BB9AEF',
          blossom: '#FFC8DD',
          cream: '#FFF2B1',
          peach: '#FF9E69',
          indigo: '#373191',
          oak: '#4A3C31',
          iron: '#2E2B2A',
          sage: '#7C8C78',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.25em',
        editorial: '0.15em',
      },
    },
  },
  plugins: [],
};

export default config;
