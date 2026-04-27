'use client';

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, eventName: string, params?: EventParams) => void;
  }
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', eventName, params);
}
