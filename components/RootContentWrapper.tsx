'use client';

import dynamic from 'next/dynamic';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const WhatsAppButton = dynamic(
  () => import('@/components/WhatsAppButton').then((module) => module.WhatsAppButton),
  { ssr: false }
);

export function RootContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
