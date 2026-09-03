import { notFound } from "next/navigation";
import { getArticleByIdAny, getRelatedArticles } from "@/lib/data/travel-guide";
import { getDestinationBySlug } from "@/lib/data/destinations";
import { ArticleDetailView } from "@/components/blog/ArticleDetailView";

export default async function AdminArticlePreviewPage({ params }: { params: { id: string } }) {
  const article = await getArticleByIdAny(params.id);
  if (!article) notFound();

  const [destination, related] = await Promise.all([
    article.destinationSlug ? getDestinationBySlug(article.destinationSlug) : Promise.resolve(undefined),
    getRelatedArticles(article),
  ]);

  return <ArticleDetailView article={article} destination={destination} related={related} previewMode />;
}
