"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { inputClasses, labelClasses, errorClasses } from "@/components/ui/form-styles";
import { submitCustomTripRequest } from "@/lib/actions/custom-trip";
import { initialFormState } from "@/lib/actions/types";
import { interestOptions, travelStyleOptions } from "@/lib/validations/enquiry";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import type { Destination } from "@/lib/data/types";

const durationOptions = [
  { value: "", label: "Not sure yet" },
  { value: "2-4", label: "Weekend (2-4 days)" },
  { value: "5-7", label: "Short (5-7 days)" },
  { value: "8-14", label: "Extended (8-14 days)" },
  { value: "15+", label: "15+ days" },
];

export function PlanYourTripForm({ destinations }: { destinations: Destination[] }) {
  const settings = useSiteSettings();
  const [state, formAction] = useFormState(submitCustomTripRequest, initialFormState);
  const [interests, setInterests] = useState<string[]>([]);
  const [destination, setDestination] = useState("");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }

  if (state.status === "success") {
    const destinationName = destinations.find((d) => d.slug === destination)?.name;
    return (
      <main className="py-20 md:py-28">
        <Container className="max-w-xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest2 text-terracotta-dark">Request Received</p>
          <h1 className="mt-4 font-display text-3xl text-charcoal md:text-4xl">
            We&apos;re building your itinerary
          </h1>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">{state.message}</p>
          <p className="mt-2 text-sm text-charcoal/60">
            A travel expert will reach out with a custom plan. For the fastest response, chat with us directly.
          </p>
          <a
            href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.customTrip(destinationName))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-6 py-3.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
          >
            <MessageCircle size={18} aria-hidden />
            Chat With a Travel Expert on WhatsApp
          </a>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Plan Your Trip"
          title="Create My Trip"
          description="Tell us what you're looking for and we'll design a custom itinerary around it — no obligation to book."
        />

        <form action={formAction} className="mt-10 space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className={labelClasses}>Full Name</label>
              <input id="customerName" name="customerName" required className={inputClasses} />
              {state.fieldErrors?.customerName ? (
                <p className={errorClasses}>{state.fieldErrors.customerName[0]}</p>
              ) : null}
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
              <label htmlFor="destination" className={labelClasses}>Destination</label>
              <select
                id="destination"
                name="destination"
                className={inputClasses}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="">Not sure yet</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="travelDate" className={labelClasses}>Preferred Travel Date</label>
              <input id="travelDate" name="travelDate" type="date" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="durationDays" className={labelClasses}>Duration</label>
              <select id="durationDays" name="durationDays" className={inputClasses}>
                {durationOptions.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="adults" className={labelClasses}>Adults</label>
                <input id="adults" name="adults" type="number" min={1} max={20} defaultValue={2} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="children" className={labelClasses}>Children</label>
                <input id="children" name="children" type="number" min={0} max={10} defaultValue={0} className={inputClasses} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Travel Style</label>
            <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {travelStyleOptions.map((style, i) => (
                <label
                  key={style.value}
                  className="flex cursor-pointer items-center justify-center rounded-full border-2 border-charcoal/15 px-3 py-2 text-sm text-charcoal has-[:checked]:border-forest has-[:checked]:bg-forest/10 has-[:checked]:text-forest-dark"
                >
                  <input
                    type="radio"
                    name="travelStyle"
                    value={style.value}
                    defaultChecked={i === 1}
                    className="sr-only"
                  />
                  {style.label}
                </label>
              ))}
            </div>
            {state.fieldErrors?.travelStyle ? <p className={errorClasses}>{state.fieldErrors.travelStyle[0]}</p> : null}
          </div>

          <div>
            <label className={labelClasses}>Interests</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    interests.includes(interest)
                      ? "bg-forest text-ivory"
                      : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {interests.map((i) => (
              <input key={i} type="hidden" name="interests" value={i} />
            ))}
            {state.fieldErrors?.interests ? <p className={errorClasses}>{state.fieldErrors.interests[0]}</p> : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className={labelClasses}>Budget (per person)</label>
              <input id="budget" name="budget" placeholder="e.g. ₹30,000 - ₹50,000" className={inputClasses} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className={labelClasses}>Anything else we should know?</label>
              <textarea id="message" name="message" rows={4} className={inputClasses} />
            </div>
          </div>

          {state.status === "error" && state.message ? (
            <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{state.message}</p>
          ) : null}

          <SubmitButton>Create My Trip</SubmitButton>
        </form>
      </Container>
    </main>
  );
}
