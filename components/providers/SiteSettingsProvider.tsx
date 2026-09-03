"use client";

import { createContext, useContext } from "react";
import type { SiteSettingsData } from "@/lib/data/site-settings";

const SiteSettingsContext = createContext<SiteSettingsData | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettingsData;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

/** Client-side equivalent of `getSiteSettings()` for components that can't await. */
export function useSiteSettings(): SiteSettingsData {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return ctx;
}
