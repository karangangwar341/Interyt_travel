"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Eye, Pencil, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { setDestinationPublished, deleteDestination } from "@/lib/actions/destinations";
import type { AdminDestinationListItem } from "@/lib/data/admin-destinations";

const regionLabels: Record<string, string> = {
  NORTH: "North",
  WEST: "West",
  SOUTH: "South",
  EAST: "East",
  NORTHEAST: "Northeast",
};

export function DestinationsTable({
  destinations,
  initialSearch,
  initialRegion,
  initialPublished,
}: {
  destinations: AdminDestinationListItem[];
  initialSearch: string;
  initialRegion: string;
  initialPublished: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [region, setRegion] = useState(initialRegion);
  const [published, setPublished] = useState(initialPublished);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function applyFilters(next: { search?: string; region?: string; published?: string }) {
    const params = new URLSearchParams();
    const s = next.search ?? search;
    const r = next.region ?? region;
    const p = next.published ?? published;
    if (s) params.set("search", s);
    if (r !== "ALL") params.set("region", r);
    if (p !== "ALL") params.set("published", p);
    startTransition(() => router.push(`/admin/destinations?${params.toString()}`));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setBusyId(id);
    await setDestinationPublished(id, !current);
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    const res = await deleteDestination(id);
    setBusyId(null);
    if (!res.success) {
      alert(res.message);
      return;
    }
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
            placeholder="Search destinations…"
            className="w-full rounded-full border-2 border-charcoal/15 bg-ivory py-2 pl-9 pr-4 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            applyFilters({ region: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All regions</option>
          {Object.entries(regionLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
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
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Trips</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{d.name}<div className="text-xs font-normal text-charcoal/45">{d.state}</div></td>
                <td className="px-4 py-3 text-charcoal/70">{regionLabels[d.region] ?? d.region}</td>
                <td className="px-4 py-3 text-charcoal/70">{d.tripCount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.published ? "bg-forest/15 text-forest-dark" : "bg-charcoal/10 text-charcoal/70"}`}>
                    {d.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {busyId === d.id ? (
                      <Loader2 className="animate-spin text-charcoal/40" size={16} />
                    ) : (
                      <>
                        <Link href={`/admin/destinations/${d.id}/preview`} title="Preview" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/destinations/${d.id}/edit`} title="Edit" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Pencil size={16} />
                        </Link>
                        {d.published ? (
                          <button title="Unpublish" onClick={() => handleTogglePublish(d.id, d.published)} className="p-1.5 text-charcoal/50 hover:text-terracotta">
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button title="Publish" onClick={() => handleTogglePublish(d.id, d.published)} className="p-1.5 text-charcoal/50 hover:text-forest">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button title="Delete" onClick={() => handleDelete(d.id, d.name)} className="p-1.5 text-charcoal/50 hover:text-danger">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {destinations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-charcoal/45">No destinations found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
