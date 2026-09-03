import { z } from "zod";

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const siteSettingsInputSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
  whatsapp: z.string().trim().regex(phoneRegex, "Enter a valid WhatsApp number"),
  email: z.string().trim().email("Enter a valid email"),
  address: z.string().trim().optional(),
  instagramUrl: z.union([z.string().trim().url("Enter a valid URL"), z.literal("")]).optional(),
  facebookUrl: z.union([z.string().trim().url("Enter a valid URL"), z.literal("")]).optional(),
  youtubeUrl: z.union([z.string().trim().url("Enter a valid URL"), z.literal("")]).optional(),
  defaultSeoTitle: z.string().trim().min(5, "SEO title is required"),
  defaultSeoDescription: z.string().trim().min(10, "SEO description is required"),
  businessHours: z.string().trim().optional(),
  supportMessage: z.string().trim().optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>;
