import { getCategoryOptions } from "@/lib/data/admin-blog";
import { getDestinationOptions } from "@/lib/data/admin-trips";
import { getTripOptions } from "@/lib/data/admin-upcoming-trips";
import { ArticleForm } from "@/components/admin/blog/ArticleForm";

export default async function NewArticlePage() {
  const [categories, destinations, trips] = await Promise.all([
    getCategoryOptions(),
    getDestinationOptions(),
    getTripOptions(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">New Article</h1>
      <p className="mb-6 text-sm text-charcoal/55">Fill in the content. You can add a hero image once the article is created.</p>
      <ArticleForm categories={categories} destinations={destinations} trips={trips} />
    </div>
  );
}
