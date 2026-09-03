import { z } from "zod";

export const itineraryDayInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  location: z.string().trim().min(1, "Location is required"),
  travelDistance: z.string().trim().optional(),
  travelTime: z.string().trim().optional(),
  hotel: z.string().trim().optional(),
  meals: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  activities: z.array(z.string().min(1)).default([]),
});

export const itineraryInputSchema = z.array(itineraryDayInputSchema).max(60);

export type ItineraryDayInput = z.infer<typeof itineraryDayInputSchema>;
