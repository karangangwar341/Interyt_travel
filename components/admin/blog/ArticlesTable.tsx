"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Eye, Pencil, Copy, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { setArticlePublished, duplicateArticle, deleteArticle } from "@/lib/actions/blog";
import type { AdminArticleListItem } from "@/lib/data/admin-blog";

export function ArticlesTable({
  articles,
  categories,
  initialSearch,
  initialCategoryId,
  initialPublished,
}: {
  articles: AdminArticleListItem[];
  categories: { id: string; name: string }[];
  initialSearch: string;
  initialCategoryId: string;
  initialPublished: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [published, setPublished] = useState(initialPublished);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function applyFilters(next: { search?: string; categoryId?: string; published?: string }) {
    const params = new URLSearchParams();
    const s = next.search ?? search;
    const c = next.categoryId ?? categoryId;
    const p = next.published ?? published;
    if (s) params.set("search", s);
    if (c !== "ALL") params.set("categoryId", c);
    if (p !== "ALL") params.set("published", p);
    startTransition(() => router.push(`/admin/blog?${params.toString()}`));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setBusyId(id);
    await setArticlePublished(id, !current);
    setBusyId(null);
    router.refresh();
  }

  async function handleDuplicate(id: string) {
    setBusyId(id);
    const res = await duplicateArticle(id);
    setBusyId(null);
    if (res.success) router.push(`/admin/blog/${res.data.id}/edit`);
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusyId(id);
    await deleteArticle(id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters({ search })}
            onBlur={() => applyFilters({ search })}
            placeholder="Search articles…"
            className="w-full rounded-full border-2 border-charcoal/15 bg-ivory py-2 pl-9 pr-4 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            applyFilters({ categoryId: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={published}
          onChange={(e) => {
            setPublished(e.target.value);
            applyFilters({ published: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-ivory">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-widest2 text-charcoal/45">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{a.title}</td>
                <td className="px-4 py-3 text-charcoal/70">{a.categoryName}</td>
                <td className="px-4 py-3 text-charcoal/70">{a.destinationName ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.published ? "bg-forest/15 text-forest-dark" : "bg-charcoal/10 text-charcoal/70"}`}>
                    {a.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {busyId === a.id ? (
                      <Loader2 className="animate-spin text-charcoal/40" size={16} />
                    ) : (
                      <>
                        <Link href={`/admin/blog/${a.id}/preview`} title="Preview" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/blog/${a.id}/edit`} title="Edit" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Pencil size={16} />
                        </Link>
                        {a.published ? (
                          <button title="Unpublish" onClick={() => handleTogglePublish(a.id, a.published)} className="p-1.5 text-charcoal/50 hover:text-terracotta">
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button title="Publish" onClick={() => handleTogglePublish(a.id, a.published)} className="p-1.5 text-charcoal/50 hover:text-forest">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button title="Duplicate" onClick={() => handleDuplicate(a.id)} className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Copy size={16} />
                        </button>
                        <button title="Delete" onClick={() => handleDelete(a.id, a.title)} className="p-1.5 text-charcoal/50 hover:text-danger">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-charcoal/45">No articles found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
