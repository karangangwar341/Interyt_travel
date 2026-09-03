import { z } from "zod";

export const destinationInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  state: z.string().trim().min(2, "State is required"),
  region: z.enum(["NORTH", "WEST", "SOUTH", "EAST", "NORTHEAST"]),
  summary: z.string().trim().min(10, "Write a short summary"),
  description: z.string().trim().min(20, "Write a fuller description"),
  bestSeason: z.string().trim().min(2, "Best season is required"),
  thingsToDo: z.array(z.string().min(1)).default([]),
  experiences: z.array(z.string().min(1)).default([]),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).default([]),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type DestinationInput = z.infer<typeof destinationInputSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
