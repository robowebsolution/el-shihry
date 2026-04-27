import { ProjectsSectionSkeleton, BlogSectionSkeleton } from '@/components/ui/content-skeletons';

export default function Loading() {
  return (
    <div className="bg-rich-black min-h-screen overflow-hidden pt-28">
      <ProjectsSectionSkeleton />
      <section className="motion-safe bg-rich-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-rich-black-light shadow-[0_8px_32px_0_rgba(241,213,130,0.02)]">
          <BlogSectionSkeleton />
        </div>
      </section>
    </div>
  );
}
