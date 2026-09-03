import Link from "next/link";
import { ChevronRight, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhotoOrScenic } from "@/components/ui/PhotoOrScenic";
import { Button } from "@/components/ui/Button";
import { TripCard } from "@/components/marketing/TripCard";
import { regionLabels } from "@/lib/data/destinations";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import type { Destination, Trip } from "@/lib/data/types";

/**
 * The actual customer-facing destination page, extracted so the admin
 * "Preview" screen can render the exact same component/styling for a draft
 * destination — mirrors TripDetailView / ArticleDetailView.
 */
export async function DestinationDetailView({
  destination,
  trips,
  previewMode,
}: {
  destination: Destination;
  trips: Trip[];
  previewMode?: boolean;
}) {
  const settings = await getSiteSettings();

  return (
    <main>
      {previewMode ? (
        <div className="bg-terracotta px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest2 text-charcoal">
          Preview Mode — this destination is not visible to customers yet
        </div>
      ) : null}

      <section className="relative flex h-[55vh] min-h-[420px] items-end overflow-hidden">
        <PhotoOrScenic
          image={destination.heroImage}
          pattern={destination.scenic.pattern}
          tone={destination.scenic.tone}
          alt={destination.name}
          sizes="100vw"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" aria-hidden />
        <Container className="relative z-10 pb-12 text-ivory">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-ivory/70">
            <Link href="/" className="hover:text-ivory">Home</Link>
            <ChevronRight size={12} aria-hidden />
            <Link href="/destinations" className="hover:text-ivory">Destinations</Link>
            <ChevronRight size={12} aria-hidden />
            <span className="text-ivory">{destination.name}</span>
          </nav>
          <p className="text-xs uppercase tracking-widest2 text-sand-light">
            {destination.state} · {regionLabels[destination.region]}
          </p>
          <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] md:text-6xl">{destination.name}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/80">{destination.summary}</p>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:py-20">
        <div>
          <section>
            <h2 className="font-display text-2xl text-charcoal">About {destination.name}</h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-charcoal/75">
              {destination.description}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl text-charcoal">Best Time to Visit</h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-charcoal/75">
              {destination.bestSeason}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl text-charcoal">Things to Do</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {destination.thingsToDo.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-charcoal/10 bg-warm-white px-4 py-3 text-sm text-charcoal/80 shadow-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl text-charcoal">Experiences</h2>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {destination.experiences.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-terracotta/15 px-4 py-2 text-sm font-medium text-terracotta-dark"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {trips.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-2xl text-charcoal">Trips to {destination.name}</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          ) : null}

          {destination.faqs.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-2xl text-charcoal">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10">
                {destination.faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-medium text-charcoal marker:content-none">
                      {faq.question}
                    </summary>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-charcoal/70">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-charcoal/10 bg-warm-white p-6 shadow-md shadow-charcoal/5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-charcoal">Plan your {destination.name} trip</h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
            Tell us your dates and travel style — we&apos;ll help you build the right itinerary.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Button href="/plan-your-trip" variant="primary" size="md" className="w-full">
              Plan a Custom Trip
            </Button>
            <a
              href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.destination(destination.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal hover:border-forest/40 hover:bg-forest/[0.04]"
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp about {destination.name}
            </a>
            <a
              href={buildTelUrl(settings.phone)}
              className="inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-charcoal/70 hover:text-charcoal"
            >
              <Phone size={16} aria-hidden />
              Call a travel expert
            </a>
          </div>
        </aside>
      </Container>
    </main>
  );
}
