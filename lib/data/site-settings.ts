import { cache } from "react";
import { prisma } from "@/lib/db";

export interface SiteSettingsData {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  businessHours: string | null;
  supportMessage: string | null;
}

/**
 * Cached per-request (React `cache`) so every Server Component that needs
 * contact info (Header, Footer, trip/destination/article detail views) can
 * call this directly without prop-drilling — Next.js dedupes the underlying
 * query within a single render pass.
 */
const defaultSettings: SiteSettingsData = {
  businessName: "Bharat Trails",
  phone: "+911234567890",
  whatsapp: "911234567890",
  email: "hello@example.com",
  address: null,
  instagramUrl: null,
  facebookUrl: null,
  youtubeUrl: null,
  defaultSeoTitle: "Bharat Trails — Discover India, Your Way",
  defaultSeoDescription:
    "Curated journeys across India's mountains, beaches, deserts, heritage cities and hidden gems.",
  businessHours: null,
  supportMessage: null,
};

export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  const row = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!row) return defaultSettings;

  return {
    businessName: row.businessName,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    instagramUrl: row.instagramUrl,
    facebookUrl: row.facebookUrl,
    youtubeUrl: row.youtubeUrl,
    defaultSeoTitle: row.defaultSeoTitle,
    defaultSeoDescription: row.defaultSeoDescription,
    businessHours: row.businessHours,
    supportMessage: row.supportMessage,
  };
});
