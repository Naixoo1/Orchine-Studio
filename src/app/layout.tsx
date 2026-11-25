import type { Metadata } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { EcoPassportModal } from '@/components/passport/EcoPassportModal';

export const metadata: Metadata = {
  title: 'Orchiné Studio — Imprinted by Nature',
  description:
    'Botanical eco-print silk scarves dyed with foraged eucalyptus, fern, indigo, and oak galls. An interactive atelier and AI-guided digital flagship.',
  keywords: ['botanical eco-print', 'silk scarf', 'natural dye', 'eucalyptus dye', 'indigo', 'sustainable fashion'],
  openGraph: {
    title: 'Orchiné Studio — Imprinted by Nature',
    description: 'Botanical eco-print silk scarves. Interactive 3D atelier & conversational craft companion.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-brand-noir text-brand-ecru antialiased selection:bg-botanical-marigold selection:text-brand-noir overflow-x-hidden">
        <SmoothScrollProvider>
          {children}
          <EcoPassportModal />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
