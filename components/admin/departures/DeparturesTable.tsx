"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, Star, Clock } from "lucide-react";
import { deleteUpcomingTrip, toggleDepartureFeatured } from "@/lib/actions/upcoming-trips";
import type { AdminUpcomingTripListItem } from "@/lib/data/admin-upcoming-trips";

const statusStyles: Record<string, string> = {
  SEATS_AVAILABLE: "bg-forest/15 text-forest-dark",
  ALMOST_FULL: "bg-gold/20 text-charcoal",
  SOLD_OUT: "bg-charcoal/10 text-charcoal/70",
  COMPLETED: "bg-charcoal/10 text-charcoal/50",
  CANCELLED: "bg-danger-light text-danger",
};

export function DeparturesTable({
  departures,
  trips,
  initialTripId,
  initialStatus,
}: {
  departures: AdminUpcomingTripListItem[];
  trips: { id: string; title: string }[];
  initialTripId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [tripId, setTripId] = useState(initialTripId);
  const [status, setStatus] = useState(initialStatus);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function applyFilters(next: { tripId?: string; status?: string }) {
    const params = new URLSearchParams();
    const t = next.tripId ?? tripId;
    const s = next.status ?? status;
    if (t !== "ALL") params.set("tripId", t);
    if (s !== "ALL") params.set("status", s);
    startTransition(() => router.push(`/admin/departures?${params.toString()}`));
  }

  async function handleDelete(id: string, label: string) {
    if (!window.confirm(`Delete the departure "${label}"? This cannot be undone.`)) return;
    setBusyId(id);
    const res = await deleteUpcomingTrip(id);
    setBusyId(null);
    if (!res.success) {
      alert(res.message);
      return;
    }
    router.refresh();
  }

  async function handleToggleFeatured(id: string, featured: boolean) {
    setBusyId(id);
    await toggleDepartureFeatured(id, !featured);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={tripId}
          onChange={(e) => {
            setTripId(e.target.value);
            applyFilters({ tripId: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All trips</option>
          {trips.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            applyFilters({ status: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All statuses</option>
          <option value="SEATS_AVAILABLE">Seats Available</option>
          <option value="ALMOST_FULL">Almost Full</option>
          <option value="SOLD_OUT">Sold Out</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-ivory">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-widest2 text-charcoal/45">
              <th className="px-4 py-3">Trip</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((d) => (
              <tr key={d.id} className={`border-b border-charcoal/5 last:border-0 ${d.isPast ? "opacity-50" : ""}`}>
                <td className="px-4 py-3 font-medium text-charcoal">
                  {d.tripTitle}
                  {d.isPast ? <span className="ml-2 inline-flex items-center gap-1 text-xs text-charcoal/45"><Clock size={11} /> Past</span> : null}
                </td>
                <td className="px-4 py-3 text-charcoal/70">
                  {d.departureDate} → {d.returnDate}
                  <div className="text-xs text-charcoal/45">from {d.departureLocation}</div>
                </td>
                <td className="px-4 py-3 text-charcoal/70">{d.availableSeats}/{d.totalSeats}</td>
                <td className="px-4 py-3 text-charcoal/70">₹{d.price.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[d.status] ?? ""}`}>
                    {d.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {busyId === d.id ? (
                      <Loader2 className="animate-spin text-charcoal/40" size={16} />
                    ) : (
                      <>
                        <button
                          title={d.featured ? "Unfeature" : "Feature on homepage"}
                          onClick={() => handleToggleFeatured(d.id, d.featured)}
                          className={d.featured ? "p-1.5 text-gold" : "p-1.5 text-charcoal/40 hover:text-gold"}
                        >
                          <Star size={16} fill={d.featured ? "currentColor" : "none"} />
                        </button>
                        <Link href={`/admin/departures/${d.id}/edit`} title="Edit" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <Pencil size={16} />
                        </Link>
                        <button title="Delete" onClick={() => handleDelete(d.id, `${d.tripTitle} — ${d.departureDate}`)} className="p-1.5 text-charcoal/50 hover:text-danger">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {departures.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal/45">No departures found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
