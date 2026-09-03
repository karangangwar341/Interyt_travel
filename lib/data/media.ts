import { prisma } from "@/lib/db";

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
  createdAt: string;
  usageCount: number;
}

export interface MediaUsageDetail {
  ownerType: string;
  role: string;
  label: string;
  href?: string;
}

const OWNER_LABELS: Record<string, string> = {
  TRIP: "Trip",
  DESTINATION: "Destination",
  BLOG: "Blog Article",
  ITINERARY_DAY: "Itinerary Day",
  HOMEPAGE: "Homepage",
  REVIEW: "Review",
};

async function withUsageCounts(mediaIds: string[]) {
  if (mediaIds.length === 0) return new Map<string, number>();
  const usages = await prisma.mediaUsage.groupBy({
    by: ["mediaId"],
    where: { mediaId: { in: mediaIds } },
    _count: { mediaId: true },
  });
  return new Map(usages.map((u) => [u.mediaId, u._count.mediaId]));
}

function mapMedia(row: {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
  createdAt: Date;
}, usageCount: number): MediaItem {
  return {
    id: row.id,
    url: row.url,
    thumbnailUrl: row.thumbnailUrl,
    fileName: row.fileName,
    mimeType: row.mimeType,
    fileSize: row.fileSize,
    width: row.width,
    height: row.height,
    altText: row.altText,
    title: row.title,
    caption: row.caption,
    description: row.description,
    createdAt: row.createdAt.toISOString(),
    usageCount,
  };
}

export async function getAllMedia(options?: { search?: string; unusedOnly?: boolean }): Promise<MediaItem[]> {
  const search = options?.search?.trim();

  const rows = await prisma.media.findMany({
    where: search
      ? {
          OR: [
            { fileName: { contains: search } },
            { altText: { contains: search } },
            { caption: { contains: search } },
            { title: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  const counts = await withUsageCounts(rows.map((r) => r.id));
  const mapped = rows.map((row) => mapMedia(row, counts.get(row.id) ?? 0));

  if (options?.unusedOnly) {
    return mapped.filter((m) => m.usageCount === 0);
  }
  return mapped;
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const row = await prisma.media.findUnique({ where: { id } });
  if (!row) return null;
  const counts = await withUsageCounts([id]);
  return mapMedia(row, counts.get(id) ?? 0);
}

async function resolveOwnerLabel(ownerType: string, ownerId: string): Promise<{ label: string; href?: string }> {
  switch (ownerType) {
    case "TRIP": {
      const trip = await prisma.trip.findUnique({ where: { id: ownerId }, select: { title: true, slug: true } });
      return trip ? { label: trip.title, href: `/trips/${trip.slug}` } : { label: "Trip (deleted)" };
    }
    case "DESTINATION": {
      const destination = await prisma.destination.findUnique({ where: { id: ownerId }, select: { name: true, slug: true } });
      return destination ? { label: destination.name, href: `/destinations/${destination.slug}` } : { label: "Destination (deleted)" };
    }
    case "BLOG": {
      const article = await prisma.travelGuideArticle.findUnique({ where: { id: ownerId }, select: { title: true, slug: true } });
      return article ? { label: article.title, href: `/travel-guide/${article.slug}` } : { label: "Blog article (deleted)" };
    }
    case "ITINERARY_DAY": {
      const day = await prisma.tripItineraryDay.findUnique({
        where: { id: ownerId },
        select: { dayNumber: true, title: true, trip: { select: { title: true, slug: true } } },
      });
      return day
        ? { label: `${day.trip.title} — Day ${day.dayNumber}: ${day.title}`, href: `/trips/${day.trip.slug}` }
        : { label: "Itinerary day (deleted)" };
    }
    case "REVIEW": {
      const review = await prisma.review.findUnique({ where: { id: ownerId }, select: { customerName: true } });
      return review ? { label: `Review — ${review.customerName}` } : { label: "Review (deleted)" };
    }
    case "HOMEPAGE":
      return { label: "Homepage", href: "/" };
    default:
      return { label: ownerType };
  }
}

export async function getMediaUsageDetails(mediaId: string): Promise<MediaUsageDetail[]> {
  const usages = await prisma.mediaUsage.findMany({ where: { mediaId } });
  return Promise.all(
    usages.map(async (u) => {
      const { label, href } = await resolveOwnerLabel(u.ownerType, u.ownerId);
      return {
        ownerType: OWNER_LABELS[u.ownerType] ?? u.ownerType,
        role: u.role,
        label,
        href,
      };
    }),
  );
}
