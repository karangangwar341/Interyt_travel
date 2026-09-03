import { MapPin, Hotel, Utensils, Route } from "lucide-react";
import type { TripItineraryDay } from "@/lib/data/types";

export function Itinerary({ days }: { days: TripItineraryDay[] }) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[15px] top-2 w-px bg-charcoal/15" aria-hidden />
      <ol className="space-y-4">
        {days.map((day) => (
          <li key={day.dayNumber} className="relative pl-10">
            <span className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-xs font-semibold text-ivory">
              {day.dayNumber}
            </span>
            <details className="group rounded-2xl border border-charcoal/10 bg-ivory shadow-sm shadow-charcoal/5" open={day.dayNumber === 1}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:content-none">
                <div>
                  <p className="text-xs uppercase tracking-widest2 text-charcoal/45">Day {day.dayNumber}</p>
                  <h3 className="mt-0.5 font-display text-lg text-charcoal">{day.title}</h3>
                </div>
                <span className="shrink-0 text-charcoal/40 transition-transform duration-200 group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="space-y-3 border-t border-charcoal/10 px-5 pb-5 pt-4 text-sm text-charcoal/75">
                <p className="flex items-center gap-2">
                  <MapPin size={15} aria-hidden />
                  {day.location}
                  {day.travelDistance ? ` · ${day.travelDistance}` : ""}
                  {day.travelTime ? ` (${day.travelTime})` : ""}
                </p>

                <ul className="list-disc space-y-1 pl-5">
                  {day.activities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>

                {day.hotel ? (
                  <p className="flex items-center gap-2">
                    <Hotel size={15} aria-hidden />
                    {day.hotel}
                  </p>
                ) : null}
                {day.meals ? (
                  <p className="flex items-center gap-2">
                    <Utensils size={15} aria-hidden />
                    {day.meals}
                  </p>
                ) : null}
                {day.notes ? (
                  <p className="flex items-center gap-2 text-charcoal/60">
                    <Route size={15} aria-hidden />
                    {day.notes}
                  </p>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
