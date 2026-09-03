import Link from "next/link";
import { ChevronRight, Star, Clock, MessageCircle, Phone, Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhotoOrScenic } from "@/components/ui/PhotoOrScenic";
import { Button } from "@/components/ui/Button";
import { Itinerary } from "@/components/trip/Itinerary";
import { Gallery } from "@/components/trip/Gallery";
import { Testimonials } from "@/components/trip/Testimonials";
import { TripCard } from "@/components/marketing/TripCard";
import { UpcomingTripCard } from "@/components/marketing/UpcomingTripCard";
import { tripTypeLabels, difficultyLabels } from "@/lib/data/trips";
import { formatPrice } from "@/lib/format";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import type { Destination, Trip, UpcomingTrip } from "@/lib/data/types";

/**
 * The actual customer-facing trip page, extracted so the admin "Preview"
 * screen can render the exact same component/styling for a draft trip
 * (see app/admin/(protected)/trips/[id]/preview) instead of a separate
 * mockup — per the "preview uses real frontend components" requirement.
 */
export async function TripDetailView({
  trip,
  destination,
  departures,
  similarTrips,
  previewMode,
}: {
  trip: Trip;
  destination: Destination | undefined;
  departures: UpcomingTrip[];
  similarTrips: Trip[];
  previewMode?: boolean;
}) {
  const settings = await getSiteSettings();

  return (
    <main>
      {previewMode ? (
        <div className="bg-terracotta px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest2 text-charcoal">
          Preview Mode — this trip is not visible to customers yet
        </div>
      ) : null}

      <section className="relative flex h-[55vh] min-h-[440px] items-end overflow-hidden">
        <PhotoOrScenic
          image={trip.heroImage}
          pattern={trip.scenic.pattern}
          tone={trip.scenic.tone}
          alt={trip.title}
          sizes="100vw"
          priority
          className="absolute inset-0"
        />
        <Container className="relative z-10 pb-12 text-ivory">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-ivory/70">
            <Link href="/" className="hover:text-ivory">Home</Link>
            <ChevronRight size={12} aria-hidden />
            <Link href="/trips" className="hover:text-ivory">Trips</Link>
            {destination ? (
              <>
                <ChevronRight size={12} aria-hidden />
                <Link href={`/destinations/${destination.slug}`} className="hover:text-ivory">{destination.name}</Link>
              </>
            ) : null}
            <ChevronRight size={12} aria-hidden />
            <span className="text-ivory">{trip.title}</span>
          </nav>
          <span className="rounded-full bg-ivory/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            {tripTypeLabels[trip.tripType]}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] md:text-5xl">{trip.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-ivory/85">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} aria-hidden />
              {trip.durationDays}D / {trip.durationNights}N
            </span>
            {trip.rating ? (
              <span className="inline-flex items-center gap-1.5">
                <Star size={15} className="fill-gold text-gold" aria-hidden />
                {trip.rating.toFixed(1)}
              </span>
            ) : null}
            <span>{difficultyLabels[trip.difficulty]}</span>
            {trip.bestSeason ? <span>Best season: {trip.bestSeason}</span> : null}
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:py-20">
        <div>
          <section>
            <h2 className="font-display text-2xl text-charcoal">Overview</h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-charcoal/75">{trip.overview}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {trip.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-charcoal/75">
                  <Check size={16} className="mt-0.5 shrink-0 text-forest" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <Gallery images={trip.gallery} title={trip.title} />

          <section className="mt-12">
            <h2 className="font-display text-2xl text-charcoal">Day-by-Day Itinerary</h2>
            <div className="mt-5">
              <Itinerary days={trip.itinerary} />
            </div>
          </section>

          <section className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-xl text-charcoal">Inclusions</h2>
              <ul className="mt-3 space-y-2">
                {trip.inclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-charcoal/75">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl text-charcoal">Exclusions</h2>
              <ul className="mt-3 space-y-2">
                {trip.exclusions.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-charcoal/75">
                    <X size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-12 grid gap-6 rounded-2xl border border-charcoal/10 bg-warm-white p-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Hotels</p>
              <ul className="mt-2 space-y-1 text-sm text-charcoal/75">
                {trip.hotels.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Transport</p>
              <p className="mt-2 text-sm text-charcoal/75">{trip.transport}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Meals</p>
              <p className="mt-2 text-sm text-charcoal/75">{trip.meals}</p>
            </div>
          </section>

          <section id="departures" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl text-charcoal">Upcoming Departures</h2>
            {departures.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {departures.map((d) => (
                  <UpcomingTripCard key={d.id} departure={d} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-charcoal/10 bg-warm-white p-6">
                <p className="text-sm text-charcoal/70">
                  No fixed departures are scheduled right now. We can plan this trip for your preferred dates.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button href="/plan-your-trip" variant="primary" size="md">
                    Plan Custom Dates
                  </Button>
                  <a
                    href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.trip(trip.title))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal"
                  >
                    <MessageCircle size={16} aria-hidden />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            )}
          </section>

          <Testimonials tripSlug={trip.slug} />

          {trip.faqs.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-2xl text-charcoal">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10">
                {trip.faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-medium text-charcoal marker:content-none">
                      {faq.question}
                    </summary>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-charcoal/70">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-charcoal/10 bg-ivory p-6 shadow-md shadow-charcoal/5 lg:sticky lg:top-24">
          <p className="text-xs text-charcoal/50">Starting from</p>
          <p className="mt-1 font-display text-3xl text-charcoal">{formatPrice(trip.price, trip.currency)}</p>
          <p className="text-xs text-charcoal/50">per person</p>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="#departures"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-terracotta to-terracotta-dark px-5 py-3 text-sm font-semibold text-charcoal shadow-sm shadow-terracotta/30"
            >
              Book This Trip
            </Link>
            <a
              href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.trip(trip.title))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-5 py-3 text-sm font-medium text-charcoal hover:border-forest/40 hover:bg-forest/[0.04]"
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp
            </a>
            <a
              href={buildTelUrl(settings.phone)}
              className="inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-charcoal/70 hover:text-charcoal"
            >
              <Phone size={16} aria-hidden />
              Call Now
            </a>
          </div>

          <dl className="mt-6 space-y-2 border-t border-charcoal/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/50">Duration</dt>
              <dd className="text-charcoal">{trip.durationDays}D / {trip.durationNights}N</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/50">Trip type</dt>
              <dd className="text-charcoal">{tripTypeLabels[trip.tripType]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/50">Difficulty</dt>
              <dd className="text-charcoal">{difficultyLabels[trip.difficulty]}</dd>
            </div>
          </dl>
        </aside>
      </Container>

      {similarTrips.length > 0 ? (
        <section className="bg-warm-white py-16 md:py-20">
          <Container>
            <h2 className="font-display text-2xl text-charcoal">Similar Trips</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarTrips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  );
}
