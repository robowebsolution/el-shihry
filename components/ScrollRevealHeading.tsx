'use client';

import React, { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
type RevealMode = 'chars' | 'lines' | 'words';

const ARABIC_SCRIPT_REGEX = /\p{Script=Arabic}/u;
const WHITESPACE_SEGMENTS_REGEX = /(\s+)/;

type ScrollRevealHeadingProps = {
  as?: HeadingTag;
  className?: string;
  localeKey: string;
  mode?: RevealMode;
  start?: string;
  text?: string;
  lines?: ReactNode[];
  wordClassName?: string;
  lineClassName?: string;
  once?: boolean;
};

const containsArabicScript = (value: string) => ARABIC_SCRIPT_REGEX.test(value);

// Helper to recursively break strings into reveal-safe spans
const renderChars = (node: ReactNode, keyPrefix: string, wordClassName?: string, inheritedClassName?: string): ReactNode => {
  if (typeof node === 'string') {
    const segments = node.split(WHITESPACE_SEGMENTS_REGEX);
    const revealByWord = containsArabicScript(node);

    return segments.map((segment, wIdx) => {
      if (segment.trim() === '') {
        return (
          <span key={`${keyPrefix}-s-${wIdx}`} className="inline-block whitespace-pre">
            {segment}
          </span>
        );
      }

      if (revealByWord) {
        return (
          <span key={`${keyPrefix}-w-${wIdx}`} className={cn('inline-block whitespace-nowrap', wordClassName)}>
            <span data-reveal-segment className={cn('inline-block will-change-transform', inheritedClassName)} dir="auto">
              {segment}
            </span>
          </span>
        );
      }

      return (
        <span key={`${keyPrefix}-w-${wIdx}`} className={cn('inline-block whitespace-nowrap', wordClassName)}>
          {Array.from(segment).map((char, cIdx) => (
            <span key={`${keyPrefix}-c-${wIdx}-${cIdx}`} className="inline-block">
              <span data-reveal-segment className={cn('inline-block will-change-transform', inheritedClassName)}>
                {char}
              </span>
            </span>
          ))}
        </span>
      );
    });
  }

  if (React.isValidElement(node)) {
    const isFragment = node.type === React.Fragment;
    const props = node.props as { children?: ReactNode; className?: string; [key: string]: unknown };
    const nodeClassName = props.className;
    const isGradient = typeof nodeClassName === 'string' && nodeClassName.includes('text-gradient-gold');
    const children = Array.isArray(props.children)
      ? props.children.flatMap((child, i) =>
          renderChars(
            child,
            `${keyPrefix}-el-${i}`,
            wordClassName,
            isGradient ? 'text-gradient-gold' : inheritedClassName
          )
        )
      : renderChars(
          props.children,
          `${keyPrefix}-el`,
          wordClassName,
          isGradient ? 'text-gradient-gold' : inheritedClassName
        );

    if (isFragment) {
      const fragmentChildren = Array.isArray(props.children)
        ? props.children.flatMap((child, i) =>
            renderChars(child, `${keyPrefix}-el-${i}`, wordClassName, inheritedClassName)
          )
        : renderChars(props.children, `${keyPrefix}-el`, wordClassName, inheritedClassName);
      return <React.Fragment key={keyPrefix}>{fragmentChildren}</React.Fragment>;
    }

    return React.cloneElement(
      node as React.ReactElement<Record<string, unknown>>,
      { ...props, className: isGradient ? undefined : nodeClassName },
      children
    );
  }

  if (Array.isArray(node)) {
    return node.flatMap((child, i) => renderChars(child, `${keyPrefix}-arr-${i}`, wordClassName, inheritedClassName));
  }

  return node;
};

export function ScrollRevealHeading({
  as = 'h2',
  className,
  localeKey,
  mode = 'chars',
  start = 'top 82%',
  text,
  lines,
  wordClassName,
  lineClassName,
  once = true,
}: ScrollRevealHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      const segments = headingRef.current?.querySelectorAll<HTMLElement>('[data-reveal-segment]');

      if (!segments?.length) {
        return;
      }

      if (mode === 'chars') {
        gsap.fromTo(
          segments,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start,
              once,
              toggleActions: once ? 'play none none none' : 'play none none reverse',
            },
          }
        );
      } else {
        gsap.fromTo(
          segments,
          {
            yPercent: 115,
            opacity: 0,
            filter: 'blur(14px)',
            rotate: 2,
            transformOrigin: '50% 100%',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            rotate: 0,
            duration: mode === 'words' ? 0.9 : 1.1,
            stagger: mode === 'words' ? 0.045 : 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start,
              once,
              toggleActions: once ? 'play none none none' : 'play none none reverse',
            },
          }
        );
      }
    },
    { scope: headingRef, dependencies: [localeKey, mode, start, once], revertOnUpdate: true }
  );

  if (mode === 'chars') {
    if (text) {
      return (
        <Tag ref={headingRef as any} className={className}>
          {renderChars(text, localeKey, wordClassName)}
        </Tag>
      );
    }
    return (
      <Tag ref={headingRef as any} className={className}>
        {lines?.map((line, index) => (
          <span key={`${localeKey}-${index}`} className={cn("block pb-[0.08em]", lineClassName)}>
            {renderChars(line, `${localeKey}-${index}`, wordClassName)}
          </span>
        ))}
      </Tag>
    );
  }

  if (mode === 'words' && text) {
    return (
      <Tag ref={headingRef as any} className={className}>
        {text.split(WHITESPACE_SEGMENTS_REGEX).map((word, index) =>
          word.trim() === '' ? (
            <span key={`${localeKey}-${index}-space`} className="whitespace-pre">
              {word}
            </span>
          ) : (
            <span
              key={`${localeKey}-${index}-${word}`}
              className="mb-[0.16em] me-[0.24em] inline-block overflow-hidden align-top"
            >
              <span data-reveal-segment className={cn('inline-block will-change-transform', wordClassName)} dir="auto">
                {word}
              </span>
            </span>
          )
        )}
      </Tag>
    );
  }

  return (
    <Tag ref={headingRef as any} className={className}>
      {lines?.map((line, index) => (
        <span key={`${localeKey}-${index}`} className="block overflow-hidden pb-[0.08em]">
          <span data-reveal-segment className={cn('block will-change-transform', lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
