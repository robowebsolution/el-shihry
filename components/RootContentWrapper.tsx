'use client';

import { Navbar } from '@/components/Navbar';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Footer } from '@/components/Footer';

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
