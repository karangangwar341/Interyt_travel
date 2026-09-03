import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import type { GalleryImage } from "./types";

export interface AdminDestinationListItem {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: string;
  published: boolean;
  tripCount: number;
  updatedAt: string;
}

export async function getAllDestinationsForAdmin(options?: {
  search?: string;
  region?: string;
  published?: "ALL" | "PUBLISHED" | "DRAFT";
}): Promise<AdminDestinationListItem[]> {
  const search = options?.search?.trim();

  const rows = await prisma.destination.findMany({
    where: {
      name: search ? { contains: search } : undefined,
      region: options?.region && options.region !== "ALL" ? options.region : undefined,
      published:
        options?.published === "PUBLISHED" ? true : options?.published === "DRAFT" ? false : undefined,
    },
    include: { _count: { select: { trips: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    state: row.state,
    region: row.region,
    published: row.published,
    tripCount: row._count.trips,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export interface AdminDestinationRecord {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: string;
  summary: string;
  description: string;
  bestSeason: string;
  thingsToDo: string[];
  experiences: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  heroImage: (GalleryImage & { mediaId: string }) | null;
}

export async function getDestinationForEdit(id: string): Promise<AdminDestinationRecord | null> {
  const row = await prisma.destination.findUnique({ where: { id } });
  if (!row) return null;

  const [faqs, heroUsage] = await Promise.all([
    prisma.faq.findMany({ where: { ownerType: "DESTINATION", ownerId: id }, orderBy: { order: "asc" } }),
    prisma.mediaUsage.findFirst({ where: { ownerType: "DESTINATION", ownerId: id, role: "HERO" }, include: { media: true } }),
  ]);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    state: row.state,
    region: row.region,
    summary: row.summary,
    description: row.description,
    bestSeason: row.bestSeason,
    thingsToDo: parseJsonArray<string>(row.thingsToDo),
    experiences: parseJsonArray<string>(row.experiences),
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
    published: row.published,
    heroImage: heroUsage
      ? {
          mediaId: heroUsage.media.id,
          url: heroUsage.media.url,
          alt: heroUsage.media.altText ?? heroUsage.media.title ?? heroUsage.media.fileName,
          width: heroUsage.media.width ?? undefined,
          height: heroUsage.media.height ?? undefined,
        }
      : null,
  };
}
