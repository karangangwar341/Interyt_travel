import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import type { GalleryImage } from "./types";

export async function getDestinationOptions(): Promise<{ id: string; name: string }[]> {
  const rows = await prisma.destination.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return rows;
}

export interface AdminTripListItem {
  id: string;
  title: string;
  slug: string;
  destinationName: string;
  price: number;
  tripType: string;
  difficulty: string;
  status: string;
  updatedAt: string;
}

export async function getAllTripsForAdmin(options?: {
  search?: string;
  status?: string;
  sort?: "title" | "price" | "updated";
}): Promise<AdminTripListItem[]> {
  const search = options?.search?.trim();

  const rows = await prisma.trip.findMany({
    where: {
      status: options?.status && options.status !== "ALL" ? options.status : undefined,
      title: search ? { contains: search } : undefined,
    },
    include: { destination: { select: { name: true } } },
    orderBy:
      options?.sort === "title"
        ? { title: "asc" }
        : options?.sort === "price"
          ? { price: "asc" }
          : { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    destinationName: row.destination.name,
    price: row.price,
    tripType: row.tripType,
    difficulty: row.difficulty,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export interface AdminItineraryDay {
  title: string;
  location: string;
  travelDistance: string;
  travelTime: string;
  hotel: string;
  meals: string;
  notes: string;
  activities: string[];
}

export async function getItineraryForTrip(tripId: string): Promise<AdminItineraryDay[]> {
  const days = await prisma.tripItineraryDay.findMany({
    where: { tripId },
    orderBy: { dayNumber: "asc" },
    include: { activities: { orderBy: { order: "asc" } } },
  });

  return days.map((day) => ({
    title: day.title,
    location: day.location,
    travelDistance: day.travelDistance ?? "",
    travelTime: day.travelTime ?? "",
    hotel: day.hotel ?? "",
    meals: day.meals ?? "",
    notes: day.notes ?? "",
    activities: day.activities.map((a) => a.text),
  }));
}

export interface AdminTripRecord {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  states: string[];
  durationDays: number;
  durationNights: number;
  price: number;
  currency: string;
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  hotels: string[];
  transport: string;
  meals: string;
  bestSeason: string;
  difficulty: string;
  tripType: string;
  tags: string[];
  rating: number | null;
  seoTitle: string;
  seoDescription: string;
  status: string;
  faqs: { question: string; answer: string }[];
  heroImage: (GalleryImage & { mediaId: string }) | null;
  gallery: (GalleryImage & { mediaId: string })[];
}

export async function getTripForEdit(id: string): Promise<AdminTripRecord | null> {
  const row = await prisma.trip.findUnique({ where: { id } });
  if (!row) return null;

  const [faqs, usages] = await Promise.all([
    prisma.faq.findMany({ where: { ownerType: "TRIP", ownerId: id }, orderBy: { order: "asc" } }),
    prisma.mediaUsage.findMany({
      where: { ownerType: "TRIP", ownerId: id, role: { in: ["HERO", "GALLERY"] } },
      include: { media: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const toImage = (media: (typeof usages)[number]["media"]) => ({
    mediaId: media.id,
    url: media.url,
    alt: media.altText ?? media.title ?? media.fileName,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  });

  const hero = usages.find((u) => u.role === "HERO");
  const gallery = usages.filter((u) => u.role === "GALLERY");

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    destinationId: row.destinationId,
    states: parseJsonArray<string>(row.states),
    durationDays: row.durationDays,
    durationNights: row.durationNights,
    price: row.price,
    currency: row.currency,
    overview: row.overview,
    highlights: parseJsonArray<string>(row.highlights),
    inclusions: parseJsonArray<string>(row.inclusions),
    exclusions: parseJsonArray<string>(row.exclusions),
    hotels: parseJsonArray<string>(row.hotels),
    transport: row.transport ?? "",
    meals: row.meals ?? "",
    bestSeason: row.bestSeason ?? "",
    difficulty: row.difficulty,
    tripType: row.tripType,
    tags: parseJsonArray<string>(row.tags),
    rating: row.rating,
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
    status: row.status,
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    heroImage: hero ? toImage(hero.media) : null,
    gallery: gallery.map((u) => toImage(u.media)),
  };
}
