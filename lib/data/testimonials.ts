import { prisma } from "@/lib/db";

export type { Testimonial } from "./testimonials.seed";
export { testimonials } from "./testimonials.seed";

export interface ReviewWithTrip {
  tripSlug: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  travelMonth: string;
  isSample: boolean;
}

export async function getFeaturedReviews(limit = 6): Promise<ReviewWithTrip[]> {
  const rows = await prisma.review.findMany({
    where: { published: true, featured: true },
    include: { trip: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    tripSlug: r.trip?.slug ?? "",
    name: r.customerName,
    location: r.location ?? "",
    rating: r.rating,
    quote: r.reviewText,
    travelMonth: r.travelMonth ?? "",
    isSample: r.isSample,
  }));
}

export async function getTestimonialsForTrip(tripSlug: string): Promise<ReviewWithTrip[]> {
  const rows = await prisma.review.findMany({
    where: { published: true, trip: { slug: tripSlug } },
    include: { trip: { select: { slug: true } } },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((r) => ({
    tripSlug: r.trip?.slug ?? tripSlug,
    name: r.customerName,
    location: r.location ?? "",
    rating: r.rating,
    quote: r.reviewText,
    travelMonth: r.travelMonth ?? "",
    isSample: r.isSample,
  }));
}
