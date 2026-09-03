import { prisma } from "@/lib/db";
import { articles as scenicSeed } from "./travel-guide.seed";
import type { GalleryImage, GuideSection, TravelGuideArticle } from "./types";

export { guideCategories, articles } from "./travel-guide.seed";

function scenicFor(slug: string) {
  return (
    scenicSeed.find((a) => a.slug === slug)?.scenic ?? { pattern: "hills" as const, tone: "forest" as const }
  );
}

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  category: { name: string };
  destination: { slug: string } | null;
  excerpt: string;
  content: string;
  readTimeMinutes: number;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
};

async function getHeroImageFor(articleId: string): Promise<GalleryImage | undefined> {
  const usage = await prisma.mediaUsage.findFirst({
    where: { ownerType: "BLOG", ownerId: articleId, role: "HERO" },
    include: { media: true },
  });
  if (!usage) return undefined;
  return {
    url: usage.media.url,
    alt: usage.media.altText ?? usage.media.title ?? usage.media.fileName,
    width: usage.media.width ?? undefined,
    height: usage.media.height ?? undefined,
  };
}

function mapArticle(row: ArticleRow, heroImage?: GalleryImage): TravelGuideArticle {
  let content: GuideSection[] = [];
  try {
    content = JSON.parse(row.content);
  } catch {
    content = [];
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category.name as TravelGuideArticle["category"],
    destinationSlug: row.destination?.slug,
    excerpt: row.excerpt,
    content,
    readTimeMinutes: row.readTimeMinutes,
    scenic: scenicFor(row.slug),
    heroImage,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    published: row.published,
  };
}

async function hydrate(row: ArticleRow): Promise<TravelGuideArticle> {
  const heroImage = await getHeroImageFor(row.id);
  return mapArticle(row, heroImage);
}

const include = {
  category: { select: { name: true } },
  destination: { select: { slug: true } },
};

export async function getPublishedArticles(): Promise<TravelGuideArticle[]> {
  const rows = await prisma.travelGuideArticle.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include,
  });
  return Promise.all(rows.map(hydrate));
}

export async function getArticleBySlug(slug: string): Promise<TravelGuideArticle | undefined> {
  const row = await prisma.travelGuideArticle.findFirst({
    where: { slug, published: true },
    include,
  });
  return row ? hydrate(row) : undefined;
}

export async function getArticlesByCategory(category: string): Promise<TravelGuideArticle[]> {
  const rows = await prisma.travelGuideArticle.findMany({
    where: { published: true, category: { name: category } },
    orderBy: { createdAt: "asc" },
    include,
  });
  return Promise.all(rows.map(hydrate));
}

export async function getRelatedArticles(
  article: TravelGuideArticle,
  limit = 3,
): Promise<TravelGuideArticle[]> {
  const rows = await prisma.travelGuideArticle.findMany({
    where: {
      published: true,
      slug: { not: article.slug },
      OR: [
        { category: { name: article.category } },
        article.destinationSlug ? { destination: { slug: article.destinationSlug } } : {},
      ],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    include,
  });
  return Promise.all(rows.map(hydrate));
}

export async function getArticleByIdAny(id: string): Promise<TravelGuideArticle | undefined> {
  const row = await prisma.travelGuideArticle.findUnique({ where: { id }, include });
  return row ? hydrate(row) : undefined;
}
