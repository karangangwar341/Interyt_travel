"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Eye, Pencil, Copy, Archive, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { setTripStatus, duplicateTrip, deleteTrip } from "@/lib/actions/trips";
import type { AdminTripListItem } from "@/lib/data/admin-trips";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-charcoal/10 text-charcoal/70",
  PUBLISHED: "bg-forest/15 text-forest-dark",
  ARCHIVED: "bg-terracotta/15 text-terracotta-dark",
};

export function TripsTable({
  trips,
  initialSearch,
  initialStatus,
  initialSort,
}: {
  trips: AdminTripListItem[];
  initialSearch: string;
  initialStatus: string;
  initialSort: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function applyFilters(next: { search?: string; status?: string; sort?: string }) {
    const params = new URLSearchParams();
    const s = next.search ?? search;
    const st = next.status ?? status;
    const so = next.sort ?? sort;
    if (s) params.set("search", s);
    if (st && st !== "ALL") params.set("status", st);
    if (so && so !== "updated") params.set("sort", so);
    startTransition(() => router.push(`/admin/trips?${params.toString()}`));
  }

  async function handleStatus(id: string, next: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    setBusyId(id);
    await setTripStatus(id, next);
    setBusyId(null);
    router.refresh();
  }

  async function handleDuplicate(id: string) {
    setBusyId(id);
    const res = await duplicateTrip(id);
    setBusyId(null);
    if (res.success) router.push(`/admin/trips/${res.data.id}/edit`);
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusyId(id);
    await deleteTrip(id);
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
            placeholder="Search trips…"
            className="w-full rounded-full border-2 border-charcoal/15 bg-ivory py-2 pl-9 pr-4 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            applyFilters({ status: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters({ sort: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="updated">Recently updated</option>
          <option value="title">Title A–Z</option>
          <option value="price">Price low–high</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-ivory">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-widest2 text-charcoal/45">
              <th className="px-4 py-3">Trip</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{trip.title}</td>
                <td className="px-4 py-3 text-charcoal/70">{trip.destinationName}</td>
                <td className="px-4 py-3 text-charcoal/70">₹{trip.price.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[trip.status] ?? ""}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {busyId === trip.id ? (
                      <Loader2 className="animate-spin text-charcoal/40" size={16} />
                    ) : (
                      <>
                        <Link href={`/admin/trips/${trip.id}/preview`} title="Preview" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/trips/${trip.id}/edit`} title="Edit" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Pencil size={16} />
                        </Link>
                        {trip.status === "PUBLISHED" ? (
                          <button title="Unpublish" onClick={() => handleStatus(trip.id, "DRAFT")} className="p-1.5 text-charcoal/50 hover:text-terracotta">
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button title="Publish" onClick={() => handleStatus(trip.id, "PUBLISHED")} className="p-1.5 text-charcoal/50 hover:text-forest">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button title="Archive" onClick={() => handleStatus(trip.id, "ARCHIVED")} className="p-1.5 text-charcoal/50 hover:text-terracotta">
                          <Archive size={16} />
                        </button>
                        <button title="Duplicate" onClick={() => handleDuplicate(trip.id)} className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Copy size={16} />
                        </button>
                        <button title="Delete" onClick={() => handleDelete(trip.id, trip.title)} className="p-1.5 text-charcoal/50 hover:text-danger">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {trips.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-charcoal/45">
                  {isPending ? "Loading…" : "No trips found."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
