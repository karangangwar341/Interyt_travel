import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticles, getArticleBySlug, getRelatedArticles } from "@/lib/data/travel-guide";
import { getDestinationBySlug } from "@/lib/data/destinations";
import { ArticleDetailView } from "@/components/blog/ArticleDetailView";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const destination = article.destinationSlug ? await getDestinationBySlug(article.destinationSlug) : undefined;
  const related = await getRelatedArticles(article);

  return <ArticleDetailView article={article} destination={destination} related={related} />;
}
