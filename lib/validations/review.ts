import { z } from "zod";

export const reviewInputSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  location: z.string().trim().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().trim().min(10, "Write at least a short review"),
  travelMonth: z.string().trim().optional(),
  tripId: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
