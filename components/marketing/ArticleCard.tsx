import Link from "next/link";
import { Clock } from "lucide-react";
import { PhotoOrScenic } from "@/components/ui/PhotoOrScenic";
import { cn } from "@/lib/utils";
import type { TravelGuideArticle } from "@/lib/data/types";

export function ArticleCard({
  article,
  className,
}: {
  article: TravelGuideArticle;
  className?: string;
}) {
  return (
    <Link
      href={`/travel-guide/${article.slug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory shadow-md shadow-charcoal/5 transition-shadow duration-300 ease-smooth hover:shadow-xl hover:shadow-charcoal/15",
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden">
        <PhotoOrScenic
          image={article.heroImage}
          pattern={article.scenic.pattern}
          tone={article.scenic.tone}
          alt={article.title}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
          className="h-full w-full transition-transform duration-500 ease-smooth group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal backdrop-blur">
          {article.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg leading-snug text-charcoal">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal/65">{article.excerpt}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-charcoal/45">
          <Clock size={13} aria-hidden />
          {article.readTimeMinutes} min read
        </p>
      </div>
    </Link>
  );
}
