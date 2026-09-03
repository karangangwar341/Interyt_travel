"use client";

import { useFormState } from "react-dom";
import { MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { inputClasses, labelClasses, errorClasses } from "@/components/ui/form-styles";
import { submitBookingEnquiry } from "@/lib/actions/enquiry";
import { initialFormState } from "@/lib/actions/types";
import { formatDate } from "@/lib/format";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import type { Trip, UpcomingTrip } from "@/lib/data/types";

export function BookingEnquiryForm({
  tripSlug,
  trip,
  selectedDeparture,
}: {
  tripSlug: string;
  trip: Trip | undefined;
  selectedDeparture: UpcomingTrip | undefined;
}) {
  const settings = useSiteSettings();
  const [state, formAction] = useFormState(submitBookingEnquiry, initialFormState);

  if (state.status === "success") {
    return (
      <Container className="max-w-xl py-20 text-center md:py-28">
        <p className="text-xs font-medium uppercase tracking-widest2 text-terracotta-dark">Enquiry Received</p>
        <h1 className="mt-4 font-display text-3xl text-charcoal md:text-4xl">Thank you!</h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal/70">{state.message}</p>
        <p className="mt-2 text-sm text-charcoal/60">
          Our travel expert will confirm availability and share payment details shortly.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={buildWhatsAppUrl(
              settings.whatsapp,
              trip
                ? whatsappMessages.trip(trip.title)
                : whatsappMessages.general(),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-6 py-3.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
          >
            <MessageCircle size={18} aria-hidden />
            Chat With a Travel Expert on WhatsApp
          </a>
          <a
            href={buildTelUrl(settings.phone)}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-6 py-3.5 text-sm font-medium text-charcoal"
          >
            <Phone size={18} aria-hidden />
            Call Now
          </a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-2xl py-16 md:py-24">
      <SectionHeading
        eyebrow="Booking Enquiry"
        title={trip ? `Book: ${trip.title}` : "Book This Trip"}
        description={
          selectedDeparture
            ? `Departure: ${formatDate(selectedDeparture.departureDate)} — ${formatDate(selectedDeparture.returnDate)} from ${selectedDeparture.departureLocation}`
            : "Share your details and we'll confirm availability and pricing."
        }
      />

      <form action={formAction} className="mt-10 space-y-6">
        <input type="hidden" name="tripSlug" value={tripSlug} />
        <input type="hidden" name="upcomingTripId" value={selectedDeparture?.id ?? ""} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customerName" className={labelClasses}>Full Name</label>
            <input id="customerName" name="customerName" required className={inputClasses} />
            {state.fieldErrors?.customerName ? <p className={errorClasses}>{state.fieldErrors.customerName[0]}</p> : null}
          </div>
          <div>
            <label htmlFor="phone" className={labelClasses}>Phone</label>
            <input id="phone" name="phone" type="tel" required className={inputClasses} />
            {state.fieldErrors?.phone ? <p className={errorClasses}>{state.fieldErrors.phone[0]}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className={labelClasses}>Email (optional)</label>
            <input id="email" name="email" type="email" className={inputClasses} />
            {state.fieldErrors?.email ? <p className={errorClasses}>{state.fieldErrors.email[0]}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="travelDate" className={labelClasses}>Travel Date</label>
            <input
              id="travelDate"
              name="travelDate"
              type="date"
              defaultValue={selectedDeparture?.departureDate}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="budget" className={labelClasses}>Budget (optional)</label>
            <input id="budget" name="budget" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="adults" className={labelClasses}>Adults</label>
            <input id="adults" name="adults" type="number" min={1} max={20} defaultValue={2} required className={inputClasses} />
          </div>
          <div>
            <label htmlFor="children" className={labelClasses}>Children</label>
            <input id="children" name="children" type="number" min={0} max={10} defaultValue={0} className={inputClasses} />
          </div>
          <div>
            <label htmlFor="rooms" className={labelClasses}>Rooms</label>
            <input id="rooms" name="rooms" type="number" min={1} max={10} defaultValue={1} className={inputClasses} />
          </div>
        </div>

        <div>
          <label htmlFor="message" className={labelClasses}>Special Requirements</label>
          <textarea id="message" name="message" rows={4} className={inputClasses} />
        </div>

        {state.status === "error" && state.message ? (
          <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{state.message}</p>
        ) : null}

        <SubmitButton>Submit Enquiry</SubmitButton>
      </form>
    </Container>
  );
}
