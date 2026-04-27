'use client';

import { cn } from '@/lib/utils';

function SkeletonBlock({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        'animate-pulse rounded-[1.75rem] border border-white/8 bg-white/[0.04] relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(90deg,transparent,rgba(241,213,130,0.08),transparent)] before:animate-[shimmer_1.9s_infinite]',
        className
      )}
    />
  );
}

export function ProjectsSectionSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-32 md:px-12">
      <div className="mb-20 max-w-3xl space-y-5">
        <SkeletonBlock className="h-4 w-28 rounded-full" />
        <SkeletonBlock className="h-14 w-full max-w-2xl" />
        <SkeletonBlock className="h-6 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <SkeletonBlock className="col-span-12 h-[60vh] md:col-span-8" />
        <SkeletonBlock className="col-span-12 h-[60vh] md:col-span-4" />
        <SkeletonBlock className="col-span-12 h-[50vh] md:col-span-4" />
        <SkeletonBlock className="col-span-12 h-[50vh] md:col-span-8" />
      </div>
    </section>
  );
}

export function BlogSectionSkeleton() {
  return (
    <section className="border-b border-white/10 px-6 py-14 sm:px-10 lg:px-14">
      <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-4">
          <SkeletonBlock className="h-4 w-24 rounded-full" />
          <SkeletonBlock className="h-10 w-full max-w-md" />
          <SkeletonBlock className="h-5 w-full max-w-2xl" />
        </div>
        <SkeletonBlock className="h-5 w-36 rounded-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5"
          >
            <SkeletonBlock className="aspect-[16/10] rounded-none border-0" />
            <div className="space-y-4 px-6 py-6">
              <SkeletonBlock className="h-8 w-4/5" />
              <SkeletonBlock className="h-4 w-2/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectsPageSkeleton() {
  return (
    <div className="overflow-hidden px-6 pb-32 pt-40">
      <div className="mx-auto mb-24 max-w-7xl text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <SkeletonBlock className="mx-auto h-4 w-28 rounded-full" />
          <SkeletonBlock className="mx-auto h-20 w-full max-w-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
        {[36, 28, 32, 40, 26, 34].map((height, index) => (
          <SkeletonBlock
            key={index}
            className="mb-8 break-inside-avoid rounded-[2.5rem]"
            style={{ height: `${height}rem` }}
          />
        ))}
      </div>
    </div>
  );
}

export function BlogPageSkeleton() {
  return (
    <div className="px-6 pb-32 pt-40">
      <div className="mx-auto mb-24 max-w-7xl">
        <div className="max-w-3xl space-y-6">
          <SkeletonBlock className="h-16 w-full max-w-2xl" />
          <SkeletonBlock className="h-6 w-full max-w-xl" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.03] lg:grid-cols-12"
          >
            <SkeletonBlock className="h-[300px] rounded-none border-0 lg:col-span-5 lg:h-full" />
            <div className="space-y-8 p-8 md:p-16 lg:col-span-7">
              <SkeletonBlock className="h-4 w-40 rounded-full" />
              <SkeletonBlock className="h-12 w-full max-w-2xl" />
              <SkeletonBlock className="h-24 w-full" />
              <SkeletonBlock className="h-12 w-44 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
