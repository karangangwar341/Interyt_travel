"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createUpcomingTrip, updateUpcomingTrip } from "@/lib/actions/upcoming-trips";
import type { UpcomingTripInput } from "@/lib/validations/upcoming-trip";
import type { AdminUpcomingTripRecord } from "@/lib/data/admin-upcoming-trips";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";
const errorClasses = "mt-1 text-xs text-danger";

const statuses = ["SEATS_AVAILABLE", "ALMOST_FULL", "SOLD_OUT", "COMPLETED", "CANCELLED"] as const;

type FormState = {
  tripId: string;
  departureDate: string;
  returnDate: string;
  departureLocation: string;
  totalSeats: string;
  availableSeats: string;
  price: string;
  bookingDeadline: string;
  status: (typeof statuses)[number];
  featured: boolean;
};

export function UpcomingTripForm({
  trips,
  initial,
}: {
  trips: { id: string; title: string; price: number }[];
  initial?: AdminUpcomingTripRecord;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<FormState>({
    tripId: initial?.tripId ?? trips[0]?.id ?? "",
    departureDate: initial?.departureDate ?? "",
    returnDate: initial?.returnDate ?? "",
    departureLocation: initial?.departureLocation ?? "",
    totalSeats: initial ? String(initial.totalSeats) : "20",
    availableSeats: initial ? String(initial.availableSeats) : "20",
    price: initial ? String(initial.price) : String(trips[0]?.price ?? ""),
    bookingDeadline: initial?.bookingDeadline ?? "",
    status: (initial?.status as FormState["status"]) ?? "SEATS_AVAILABLE",
    featured: initial?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setErrors({});

    const input: UpcomingTripInput = {
      tripId: form.tripId,
      departureDate: form.departureDate,
      returnDate: form.returnDate,
      departureLocation: form.departureLocation,
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.availableSeats),
      price: Number(form.price),
      bookingDeadline: form.bookingDeadline,
      status: form.status,
      featured: form.featured,
    };

    const result = isEdit ? await updateUpcomingTrip(initial!.id, input) : await createUpcomingTrip(input);
    setSaving(false);

    if (!result.success) {
      setFormError(result.message);
      if (result.fieldErrors) setErrors(result.fieldErrors);
      return;
    }

    router.push("/admin/departures");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClasses}>Trip</label>
        <select
          value={form.tripId}
          onChange={(e) => {
            const trip = trips.find((t) => t.id === e.target.value);
            set("tripId", e.target.value);
            if (!isEdit && trip) set("price", String(trip.price));
          }}
          className={inputClasses}
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        {errors.tripId ? <p className={errorClasses}>{errors.tripId[0]}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Departure Date</label>
          <input type="date" value={form.departureDate} onChange={(e) => set("departureDate", e.target.value)} className={inputClasses} required />
          {errors.departureDate ? <p className={errorClasses}>{errors.departureDate[0]}</p> : null}
        </div>
        <div>
          <label className={labelClasses}>Return Date</label>
          <input type="date" value={form.returnDate} onChange={(e) => set("returnDate", e.target.value)} className={inputClasses} required />
          {errors.returnDate ? <p className={errorClasses}>{errors.returnDate[0]}</p> : null}
        </div>
        <div>
          <label className={labelClasses}>Booking Deadline</label>
          <input type="date" value={form.bookingDeadline} onChange={(e) => set("bookingDeadline", e.target.value)} className={inputClasses} required />
          {errors.bookingDeadline ? <p className={errorClasses}>{errors.bookingDeadline[0]}</p> : null}
        </div>
        <div>
          <label className={labelClasses}>Departure Location</label>
          <input value={form.departureLocation} onChange={(e) => set("departureLocation", e.target.value)} className={inputClasses} placeholder="e.g. Delhi" required />
          {errors.departureLocation ? <p className={errorClasses}>{errors.departureLocation[0]}</p> : null}
        </div>
        <div>
          <label className={labelClasses}>Total Seats</label>
          <input type="number" min={1} value={form.totalSeats} onChange={(e) => set("totalSeats", e.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label className={labelClasses}>Available Seats</label>
          <input type="number" min={0} value={form.availableSeats} onChange={(e) => set("availableSeats", e.target.value)} className={inputClasses} required />
          {errors.availableSeats ? <p className={errorClasses}>{errors.availableSeats[0]}</p> : null}
        </div>
        <div>
          <label className={labelClasses}>Price (₹)</label>
          <input type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label className={labelClasses}>Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value as FormState["status"])} className={inputClasses}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded border-charcoal/30" />
        Feature this departure on the homepage
      </label>

      {formError ? <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{formError}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-6 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : null}
        {isEdit ? "Save Changes" : "Add Departure"}
      </button>
    </form>
  );
}
