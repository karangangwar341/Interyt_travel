"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { createReview, updateReview } from "@/lib/actions/reviews";
import type { ReviewInput } from "@/lib/validations/review";
import type { AdminReviewRecord } from "@/lib/data/admin-reviews";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";
const errorClasses = "mt-1 text-xs text-danger";

type FormState = {
  customerName: string;
  location: string;
  rating: number;
  reviewText: string;
  travelMonth: string;
  tripId: string;
  featured: boolean;
  published: boolean;
};

export function ReviewForm({
  trips,
  initial,
}: {
  trips: { id: string; title: string }[];
  initial?: AdminReviewRecord;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<FormState>({
    customerName: initial?.customerName ?? "",
    location: initial?.location ?? "",
    rating: initial?.rating ?? 5,
    reviewText: initial?.reviewText ?? "",
    travelMonth: initial?.travelMonth ?? "",
    tripId: initial?.tripId ?? "",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
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

    const input: ReviewInput = {
      customerName: form.customerName,
      location: form.location || undefined,
      rating: form.rating,
      reviewText: form.reviewText,
      travelMonth: form.travelMonth || undefined,
      tripId: form.tripId || undefined,
      featured: form.featured,
      published: form.published,
    };

    const result = isEdit ? await updateReview(initial!.id, input) : await createReview(input);
    setSaving(false);

    if (!result.success) {
      setFormError(result.message);
      if (result.fieldErrors) setErrors(result.fieldErrors);
      return;
    }

    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Customer Name</label>
          <input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputClasses} required />
          {errors.customerName ? <p className={errorClasses}>{errors.customerName[0]}</p> : null}
        </div>
        <div>
          <label className={labelClasses}>Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClasses} placeholder="e.g. Mumbai" />
        </div>
        <div>
          <label className={labelClasses}>Trip (optional)</label>
          <select value={form.tripId} onChange={(e) => set("tripId", e.target.value)} className={inputClasses}>
            <option value="">Not linked to a trip</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Travel Month</label>
          <input value={form.travelMonth} onChange={(e) => set("travelMonth", e.target.value)} className={inputClasses} placeholder="e.g. March 2026" />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => set("rating", n)} className="p-0.5">
              <Star size={22} className={n <= form.rating ? "fill-gold text-gold" : "text-charcoal/20"} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Review Text</label>
        <textarea value={form.reviewText} onChange={(e) => set("reviewText", e.target.value)} rows={4} className={inputClasses} required />
        {errors.reviewText ? <p className={errorClasses}>{errors.reviewText[0]}</p> : null}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 rounded border-charcoal/30" />
          Published (visible on the site)
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded border-charcoal/30" />
          Feature on the homepage
        </label>
      </div>

      {formError ? <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{formError}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-6 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : null}
        {isEdit ? "Save Changes" : "Add Review"}
      </button>
    </form>
  );
}
