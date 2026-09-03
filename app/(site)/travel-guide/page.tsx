import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { getPublishedArticles } from "@/lib/data/travel-guide";
import { guideCategories } from "@/lib/data/travel-guide";

export const metadata: Metadata = {
  title: "Travel Guide",
  description:
    "Destination guides, itineraries, best-time-to-visit advice, food guides and road trip notes for traveling across India.",
};

export default async function TravelGuidePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allArticles = await getPublishedArticles();
  const activeCategory = searchParams.category;
  const articles = activeCategory
    ? allArticles.filter((a) => a.category === activeCategory)
    : allArticles;

  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Travel Guide"
          title="Everything you need to plan well"
          description="Destination guides, itineraries, best-time-to-visit advice and practical notes from our travel experts."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/travel-guide"
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !activeCategory ? "bg-forest text-ivory" : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
            }`}
          >
            All
          </Link>
          {guideCategories.map((cat) => (
            <Link
              key={cat}
              href={`/travel-guide?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat ? "bg-forest text-ivory" : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {articles.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-charcoal/10 bg-warm-white p-10 text-center">
            <p className="text-base text-charcoal/70">No articles in this category yet — check back soon.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
