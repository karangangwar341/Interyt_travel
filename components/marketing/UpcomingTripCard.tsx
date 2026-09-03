import Link from "next/link";
import { MapPin, Users, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DepartureCountdown } from "./DepartureCountdown";
import { getTripBySlug } from "@/lib/data/trips";
import { departureStatusLabels } from "@/lib/data/upcoming-trips";
import { formatDate, formatPrice } from "@/lib/format";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import type { UpcomingTrip } from "@/lib/data/types";

const statusTone: Record<UpcomingTrip["status"], "success" | "warning" | "danger" | "neutral"> = {
  SEATS_AVAILABLE: "success",
  ALMOST_FULL: "warning",
  SOLD_OUT: "danger",
  COMPLETED: "neutral",
  CANCELLED: "neutral",
};

export async function UpcomingTripCard({ departure }: { departure: UpcomingTrip }) {
  const [trip, settings] = await Promise.all([getTripBySlug(departure.tripSlug), getSiteSettings()]);
  if (!trip) return null;

  const soldOut = departure.status === "SOLD_OUT";

  return (
    <div className="flex flex-col rounded-2xl border border-charcoal/10 bg-ivory p-5 shadow-md shadow-charcoal/5 transition-shadow duration-300 ease-smooth hover:shadow-xl hover:shadow-charcoal/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-charcoal/45">
            {trip.durationDays}D / {trip.durationNights}N
          </p>
          <h3 className="mt-1 font-display text-xl text-charcoal">{trip.title}</h3>
        </div>
        <Badge tone={statusTone[departure.status]}>{departureStatusLabels[departure.status]}</Badge>
      </div>

      {departure.featured ? (
        <div className="mt-3">
          <DepartureCountdown departureDate={departure.departureDate} />
        </div>
      ) : null}

      <div className="mt-4 space-y-2 text-sm text-charcoal/70">
        <p className="flex items-center gap-2">
          <MapPin size={15} aria-hidden />
          Departs from {departure.departureLocation}
        </p>
        <p>
          {formatDate(departure.departureDate)} — {formatDate(departure.returnDate)}
        </p>
        <p className="flex items-center gap-2">
          <Users size={15} aria-hidden />
          {soldOut ? "Fully booked" : `${departure.availableSeats} of ${departure.totalSeats} seats available`}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-charcoal/10 pt-4">
        <div>
          <p className="text-xs text-charcoal/50">Per person</p>
          <p className="text-lg font-semibold text-charcoal">{formatPrice(departure.price)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link
          href={`/trips/${trip.slug}`}
          className="rounded-full border-2 border-charcoal/15 px-3 py-2 text-center text-xs font-medium text-charcoal hover:border-forest/40"
        >
          View Trip
        </Link>
        <Link
          href={`/book?trip=${trip.slug}&departure=${departure.id}`}
          className={`rounded-full px-3 py-2 text-center text-xs font-semibold ${
            soldOut
              ? "pointer-events-none bg-charcoal/10 text-charcoal/40"
              : "bg-gradient-to-r from-terracotta to-terracotta-dark text-charcoal shadow-sm shadow-terracotta/30"
          }`}
        >
          {soldOut ? "Sold Out" : "Book Now"}
        </Link>
        <a
          href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.tripDeparture(trip.title, formatDate(departure.departureDate)))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-forest/10 px-3 py-2 text-forest"
          aria-label="Ask about this departure on WhatsApp"
        >
          <MessageCircle size={16} aria-hidden />
        </a>
      </div>
    </div>
  );
}
