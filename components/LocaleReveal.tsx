'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type LocaleRevealProps = {
  children: ReactNode;
  className?: string;
  localeKey: string;
};

export function LocaleReveal({ children, className, localeKey }: LocaleRevealProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={localeKey}
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
