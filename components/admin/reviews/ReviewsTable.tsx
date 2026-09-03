"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { deleteReview } from "@/lib/actions/reviews";
import type { AdminReviewListItem } from "@/lib/data/admin-reviews";

export function ReviewsTable({ reviews }: { reviews: AdminReviewListItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete the review from "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    await deleteReview(id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-ivory">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-widest2 text-charcoal/45">
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Trip</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b border-charcoal/5 last:border-0">
              <td className="px-4 py-3 font-medium text-charcoal">
                {r.customerName}
                <div className="text-xs font-normal text-charcoal/45">{r.location}</div>
              </td>
              <td className="px-4 py-3 text-charcoal/70">{r.tripTitle ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? "fill-gold text-gold" : "text-charcoal/15"} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.published ? "bg-forest/15 text-forest-dark" : "bg-charcoal/10 text-charcoal/70"}`}>
                    {r.published ? "Published" : "Hidden"}
                  </span>
                  {r.featured ? <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-medium text-charcoal">Featured</span> : null}
                  {r.isSample ? <span className="rounded-full bg-terracotta/15 px-2.5 py-1 text-xs font-medium text-terracotta-dark">Sample</span> : null}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  {busyId === r.id ? (
                    <Loader2 className="animate-spin text-charcoal/40" size={16} />
                  ) : (
                    <>
                      <Link href={`/admin/reviews/${r.id}/edit`} title="Edit" className="p-1.5 text-charcoal/50 hover:text-forest">
                        <Pencil size={16} />
                      </Link>
                      <button title="Delete" onClick={() => handleDelete(r.id, r.customerName)} className="p-1.5 text-charcoal/50 hover:text-danger">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {reviews.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-charcoal/45">No reviews found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
