import { prisma } from "@/lib/db";
import type { GalleryImage, GuideSection } from "./types";

export interface AdminArticleListItem {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  destinationName: string | null;
  published: boolean;
  updatedAt: string;
}

export async function getAllArticlesForAdmin(options?: {
  search?: string;
  categoryId?: string;
  published?: "ALL" | "PUBLISHED" | "DRAFT";
}): Promise<AdminArticleListItem[]> {
  const search = options?.search?.trim();

  const rows = await prisma.travelGuideArticle.findMany({
    where: {
      title: search ? { contains: search } : undefined,
      categoryId: options?.categoryId && options.categoryId !== "ALL" ? options.categoryId : undefined,
      published:
        options?.published === "PUBLISHED" ? true : options?.published === "DRAFT" ? false : undefined,
    },
    include: { category: { select: { name: true } }, destination: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryName: row.category.name,
    destinationName: row.destination?.name ?? null,
    published: row.published,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export interface AdminArticleRecord {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  destinationId: string;
  excerpt: string;
  sections: GuideSection[];
  readTimeMinutes: number;
  relatedTripIds: string[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  heroImage: (GalleryImage & { mediaId: string }) | null;
}

export async function getArticleForEdit(id: string): Promise<AdminArticleRecord | null> {
  const row = await prisma.travelGuideArticle.findUnique({
    where: { id },
    include: { relatedTrips: { select: { tripId: true } } },
  });
  if (!row) return null;

  let sections: GuideSection[] = [];
  try {
    sections = JSON.parse(row.content);
  } catch {
    sections = [];
  }

  const heroUsage = await prisma.mediaUsage.findFirst({
    where: { ownerType: "BLOG", ownerId: id, role: "HERO" },
    include: { media: true },
  });

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.categoryId,
    destinationId: row.destinationId ?? "",
    excerpt: row.excerpt,
    sections,
    readTimeMinutes: row.readTimeMinutes,
    relatedTripIds: row.relatedTrips.map((r) => r.tripId),
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

export async function getCategoryOptions(): Promise<{ id: string; name: string }[]> {
  return prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
}
