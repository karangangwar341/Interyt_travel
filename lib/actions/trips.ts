"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { tripInputSchema, slugify, type TripInput } from "@/lib/validations/trip";

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

function toJson(arr: string[]) {
  return JSON.stringify(arr);
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.trip.findFirst({ where: { slug, NOT: excludeId ? { id: excludeId } : undefined } });
    if (!existing) return slug;
    i++;
    slug = `${base}-${i}`;
  }
}

function revalidateTripPaths(slug?: string) {
  revalidatePath("/admin/trips");
  revalidatePath("/trips");
  if (slug) revalidatePath(`/trips/${slug}`);
}

export async function createTrip(input: TripInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await requireAdminSession();
  const parsed = tripInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const slug = await ensureUniqueSlug(slugify(data.slug || data.title));

  const trip = await prisma.trip.create({
    data: {
      title: data.title,
      slug,
      destinationId: data.destinationId,
      states: toJson(data.states),
      durationDays: data.durationDays,
      durationNights: data.durationNights,
      price: data.price,
      currency: data.currency,
      overview: data.overview,
      highlights: toJson(data.highlights),
      inclusions: toJson(data.inclusions),
      exclusions: toJson(data.exclusions),
      hotels: toJson(data.hotels),
      transport: data.transport || null,
      meals: data.meals || null,
      bestSeason: data.bestSeason || null,
      difficulty: data.difficulty,
      tripType: data.tripType,
      tags: toJson(data.tags),
      rating: data.rating ?? null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      status: "DRAFT",
    },
  });

  await replaceFaqs(trip.id, data.faqs);
  await logAdminActivity({
    adminId: session.user.id,
    action: "trip.created",
    entityType: "Trip",
    entityId: trip.id,
    description: `Created trip "${trip.title}"`,
  });

  revalidateTripPaths();
  return { success: true, data: { id: trip.id, slug: trip.slug } };
}

export async function updateTrip(id: string, input: TripInput): Promise<ActionResult<{ slug: string }>> {
  const session = await requireAdminSession();
  const parsed = tripInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Trip not found." };

  const slug =
    slugify(data.slug) === existing.slug ? existing.slug : await ensureUniqueSlug(slugify(data.slug), id);

  const trip = await prisma.trip.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      destinationId: data.destinationId,
      states: toJson(data.states),
      durationDays: data.durationDays,
      durationNights: data.durationNights,
      price: data.price,
      currency: data.currency,
      overview: data.overview,
      highlights: toJson(data.highlights),
      inclusions: toJson(data.inclusions),
      exclusions: toJson(data.exclusions),
      hotels: toJson(data.hotels),
      transport: data.transport || null,
      meals: data.meals || null,
      bestSeason: data.bestSeason || null,
      difficulty: data.difficulty,
      tripType: data.tripType,
      tags: toJson(data.tags),
      rating: data.rating ?? null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });

  await replaceFaqs(trip.id, data.faqs);
  await logAdminActivity({
    adminId: session.user.id,
    action: "trip.updated",
    entityType: "Trip",
    entityId: trip.id,
    description: `Updated trip "${trip.title}"`,
  });

  revalidateTripPaths(existing.slug);
  revalidateTripPaths(slug);
  return { success: true, data: { slug: trip.slug } };
}

async function replaceFaqs(tripId: string, faqs: { question: string; answer: string }[]) {
  await prisma.faq.deleteMany({ where: { ownerType: "TRIP", ownerId: tripId } });
  if (faqs.length === 0) return;
  await prisma.faq.createMany({
    data: faqs.map((f, i) => ({ ownerType: "TRIP", ownerId: tripId, question: f.question, answer: f.answer, order: i })),
  });
}

export async function setTripStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const trip = await prisma.trip.update({ where: { id }, data: { status } });

  await logAdminActivity({
    adminId: session.user.id,
    action: `trip.${status.toLowerCase()}`,
    entityType: "Trip",
    entityId: trip.id,
    description: `${status === "PUBLISHED" ? "Published" : status === "ARCHIVED" ? "Archived" : "Unpublished"} trip "${trip.title}"`,
  });

  revalidateTripPaths(trip.slug);
  return { success: true, data: undefined };
}

export async function duplicateTrip(id: string): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdminSession();
  const original = await prisma.trip.findUnique({ where: { id } });
  if (!original) return { success: false, message: "Trip not found." };

  const faqs = await prisma.faq.findMany({ where: { ownerType: "TRIP", ownerId: id }, orderBy: { order: "asc" } });
  const newSlug = await ensureUniqueSlug(`${original.slug}-copy`);

  const copy = await prisma.trip.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      destinationId: original.destinationId,
      states: original.states,
      durationDays: original.durationDays,
      durationNights: original.durationNights,
      price: original.price,
      currency: original.currency,
      overview: original.overview,
      highlights: original.highlights,
      inclusions: original.inclusions,
      exclusions: original.exclusions,
      hotels: original.hotels,
      transport: original.transport,
      meals: original.meals,
      bestSeason: original.bestSeason,
      difficulty: original.difficulty,
      tripType: original.tripType,
      tags: original.tags,
      rating: original.rating,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      status: "DRAFT",
    },
  });

  if (faqs.length > 0) {
    await prisma.faq.createMany({
      data: faqs.map((f) => ({ ownerType: "TRIP", ownerId: copy.id, question: f.question, answer: f.answer, order: f.order })),
    });
  }

  await logAdminActivity({
    adminId: session.user.id,
    action: "trip.duplicated",
    entityType: "Trip",
    entityId: copy.id,
    description: `Duplicated trip "${original.title}" as "${copy.title}"`,
  });

  revalidateTripPaths();
  return { success: true, data: { id: copy.id } };
}

export async function deleteTrip(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) return { success: false, message: "Trip not found." };

  await prisma.faq.deleteMany({ where: { ownerType: "TRIP", ownerId: id } });
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "TRIP", ownerId: id } });
  await prisma.trip.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "trip.deleted",
    entityType: "Trip",
    entityId: id,
    description: `Deleted trip "${trip.title}"`,
  });

  revalidateTripPaths(trip.slug);
  return { success: true, data: undefined };
}

export async function setTripHeroImage(tripId: string, mediaId: string | null): Promise<ActionResult<undefined>> {
  await requireAdminSession();
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "TRIP", ownerId: tripId, role: "HERO" } });
  if (mediaId) {
    await prisma.mediaUsage.create({ data: { mediaId, ownerType: "TRIP", ownerId: tripId, role: "HERO", order: 0 } });
  }
  revalidateTripPaths();
  return { success: true, data: undefined };
}

export async function setTripGallery(tripId: string, mediaIds: string[]): Promise<ActionResult<undefined>> {
  await requireAdminSession();
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "TRIP", ownerId: tripId, role: "GALLERY" } });
  if (mediaIds.length > 0) {
    await prisma.mediaUsage.createMany({
      data: mediaIds.map((mediaId, i) => ({ mediaId, ownerType: "TRIP", ownerId: tripId, role: "GALLERY", order: i })),
    });
  }
  revalidateTripPaths();
  return { success: true, data: undefined };
}
