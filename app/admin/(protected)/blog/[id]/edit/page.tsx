import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getArticleForEdit, getCategoryOptions } from "@/lib/data/admin-blog";
import { getDestinationOptions } from "@/lib/data/admin-trips";
import { getTripOptions } from "@/lib/data/admin-upcoming-trips";
import { ArticleForm } from "@/components/admin/blog/ArticleForm";
import { ArticleImageSection } from "@/components/admin/blog/ArticleImageSection";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, categories, destinations, trips] = await Promise.all([
    getArticleForEdit(params.id),
    getCategoryOptions(),
    getDestinationOptions(),
    getTripOptions(),
  ]);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Edit Article</h1>
          <p className="text-sm text-charcoal/55">{article.title}</p>
        </div>
        <Link
          href={`/admin/blog/${article.id}/preview`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
        >
          <Eye size={16} /> Preview
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Hero Image</h2>
        <ArticleImageSection articleId={article.id} initialHero={article.heroImage} />
      </div>

      <ArticleForm categories={categories} destinations={destinations} trips={trips} initial={article} />
    </div>
  );
}
