"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGa4Event(
  eventName: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    console.warn("[GA4] gtag not available, event dropped:", eventName);
    return;
  }
  console.log("[GA4] tracking event:", eventName, params);
  window.gtag("event", eventName, params ?? {});
}
