import { z } from "zod";

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const bookingEnquirySchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
  email: z.union([z.string().trim().email("Enter a valid email"), z.literal("")]).optional(),
  tripSlug: z.string().optional(),
  upcomingTripId: z.string().optional(),
  travelDate: z.string().optional(),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(10).default(0),
  rooms: z.coerce.number().int().min(1).max(10).optional(),
  budget: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export type BookingEnquiryInput = z.infer<typeof bookingEnquirySchema>;

export const customTripSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
  email: z.union([z.string().trim().email("Enter a valid email"), z.literal("")]).optional(),
  destination: z.string().optional(),
  travelDate: z.string().optional(),
  durationDays: z.string().optional(),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(10).default(0),
  travelStyle: z.enum(["BUDGET", "COMFORT", "PREMIUM", "LUXURY"]),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  budget: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export type CustomTripInput = z.infer<typeof customTripSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
  email: z.union([z.string().trim().email("Enter a valid email"), z.literal("")]).optional(),
  subject: z.string().trim().min(2, "Please add a subject"),
  message: z.string().trim().min(10, "Please share a few more details"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const interestOptions = [
  "Adventure",
  "Beaches",
  "Mountains",
  "Wildlife",
  "Food",
  "Culture",
  "Spiritual",
  "Photography",
  "Honeymoon",
  "Family",
] as const;

export const travelStyleOptions = [
  { value: "BUDGET", label: "Budget" },
  { value: "COMFORT", label: "Comfort" },
  { value: "PREMIUM", label: "Premium" },
  { value: "LUXURY", label: "Luxury" },
] as const;
