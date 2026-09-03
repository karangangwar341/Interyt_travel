"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setEnquiryStatus, createBookingFromEnquiry } from "@/lib/actions/enquiries";
import type { AdminEnquiryDetail } from "@/lib/data/admin-enquiries";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";

const statuses = ["NEW", "CONTACTED", "FOLLOW_UP", "QUOTED", "CONFIRMED", "CLOSED"] as const;

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className={labelClasses}>{label}</p>
      <p className="text-sm text-charcoal">{value}</p>
    </div>
  );
}

export function EnquiryDetail({ enquiry }: { enquiry: AdminEnquiryDetail }) {
  const router = useRouter();
  const [status, setStatus] = useState(enquiry.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [travelers, setTravelers] = useState(String(enquiry.adults + enquiry.children || 1));
  const [amount, setAmount] = useState("");
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingError, setBookingError] = useState("");

  async function handleStatusChange(next: string) {
    setStatus(next);
    setSavingStatus(true);
    await setEnquiryStatus(enquiry.id, next as (typeof statuses)[number]);
    setSavingStatus(false);
    router.refresh();
  }

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingSaving(true);
    setBookingError("");
    const result = await createBookingFromEnquiry(enquiry.id, { travelers: Number(travelers), amount: Number(amount) });
    setBookingSaving(false);
    if (!result.success) {
      setBookingError(result.message);
      return;
    }
    router.refresh();
  }

  const canBook = Boolean(enquiry.upcomingTripId) && enquiry.bookings.length === 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer Name" value={enquiry.customerName} />
          <Field label="Phone" value={enquiry.phone} />
          <Field label="Email" value={enquiry.email} />
          <Field label="Received" value={enquiry.createdAt.slice(0, 10)} />
          <Field label="Trip" value={enquiry.tripTitle} />
          <Field label="Departure" value={enquiry.upcomingTripLabel} />
          <Field label="Destination Interest" value={enquiry.destinationInterest} />
          <Field label="Duration Interest" value={enquiry.durationInterest} />
          <Field label="Travel Style" value={enquiry.travelStyle} />
          <Field label="Travel Date" value={enquiry.travelDate} />
          <Field label="Adults / Children" value={`${enquiry.adults} adults, ${enquiry.children} children`} />
          <Field label="Rooms" value={enquiry.rooms} />
          <Field label="Budget" value={enquiry.budget} />
        </div>
        {enquiry.interests.length > 0 ? (
          <div className="mt-4">
            <p className={labelClasses}>Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {enquiry.interests.map((i) => (
                <span key={i} className="rounded-full bg-terracotta/15 px-3 py-1 text-xs text-terracotta-dark">{i}</span>
              ))}
            </div>
          </div>
        ) : null}
        {enquiry.message ? (
          <div className="mt-4">
            <p className={labelClasses}>Message</p>
            <p className="whitespace-pre-wrap text-sm text-charcoal/80">{enquiry.message}</p>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <label className={labelClasses}>Status</label>
        <div className="flex items-center gap-3">
          <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className={inputClasses}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
          {savingStatus ? <Loader2 className="animate-spin text-charcoal/40" size={16} /> : null}
        </div>
      </div>

      {enquiry.bookings.length > 0 ? (
        <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
          <p className={labelClasses}>Bookings from this enquiry</p>
          <ul className="space-y-2">
            {enquiry.bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-xl border border-charcoal/10 bg-warm-white px-3 py-2 text-sm">
                <span>{b.travelers} traveler{b.travelers === 1 ? "" : "s"} · ₹{b.amount.toLocaleString("en-IN")}</span>
                <span className="text-xs font-medium text-charcoal/60">{b.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : canBook ? (
        <form onSubmit={handleCreateBooking} className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
          <p className={labelClasses}>Convert to Booking</p>
          <p className="mb-3 text-xs text-charcoal/50">
            {enquiry.upcomingTripAvailableSeats} seat(s) available on this departure.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Travelers</label>
              <input type="number" min={1} value={travelers} onChange={(e) => setTravelers(e.target.value)} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>Amount (₹)</label>
              <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClasses} required />
            </div>
          </div>
          {bookingError ? <p className="mt-2 text-xs text-danger">{bookingError}</p> : null}
          <button
            type="submit"
            disabled={bookingSaving}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
          >
            {bookingSaving ? <Loader2 className="animate-spin" size={15} /> : null}
            Create Booking
          </button>
        </form>
      ) : null}
    </div>
  );
}
