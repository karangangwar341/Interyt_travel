import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import { destinations as scenicSeed } from "./destinations.seed";
import type { GalleryImage, Destination } from "./types";

export { destinations } from "./destinations.seed";

// Scenic SVG art is keyed by slug rather than stored in the DB — it's a
// purely presentational fallback (see components/ui/ScenicBlock.tsx), not
// editable business content.
function scenicFor(slug: string) {
  return (
    scenicSeed.find((d) => d.slug === slug)?.scenic ?? { pattern: "hills" as const, tone: "forest" as const }
  );
}

type DestinationRow = {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: string;
  summary: string;
  description: string;
  bestSeason: string;
  thingsToDo: string;
  experiences: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
};

function mapDestination(
  row: DestinationRow,
  faqs: { question: string; answer: string }[],
  heroImage?: GalleryImage,
): Destination {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    state: row.state,
    region: row.region as Destination["region"],
    summary: row.summary,
    description: row.description,
    bestSeason: row.bestSeason,
    thingsToDo: parseJsonArray<string>(row.thingsToDo),
    experiences: parseJsonArray<string>(row.experiences),
    faqs,
    scenic: scenicFor(row.slug),
    heroImage,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    published: row.published,
  };
}

async function getFaqsFor(ownerId: string) {
  const rows = await prisma.faq.findMany({
    where: { ownerType: "DESTINATION", ownerId },
    orderBy: { order: "asc" },
  });
  return rows.map((f) => ({ question: f.question, answer: f.answer }));
}

async function getHeroImageFor(destinationId: string): Promise<GalleryImage | undefined> {
  const usage = await prisma.mediaUsage.findFirst({
    where: { ownerType: "DESTINATION", ownerId: destinationId, role: "HERO" },
    include: { media: true },
  });
  if (!usage) return undefined;
  return {
    url: usage.media.url,
    alt: usage.media.altText ?? usage.media.title ?? usage.media.fileName,
    width: usage.media.width ?? undefined,
    height: usage.media.height ?? undefined,
  };
}

async function hydrate(row: DestinationRow): Promise<Destination> {
  const [faqs, heroImage] = await Promise.all([getFaqsFor(row.id), getHeroImageFor(row.id)]);
  return mapDestination(row, faqs, heroImage);
}

async function hydrateMany(rows: DestinationRow[]): Promise<Destination[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);

  const [faqs, heroUsages] = await Promise.all([
    prisma.faq.findMany({
      where: { ownerType: "DESTINATION", ownerId: { in: ids } },
      orderBy: { order: "asc" },
    }),
    prisma.mediaUsage.findMany({
      where: { ownerType: "DESTINATION", ownerId: { in: ids }, role: "HERO" },
      include: { media: true },
    }),
  ]);

  const faqsByOwner = new Map<string, { question: string; answer: string }[]>();
  for (const f of faqs) {
    if (!f.ownerId) continue;
    const list = faqsByOwner.get(f.ownerId) ?? [];
    list.push({ question: f.question, answer: f.answer });
    faqsByOwner.set(f.ownerId, list);
  }

  const heroByOwner = new Map<string, GalleryImage>();
  for (const u of heroUsages) {
    if (!heroByOwner.has(u.ownerId)) {
      heroByOwner.set(u.ownerId, {
        url: u.media.url,
        alt: u.media.altText ?? u.media.title ?? u.media.fileName,
        width: u.media.width ?? undefined,
        height: u.media.height ?? undefined,
      });
    }
  }

  return rows.map((row) =>
    mapDestination(row, faqsByOwner.get(row.id) ?? [], heroByOwner.get(row.id)),
  );
}

export async function getAllDestinations(): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });
  return hydrateMany(rows);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const row = await prisma.destination.findFirst({ where: { slug, published: true } });
  if (!row) return undefined;
  return hydrate(row);
}

export async function getDestinationsByRegion(region: Destination["region"]): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    where: { region, published: true },
    orderBy: { createdAt: "asc" },
  });
  return hydrateMany(rows);
}

export async function getDestinationByIdAny(id: string): Promise<Destination | undefined> {
  const row = await prisma.destination.findUnique({ where: { id } });
  if (!row) return undefined;
  return hydrate(row);
}

export const regionLabels: Record<Destination["region"], string> = {
  NORTH: "North India",
  WEST: "West India",
  SOUTH: "South India",
  EAST: "East India",
  NORTHEAST: "Northeast India",
};
