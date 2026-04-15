import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Philosophy } from '@/components/Philosophy';
import { ProjectsBento } from '@/components/ProjectsBento';
import { WhyInvest } from '@/components/WhyInvest';
import { ArchitecturalExcellence } from '@/components/ArchitecturalExcellence';
import { FunctionalSections } from '@/components/FunctionalSections';
import { Marquee } from '@/components/Marquee';
import { HorizontalScroll } from '@/components/HorizontalScroll';

export default function Home() {
  return (
    <div className="bg-rich-black min-h-screen overflow-hidden">
      <Hero />
      <About />
      <Philosophy />
      <ProjectsBento />
      <WhyInvest />
      <ArchitecturalExcellence />
      <Marquee />
      <HorizontalScroll />
      <FunctionalSections />
    </div>
  );
}
