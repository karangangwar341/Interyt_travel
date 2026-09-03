import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "./ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/motion/StaggerReveal";
import { getPublishedArticles } from "@/lib/data/travel-guide";

export async function TopBlogs() {
  const allArticles = await getPublishedArticles();
  const articles = allArticles.slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Travel Guide"
            title="Stories & Advice from the Trail"
            description="Itineraries, best-time-to-visit notes, and practical guides from our travel experts."
          />
          <Link
            href="/travel-guide"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark"
          >
            Read the Travel Guide
            <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>

        <StaggerReveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <StaggerItem key={article.id}>
              <ArticleCard article={article} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </Container>
    </section>
  );
}
