import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Alexandria, IBM_Plex_Sans_Arabic, Inter, Urbanist } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Navbar } from '@/components/Navbar';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/lib/site-content';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
});

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  variable: '--font-alexandria',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El Shihry Developments | Luxury Real Estate',
  description: 'The Rolex of Real Estate Websites. A high-end, futuristic, and artistic website for El Shihry Developments.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;
  const locale: Locale = cookieLocale === 'ar' || cookieLocale === 'en' ? cookieLocale : 'en';

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${urbanist.variable} ${alexandria.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className={locale === 'ar' ? 'font-arabic' : 'font-sans'} suppressHydrationWarning>
        <style dangerouslySetInnerHTML={{ __html: `
          .motion-safe {
             will-change: transform, opacity;
             transform: translateZ(0);
          }
        `}} />
        <LanguageProvider defaultLocale={locale}>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
