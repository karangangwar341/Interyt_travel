"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/actions/analytics";

function getSessionId() {
  try {
    const existing = sessionStorage.getItem("bt_session_id");
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem("bt_session_id", id);
    return id;
  } catch {
    return "unknown";
  }
}

function getDevice(): "MOBILE" | "TABLET" | "DESKTOP" {
  const width = window.innerWidth;
  if (width < 640) return "MOBILE";
  if (width < 1024) return "TABLET";
  return "DESKTOP";
}

/**
 * Site-wide, best-effort analytics: fires a PAGE_VIEW on every route change,
 * and delegates clicks on WhatsApp / tel: links anywhere on the page to
 * WHATSAPP_CLICK / PHONE_CLICK events — without touching the many existing
 * components that already render those links.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent({
      eventType: "PAGE_VIEW",
      page: pathname,
      sessionId: getSessionId(),
      device: getDevice(),
    });
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";

      if (href.startsWith("https://wa.me/")) {
        trackEvent({ eventType: "WHATSAPP_CLICK", page: pathname, sessionId: getSessionId(), device: getDevice() });
      } else if (href.startsWith("tel:")) {
        trackEvent({ eventType: "PHONE_CLICK", page: pathname, sessionId: getSessionId(), device: getDevice() });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
