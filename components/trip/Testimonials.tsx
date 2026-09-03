import { Star, Quote } from "lucide-react";
import { getTestimonialsForTrip } from "@/lib/data/testimonials";

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}

export async function Testimonials({ tripSlug }: { tripSlug: string }) {
  const items = await getTestimonialsForTrip(tripSlug);
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-charcoal">Traveler Stories</h2>
        <p className="text-[10px] uppercase tracking-widest2 text-charcoal/35">
          Sample reviews for preview
        </p>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {items.map((t) => (
          <div
            key={`${t.tripSlug}-${t.name}`}
            className="relative rounded-2xl border border-charcoal/10 bg-warm-white p-6"
          >
            <Quote className="absolute right-5 top-5 text-charcoal/10" size={32} aria-hidden />
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-light text-sm font-semibold text-ivory">
                {initials(t.name)}
              </span>
              <div>
                <p className="font-medium text-charcoal">{t.name}</p>
                <p className="text-xs text-charcoal/50">{t.location} · {t.travelMonth}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < t.rating ? "fill-gold text-gold" : "text-charcoal/15"}
                  aria-hidden
                />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/75">&ldquo;{t.quote}&rdquo;</p>
          </div>
        ))}
      </div>
    </section>
  );
}
