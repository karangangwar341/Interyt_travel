"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { deleteEnquiry } from "@/lib/actions/enquiries";
import type { AdminEnquiryListItem } from "@/lib/data/admin-enquiries";

const statusStyles: Record<string, string> = {
  NEW: "bg-terracotta/15 text-terracotta-dark",
  CONTACTED: "bg-gold/20 text-charcoal",
  FOLLOW_UP: "bg-gold/20 text-charcoal",
  QUOTED: "bg-forest/10 text-forest-dark",
  CONFIRMED: "bg-forest/15 text-forest-dark",
  CLOSED: "bg-charcoal/10 text-charcoal/60",
};

const sourceLabels: Record<string, string> = {
  BOOKING_FORM: "Booking Form",
  CUSTOM_TRIP: "Custom Trip",
  CONTACT_FORM: "Contact Form",
  WHATSAPP: "WhatsApp",
  PHONE: "Phone",
};

export function EnquiriesTable({
  enquiries,
  initialSearch,
  initialSource,
  initialStatus,
}: {
  enquiries: AdminEnquiryListItem[];
  initialSearch: string;
  initialSource: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [source, setSource] = useState(initialSource);
  const [status, setStatus] = useState(initialStatus);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function applyFilters(next: { search?: string; source?: string; status?: string }) {
    const params = new URLSearchParams();
    const s = next.search ?? search;
    const src = next.source ?? source;
    const st = next.status ?? status;
    if (s) params.set("search", s);
    if (src !== "ALL") params.set("source", src);
    if (st !== "ALL") params.set("status", st);
    startTransition(() => router.push(`/admin/enquiries?${params.toString()}`));
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete the enquiry from "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    const res = await deleteEnquiry(id);
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
            placeholder="Search name, phone, email…"
            className="w-full rounded-full border-2 border-charcoal/15 bg-ivory py-2 pl-9 pr-4 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            applyFilters({ source: e.target.value });
          }}
          className="rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal"
        >
          <option value="ALL">All sources</option>
          {Object.entries(sourceLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
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
          {Object.keys(statusStyles).map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-ivory">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-widest2 text-charcoal/45">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">
                  {e.customerName}
                  <div className="text-xs font-normal text-charcoal/45">{e.phone}</div>
                </td>
                <td className="px-4 py-3 text-charcoal/70">
                  {e.tripTitle ?? e.destinationInterest ?? "—"}
                  {e.departureLabel ? <div className="text-xs text-charcoal/45">{e.departureLabel}</div> : null}
                </td>
                <td className="px-4 py-3 text-charcoal/70">{sourceLabels[e.source] ?? e.source}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[e.status] ?? ""}`}>
                    {e.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal/60">{e.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {busyId === e.id ? (
                      <Loader2 className="animate-spin text-charcoal/40" size={16} />
                    ) : (
                      <>
                        <Link href={`/admin/enquiries/${e.id}`} title="View" className="p-1.5 text-charcoal/50 hover:text-forest">
                          <ExternalLink size={16} />
                        </Link>
                        <button title="Delete" onClick={() => handleDelete(e.id, e.customerName)} className="p-1.5 text-charcoal/50 hover:text-danger">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal/45">No enquiries found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
