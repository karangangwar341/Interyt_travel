import { z } from "zod";

export const upcomingTripInputSchema = z
  .object({
    tripId: z.string().min(1, "Choose a trip"),
    departureDate: z.string().min(1, "Departure date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    departureLocation: z.string().trim().min(1, "Departure location is required"),
    totalSeats: z.coerce.number().int().min(1),
    availableSeats: z.coerce.number().int().min(0),
    price: z.coerce.number().int().min(0),
    bookingDeadline: z.string().min(1, "Booking deadline is required"),
    status: z.enum(["SEATS_AVAILABLE", "ALMOST_FULL", "SOLD_OUT", "COMPLETED", "CANCELLED"]),
    featured: z.boolean().default(false),
  })
  .refine((data) => data.availableSeats <= data.totalSeats, {
    message: "Available seats cannot exceed total seats",
    path: ["availableSeats"],
  })
  .refine((data) => new Date(data.returnDate) >= new Date(data.departureDate), {
    message: "Return date must be on or after the departure date",
    path: ["returnDate"],
  })
  .refine((data) => new Date(data.bookingDeadline) <= new Date(data.departureDate), {
    message: "Booking deadline must be on or before the departure date",
    path: ["bookingDeadline"],
  });

export type UpcomingTripInput = z.infer<typeof upcomingTripInputSchema>;
