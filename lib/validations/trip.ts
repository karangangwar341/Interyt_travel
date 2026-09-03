import { z } from "zod";

export const tripInputSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  destinationId: z.string().min(1, "Choose a destination"),
  states: z.array(z.string().min(1)).default([]),
  durationDays: z.coerce.number().int().min(1).max(60),
  durationNights: z.coerce.number().int().min(0).max(60),
  price: z.coerce.number().int().min(0),
  currency: z.string().default("INR"),
  overview: z.string().trim().min(20, "Write at least a short overview"),
  highlights: z.array(z.string().min(1)).default([]),
  inclusions: z.array(z.string().min(1)).default([]),
  exclusions: z.array(z.string().min(1)).default([]),
  hotels: z.array(z.string().min(1)).default([]),
  transport: z.string().trim().optional(),
  meals: z.string().trim().optional(),
  bestSeason: z.string().trim().optional(),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING"]),
  tripType: z.enum(["ADVENTURE", "LEISURE", "CULTURAL", "ROAD_TRIP", "WEEKEND"]),
  tags: z.array(z.string().min(1)).default([]),
  rating: z.coerce.number().min(0).max(5).optional().or(z.literal("").transform(() => undefined)),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).default([]),
});

export type TripInput = z.infer<typeof tripInputSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
