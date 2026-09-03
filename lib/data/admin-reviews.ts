import { prisma } from "@/lib/db";

export interface AdminReviewListItem {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  tripTitle: string | null;
  featured: boolean;
  published: boolean;
  isSample: boolean;
  createdAt: string;
}

export async function getAllReviewsForAdmin(options?: {
  tripId?: string;
  published?: "ALL" | "PUBLISHED" | "DRAFT";
}): Promise<AdminReviewListItem[]> {
  const rows = await prisma.review.findMany({
    where: {
      tripId: options?.tripId && options.tripId !== "ALL" ? options.tripId : undefined,
      published:
        options?.published === "PUBLISHED" ? true : options?.published === "DRAFT" ? false : undefined,
    },
    include: { trip: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    customerName: row.customerName,
    location: row.location ?? "",
    rating: row.rating,
    tripTitle: row.trip?.title ?? null,
    featured: row.featured,
    published: row.published,
    isSample: row.isSample,
    createdAt: row.createdAt.toISOString(),
  }));
}

export interface AdminReviewRecord {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  reviewText: string;
  travelMonth: string;
  tripId: string;
  featured: boolean;
  published: boolean;
}

export async function getReviewForEdit(id: string): Promise<AdminReviewRecord | null> {
  const row = await prisma.review.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customerName,
    location: row.location ?? "",
    rating: row.rating,
    reviewText: row.reviewText,
    travelMonth: row.travelMonth ?? "",
    tripId: row.tripId ?? "",
    featured: row.featured,
    published: row.published,
  };
}
