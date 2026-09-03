"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { itineraryInputSchema, type ItineraryDayInput } from "@/lib/validations/itinerary";
import type { ActionResult } from "@/lib/actions/trips";

export async function replaceItinerary(tripId: string, days: ItineraryDayInput[]): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const parsed = itineraryInputSchema.safeParse(days);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors in the itinerary." };
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return { success: false, message: "Trip not found." };

  await prisma.tripItineraryDay.deleteMany({ where: { tripId } });

  for (const [index, day] of parsed.data.entries()) {
    await prisma.tripItineraryDay.create({
      data: {
        tripId,
        dayNumber: index + 1,
        title: day.title,
        location: day.location,
        travelDistance: day.travelDistance || null,
        travelTime: day.travelTime || null,
        hotel: day.hotel || null,
        meals: day.meals || null,
        notes: day.notes || null,
        activities: {
          create: day.activities.map((text, i) => ({ text, order: i })),
        },
      },
    });
  }

  await logAdminActivity({
    adminId: session.user.id,
    action: "trip.itinerary_updated",
    entityType: "Trip",
    entityId: tripId,
    description: `Updated itinerary for trip "${trip.title}" (${parsed.data.length} day${parsed.data.length === 1 ? "" : "s"})`,
  });

  revalidatePath("/admin/trips");
  revalidatePath("/trips");
  revalidatePath(`/trips/${trip.slug}`);
  return { success: true, data: undefined };
}
