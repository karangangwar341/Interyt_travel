import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllArticlesForAdmin, getCategoryOptions } from "@/lib/data/admin-blog";
import { ArticlesTable } from "@/components/admin/blog/ArticlesTable";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: { search?: string; categoryId?: string; published?: "ALL" | "PUBLISHED" | "DRAFT" };
}) {
  const [articles, categories] = await Promise.all([
    getAllArticlesForAdmin({
      search: searchParams.search,
      categoryId: searchParams.categoryId,
      published: searchParams.published,
    }),
    getCategoryOptions(),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Travel Guide / Blog</h1>
          <p className="text-sm text-charcoal/55">Manage every article shown in the Travel Guide.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      <ArticlesTable
        articles={articles}
        categories={categories}
        initialSearch={searchParams.search ?? ""}
        initialCategoryId={searchParams.categoryId ?? "ALL"}
        initialPublished={searchParams.published ?? "ALL"}
      />
    </div>
  );
}
