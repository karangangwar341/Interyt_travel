import Link from "next/link";
import { ChevronRight, Clock, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhotoOrScenic } from "@/components/ui/PhotoOrScenic";
import { Button } from "@/components/ui/Button";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import type { Destination, TravelGuideArticle } from "@/lib/data/types";

/**
 * The actual customer-facing article page, extracted so the admin "Preview"
 * screen can render the exact same component/styling for a draft article
 * (see app/admin/(protected)/blog/[id]/preview) instead of a separate
 * mockup — mirrors the same pattern used by TripDetailView.
 */
export async function ArticleDetailView({
  article,
  destination,
  related,
  previewMode,
}: {
  article: TravelGuideArticle;
  destination: Destination | undefined;
  related: TravelGuideArticle[];
  previewMode?: boolean;
}) {
  const settings = await getSiteSettings();

  return (
    <main>
      {previewMode ? (
        <div className="bg-terracotta px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest2 text-charcoal">
          Preview Mode — this article is not visible to customers yet
        </div>
      ) : null}

      <section className="relative flex h-[45vh] min-h-[340px] items-end overflow-hidden">
        <PhotoOrScenic
          image={article.heroImage}
          pattern={article.scenic.pattern}
          tone={article.scenic.tone}
          alt={article.title}
          sizes="100vw"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" aria-hidden />
        <Container className="relative z-10 pb-10 text-ivory">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-ivory/70">
            <Link href="/" className="hover:text-ivory">Home</Link>
            <ChevronRight size={12} aria-hidden />
            <Link href="/travel-guide" className="hover:text-ivory">Travel Guide</Link>
            <ChevronRight size={12} aria-hidden />
            <span className="text-ivory">{article.title}</span>
          </nav>
          <span className="rounded-full bg-ivory/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            {article.category}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">{article.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-ivory/75">
            <Clock size={14} aria-hidden />
            {article.readTimeMinutes} min read
          </p>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:py-20">
        <article className="max-w-prose">
          <p className="text-lg leading-relaxed text-charcoal/80">{article.excerpt}</p>

          {article.content.map((section, i) => (
            <section key={section.heading ?? i} className="mt-8">
              {section.heading ? (
                <h2 className="font-display text-xl text-charcoal">{section.heading}</h2>
              ) : null}
              {section.paragraphs.map((p, pi) => (
                <p key={pi} className="mt-3 leading-relaxed text-charcoal/75">
                  {p}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-charcoal/75">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <aside className="h-fit rounded-2xl border border-charcoal/10 bg-warm-white p-6 shadow-md shadow-charcoal/5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-charcoal">
            {destination ? `Plan your ${destination.name} trip` : "Plan your trip"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
            Talk to a travel expert about turning this guide into a real itinerary.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {destination ? (
              <Button href={`/destinations/${destination.slug}`} variant="primary" size="md" className="w-full">
                Explore {destination.name}
              </Button>
            ) : (
              <Button href="/plan-your-trip" variant="primary" size="md" className="w-full">
                Plan a Custom Trip
              </Button>
            )}
            <a
              href={buildWhatsAppUrl(
                settings.whatsapp,
                destination ? whatsappMessages.destination(destination.name) : whatsappMessages.general(),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal hover:border-forest/40 hover:bg-forest/[0.04]"
            >
              <MessageCircle size={16} aria-hidden />
              Ask on WhatsApp
            </a>
          </div>
        </aside>
      </Container>

      {related.length > 0 ? (
        <section className="bg-warm-white py-16 md:py-20">
          <Container>
            <h2 className="font-display text-2xl text-charcoal">More Guides</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  );
}
