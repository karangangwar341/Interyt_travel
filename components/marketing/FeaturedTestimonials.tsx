import { Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/motion/StaggerReveal";
import { getFeaturedReviews } from "@/lib/data/testimonials";

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}

export async function FeaturedTestimonials() {
  const reviews = await getFeaturedReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Traveler Stories"
            title="What Our Travelers Say"
            description="Real feedback from travelers who've journeyed with us across India."
          />
        </Reveal>

        <StaggerReveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((t) => (
            <StaggerItem key={`${t.name}-${t.quote.slice(0, 12)}`}>
              <div className="relative h-full rounded-2xl border border-charcoal/10 bg-warm-white p-6">
                <Quote className="absolute right-5 top-5 text-charcoal/10" size={32} aria-hidden />
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-light text-sm font-semibold text-ivory">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="font-medium text-charcoal">{t.name}</p>
                    <p className="text-xs text-charcoal/50">{[t.location, t.travelMonth].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < t.rating ? "fill-gold text-gold" : "text-charcoal/15"} aria-hidden />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">&ldquo;{t.quote}&rdquo;</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </Container>
    </section>
  );
}
