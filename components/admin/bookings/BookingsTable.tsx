"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { setBookingStatus, deleteBooking } from "@/lib/actions/bookings";
import type { AdminBookingListItem } from "@/lib/data/admin-bookings";

const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

const statusStyles: Record<string, string> = {
  PENDING: "bg-gold/20 text-charcoal",
  CONFIRMED: "bg-forest/15 text-forest-dark",
  CANCELLED: "bg-danger-light text-danger",
  COMPLETED: "bg-charcoal/10 text-charcoal/60",
};

export function BookingsTable({ bookings, initialStatus }: { bookings: AdminBookingListItem[]; initialStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function applyFilter(next: string) {
    setStatus(next);
    const params = new URLSearchParams();
    if (next !== "ALL") params.set("status", next);
    startTransition(() => router.push(`/admin/bookings?${params.toString()}`));
  }

  async function handleStatusChange(id: string, next: string) {
    setBusyId(id);
    const res = await setBookingStatus(id, next as (typeof statuses)[number]);
    setBusyId(null);
    if (!res.success) {
      alert(res.message);
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete the booking for "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    await deleteBooking(id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => applyFilter(e.target.value)}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-ivory">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-widest2 text-charcoal/45">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Trip / Departure</th>
              <th className="px-4 py-3">Travelers</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">
                  {b.customerName}
                  <div className="text-xs font-normal text-charcoal/45">{b.phone}</div>
                </td>
                <td className="px-4 py-3 text-charcoal/70">
                  {b.tripTitle}
                  <div className="text-xs text-charcoal/45">{b.departureDate} from {b.departureLocation}</div>
                </td>
                <td className="px-4 py-3 text-charcoal/70">{b.travelers}</td>
                <td className="px-4 py-3 text-charcoal/70">₹{b.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  {busyId === b.id ? (
                    <Loader2 className="animate-spin text-charcoal/40" size={16} />
                  ) : (
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${statusStyles[b.status] ?? ""}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button title="Delete" onClick={() => handleDelete(b.id, b.customerName)} className="p-1.5 text-charcoal/50 hover:text-danger">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal/45">No bookings found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
