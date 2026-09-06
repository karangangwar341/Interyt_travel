import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import { trips as scenicSeed } from "./trips.seed";
import type { GalleryImage, Trip, TripItineraryDay } from "./types";

export { trips } from "./trips.seed";

function scenicFor(slug: string) {
  return (
    scenicSeed.find((t) => t.slug === slug)?.scenic ?? { pattern: "hills" as const, tone: "forest" as const }
  );
}

type TripRow = {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  destination: { slug: string };
  states: string;
  durationDays: number;
  durationNights: number;
  price: number;
  currency: string;
  overview: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  hotels: string;
  transport: string | null;
  meals: string | null;
  bestSeason: string | null;
  difficulty: string;
  tripType: string;
  tags: string;
  rating: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  itinerary: {
    dayNumber: number;
    title: string;
    location: string;
    travelDistance: string | null;
    travelTime: string | null;
    hotel: string | null;
    meals: string | null;
    notes: string | null;
    activities: { text: string }[];
  }[];
};

async function getImagesFor(tripId: string): Promise<{ heroImage?: GalleryImage; gallery?: GalleryImage[] }> {
  const usages = await prisma.mediaUsage.findMany({
    where: { ownerType: "TRIP", ownerId: tripId, role: { in: ["HERO", "GALLERY"] } },
    include: { media: true },
    orderBy: { order: "asc" },
  });

  const toGalleryImage = (media: (typeof usages)[number]["media"]): GalleryImage => ({
    url: media.url,
    alt: media.altText ?? media.title ?? media.fileName,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  });

  const hero = usages.find((u) => u.role === "HERO");
  const gallery = usages.filter((u) => u.role === "GALLERY");

  return {
    heroImage: hero ? toGalleryImage(hero.media) : undefined,
    gallery: gallery.length > 0 ? gallery.map((u) => toGalleryImage(u.media)) : undefined,
  };
}

function mapTrip(
  row: TripRow,
  faqs: { question: string; answer: string }[],
  images: { heroImage?: GalleryImage; gallery?: GalleryImage[] },
): Trip {
  const itinerary: TripItineraryDay[] = row.itinerary.map((day) => ({
    dayNumber: day.dayNumber,
    title: day.title,
    location: day.location,
    activities: day.activities.map((a) => a.text),
    travelDistance: day.travelDistance ?? undefined,
    travelTime: day.travelTime ?? undefined,
    hotel: day.hotel ?? undefined,
    meals: day.meals ?? undefined,
    notes: day.notes ?? undefined,
  }));

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    destinationSlug: row.destination.slug,
    states: parseJsonArray<string>(row.states),
    durationDays: row.durationDays,
    durationNights: row.durationNights,
    price: row.price,
    currency: "INR",
    scenic: scenicFor(row.slug),
    heroImage: images.heroImage,
    gallery: images.gallery,
    overview: row.overview,
    highlights: parseJsonArray<string>(row.highlights),
    itinerary,
    inclusions: parseJsonArray<string>(row.inclusions),
    exclusions: parseJsonArray<string>(row.exclusions),
    hotels: parseJsonArray<string>(row.hotels),
    transport: row.transport ?? undefined,
    meals: row.meals ?? undefined,
    bestSeason: row.bestSeason ?? undefined,
    difficulty: row.difficulty as Trip["difficulty"],
    tripType: row.tripType as Trip["tripType"],
    tags: parseJsonArray<string>(row.tags),
    faqs,
    rating: row.rating ?? undefined,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    published: row.status === "PUBLISHED",
  };
}

const include = {
  destination: { select: { slug: true } },
  itinerary: {
    orderBy: { dayNumber: "asc" as const },
    include: { activities: { orderBy: { order: "asc" as const } } },
  },
};

async function getFaqsFor(ownerId: string) {
  const rows = await prisma.faq.findMany({
    where: { ownerType: "TRIP", ownerId },
    orderBy: { order: "asc" },
  });
  return rows.map((f) => ({ question: f.question, answer: f.answer }));
}

async function hydrate(row: TripRow): Promise<Trip> {
  const [faqs, images] = await Promise.all([getFaqsFor(row.id), getImagesFor(row.id)]);
  return mapTrip(row, faqs, images);
}

async function hydrateMany(rows: TripRow[]): Promise<Trip[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);

  const [faqs, usages] = await Promise.all([
    prisma.faq.findMany({
      where: { ownerType: "TRIP", ownerId: { in: ids } },
      orderBy: { order: "asc" },
    }),
    prisma.mediaUsage.findMany({
      where: { ownerType: "TRIP", ownerId: { in: ids }, role: { in: ["HERO", "GALLERY"] } },
      include: { media: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const faqsByOwner = new Map<string, { question: string; answer: string }[]>();
  for (const f of faqs) {
    if (!f.ownerId) continue;
    const list = faqsByOwner.get(f.ownerId) ?? [];
    list.push({ question: f.question, answer: f.answer });
    faqsByOwner.set(f.ownerId, list);
  }

  const imagesByOwner = new Map<string, { heroImage?: GalleryImage; gallery?: GalleryImage[] }>();
  for (const u of usages) {
    const entry = imagesByOwner.get(u.ownerId) ?? {};
    const img: GalleryImage = {
      url: u.media.url,
      alt: u.media.altText ?? u.media.title ?? u.media.fileName,
      width: u.media.width ?? undefined,
      height: u.media.height ?? undefined,
    };
    if (u.role === "HERO" && !entry.heroImage) {
      entry.heroImage = img;
    } else if (u.role === "GALLERY") {
      entry.gallery = entry.gallery ?? [];
      entry.gallery.push(img);
    }
    imagesByOwner.set(u.ownerId, entry);
  }

  return rows.map((row) =>
    mapTrip(row, faqsByOwner.get(row.id) ?? [], imagesByOwner.get(row.id) ?? {}),
  );
}

export async function getPublishedTrips(): Promise<Trip[]> {
  const rows = await prisma.trip.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "asc" },
    include,
  });
  return hydrateMany(rows);
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  const row = await prisma.trip.findFirst({ where: { slug, status: "PUBLISHED" }, include });
  if (!row) return undefined;
  return hydrate(row);
}

export async function getTripByIdAny(id: string): Promise<Trip | undefined> {
  const row = await prisma.trip.findUnique({ where: { id }, include });
  if (!row) return undefined;
  return hydrate(row);
}

export async function getTripsByDestination(destinationSlug: string): Promise<Trip[]> {
  const rows = await prisma.trip.findMany({
    where: { status: "PUBLISHED", destination: { slug: destinationSlug } },
    orderBy: { createdAt: "asc" },
    include,
  });
  return hydrateMany(rows);
}

export async function getSimilarTrips(trip: Trip, limit = 3): Promise<Trip[]> {
  const rows = await prisma.trip.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: trip.slug },
      OR: [{ destination: { slug: trip.destinationSlug } }, { tripType: trip.tripType }],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    include,
  });
  return hydrateMany(rows);
}

export const tripTypeLabels: Record<Trip["tripType"], string> = {
  ADVENTURE: "Adventure",
  LEISURE: "Leisure",
  CULTURAL: "Cultural",
  ROAD_TRIP: "Road Trip",
  WEEKEND: "Weekend",
};

export const difficultyLabels: Record<Trip["difficulty"], string> = {
  EASY: "Easy",
  MODERATE: "Moderate",
  CHALLENGING: "Challenging",
};
