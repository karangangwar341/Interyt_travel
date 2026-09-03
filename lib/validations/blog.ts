import { z } from "zod";

export const guideSectionInputSchema = z.object({
  heading: z.string().trim().optional(),
  paragraphs: z.array(z.string().min(1)).min(1, "Add at least one paragraph"),
  list: z.array(z.string().min(1)).default([]),
});

export const blogInputSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  categoryId: z.string().min(1, "Choose a category"),
  destinationId: z.string().optional(),
  excerpt: z.string().trim().min(20, "Write at least a short excerpt"),
  readTimeMinutes: z.coerce.number().int().min(1).max(60),
  sections: z.array(guideSectionInputSchema).min(1, "Add at least one section"),
  relatedTripIds: z.array(z.string()).default([]),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type BlogInput = z.infer<typeof blogInputSchema>;
export type GuideSectionInput = z.infer<typeof guideSectionInputSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
