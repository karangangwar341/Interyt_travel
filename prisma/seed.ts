import { PrismaClient } from "@prisma/client";
import { destinations } from "../lib/data/destinations";
import { trips } from "../lib/data/trips";
import { upcomingTrips } from "../lib/data/upcoming-trips";
import { articles, guideCategories } from "../lib/data/travel-guide";
import { testimonials } from "../lib/data/testimonials";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database from existing static content...");

  // ---- Site settings (singleton) ----
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // ---- Blog categories ----
  const categoryIdByName = new Map<string, string>();
  for (const name of guideCategories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const row = await prisma.blogCategory.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    categoryIdByName.set(name, row.id);
  }
  console.log(`- ${categoryIdByName.size} blog categories`);

  // ---- Destinations (+ FAQs) ----
  const destinationIdBySlug = new Map<string, string>();
  for (const d of destinations) {
    const row = await prisma.destination.create({
      data: {
        name: d.name,
        slug: d.slug,
        state: d.state,
        region: d.region,
        summary: d.summary,
        description: d.description,
        bestSeason: d.bestSeason,
        thingsToDo: JSON.stringify(d.thingsToDo),
        experiences: JSON.stringify(d.experiences),
        seoTitle: d.seoTitle,
        seoDescription: d.seoDescription,
        published: d.published,
      },
    });
    destinationIdBySlug.set(d.slug, row.id);

    for (let i = 0; i < d.faqs.length; i++) {
      const faq = d.faqs[i]!;
      await prisma.faq.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          order: i,
          ownerType: "DESTINATION",
          ownerId: row.id,
        },
      });
    }
  }
  console.log(`- ${destinationIdBySlug.size} destinations`);

  // ---- Trips (+ itinerary, activities, FAQs) ----
  const tripIdBySlug = new Map<string, string>();
  let itineraryDayCount = 0;
  let activityCount = 0;
  let tripFaqCount = 0;

  for (const t of trips) {
    const destinationId = destinationIdBySlug.get(t.destinationSlug);
    if (!destinationId) {
      throw new Error(`Trip ${t.slug} references unknown destination ${t.destinationSlug}`);
    }

    const row = await prisma.trip.create({
      data: {
        title: t.title,
        slug: t.slug,
        destinationId,
        states: JSON.stringify(t.states),
        durationDays: t.durationDays,
        durationNights: t.durationNights,
        price: t.price,
        currency: t.currency,
        overview: t.overview,
        highlights: JSON.stringify(t.highlights),
        inclusions: JSON.stringify(t.inclusions),
        exclusions: JSON.stringify(t.exclusions),
        hotels: JSON.stringify(t.hotels),
        transport: t.transport,
        meals: t.meals,
        bestSeason: t.bestSeason,
        difficulty: t.difficulty,
        tripType: t.tripType,
        tags: JSON.stringify(t.tags),
        rating: t.rating,
        seoTitle: t.seoTitle,
        seoDescription: t.seoDescription,
        status: t.published ? "PUBLISHED" : "DRAFT",
      },
    });
    tripIdBySlug.set(t.slug, row.id);

    for (const day of t.itinerary) {
      const dayRow = await prisma.tripItineraryDay.create({
        data: {
          tripId: row.id,
          dayNumber: day.dayNumber,
          title: day.title,
          location: day.location,
          travelDistance: day.travelDistance,
          travelTime: day.travelTime,
          hotel: day.hotel,
          meals: day.meals,
          notes: day.notes,
        },
      });
      itineraryDayCount++;

      for (let i = 0; i < day.activities.length; i++) {
        await prisma.itineraryActivity.create({
          data: { dayId: dayRow.id, text: day.activities[i]!, order: i },
        });
        activityCount++;
      }
    }

    for (let i = 0; i < t.faqs.length; i++) {
      const faq = t.faqs[i]!;
      await prisma.faq.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          order: i,
          ownerType: "TRIP",
          ownerId: row.id,
        },
      });
      tripFaqCount++;
    }
  }
  console.log(`- ${tripIdBySlug.size} trips, ${itineraryDayCount} itinerary days, ${activityCount} activities, ${tripFaqCount} trip FAQs`);

  // ---- Upcoming departures ----
  let upcomingCount = 0;
  for (const u of upcomingTrips) {
    const tripId = tripIdBySlug.get(u.tripSlug);
    if (!tripId) {
      throw new Error(`Upcoming trip ${u.id} references unknown trip ${u.tripSlug}`);
    }
    await prisma.upcomingTrip.create({
      data: {
        tripId,
        departureDate: new Date(u.departureDate),
        returnDate: new Date(u.returnDate),
        departureLocation: u.departureLocation,
        totalSeats: u.totalSeats,
        availableSeats: u.availableSeats,
        price: u.price,
        bookingDeadline: new Date(u.bookingDeadline),
        status: u.status,
        featured: u.featured,
      },
    });
    upcomingCount++;
  }
  console.log(`- ${upcomingCount} upcoming departures`);

  // ---- Blog articles ----
  let articleCount = 0;
  let relatedTripLinkCount = 0;
  for (const a of articles) {
    const categoryId = categoryIdByName.get(a.category);
    if (!categoryId) throw new Error(`Article ${a.slug} references unknown category ${a.category}`);
    const destinationId = a.destinationSlug ? destinationIdBySlug.get(a.destinationSlug) : undefined;

    const row = await prisma.travelGuideArticle.create({
      data: {
        title: a.title,
        slug: a.slug,
        categoryId,
        destinationId,
        excerpt: a.excerpt,
        content: JSON.stringify(a.content),
        readTimeMinutes: a.readTimeMinutes,
        seoTitle: a.seoTitle,
        seoDescription: a.seoDescription,
        published: a.published,
        publishedAt: a.published ? new Date() : null,
      },
    });
    articleCount++;

    // Derive related trips from the article's destination — a real
    // relationship, not fabricated content.
    if (a.destinationSlug) {
      const relatedTrips = trips.filter((t) => t.destinationSlug === a.destinationSlug);
      for (const t of relatedTrips) {
        const tripId = tripIdBySlug.get(t.slug);
        if (!tripId) continue;
        await prisma.blogRelatedTrip.create({
          data: { blogId: row.id, tripId },
        });
        relatedTripLinkCount++;
      }
    }
  }
  console.log(`- ${articleCount} blog articles, ${relatedTripLinkCount} related-trip links`);

  // ---- Reviews (sample/placeholder, clearly flagged) ----
  let reviewCount = 0;
  for (const t of testimonials) {
    const tripId = tripIdBySlug.get(t.tripSlug);
    await prisma.review.create({
      data: {
        customerName: t.name,
        location: t.location,
        rating: t.rating,
        reviewText: t.quote,
        travelMonth: t.travelMonth,
        tripId,
        featured: false,
        published: true,
        isSample: true,
      },
    });
    reviewCount++;
  }
  console.log(`- ${reviewCount} sample reviews`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
