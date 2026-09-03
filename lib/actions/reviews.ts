"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { reviewInputSchema, type ReviewInput } from "@/lib/validations/review";
import type { ActionResult } from "@/lib/actions/trips";

function revalidateReviewPaths(tripSlug?: string) {
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  if (tripSlug) revalidatePath(`/trips/${tripSlug}`);
}

export async function createReview(input: ReviewInput): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdminSession();
  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const review = await prisma.review.create({
    data: {
      customerName: data.customerName,
      location: data.location || null,
      rating: data.rating,
      reviewText: data.reviewText,
      travelMonth: data.travelMonth || null,
      tripId: data.tripId || null,
      featured: data.featured,
      published: data.published,
      // A real admin is entering this review, so it is never seeded/placeholder content.
      isSample: false,
    },
  });

  await logAdminActivity({
    adminId: session.user.id,
    action: "review.created",
    entityType: "Review",
    entityId: review.id,
    description: `Added a review from "${review.customerName}"`,
  });

  const trip = data.tripId ? await prisma.trip.findUnique({ where: { id: data.tripId } }) : null;
  revalidateReviewPaths(trip?.slug);
  return { success: true, data: { id: review.id } };
}

export async function updateReview(id: string, input: ReviewInput): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Review not found." };

  const review = await prisma.review.update({
    where: { id },
    data: {
      customerName: data.customerName,
      location: data.location || null,
      rating: data.rating,
      reviewText: data.reviewText,
      travelMonth: data.travelMonth || null,
      tripId: data.tripId || null,
      featured: data.featured,
      published: data.published,
    },
  });

  await logAdminActivity({
    adminId: session.user.id,
    action: "review.updated",
    entityType: "Review",
    entityId: review.id,
    description: `Updated review from "${review.customerName}"`,
  });

  const trip = review.tripId ? await prisma.trip.findUnique({ where: { id: review.tripId } }) : null;
  revalidateReviewPaths(trip?.slug);
  return { success: true, data: undefined };
}

export async function deleteReview(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return { success: false, message: "Review not found." };

  await prisma.review.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "review.deleted",
    entityType: "Review",
    entityId: id,
    description: `Deleted review from "${review.customerName}"`,
  });

  const trip = review.tripId ? await prisma.trip.findUnique({ where: { id: review.tripId } }) : null;
  revalidateReviewPaths(trip?.slug);
  return { success: true, data: undefined };
}
