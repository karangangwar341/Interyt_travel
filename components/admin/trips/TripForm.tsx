"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ChipListEditor } from "@/components/admin/ChipListEditor";
import { FaqListEditor, type FaqPair } from "@/components/admin/FaqListEditor";
import { createTrip, updateTrip } from "@/lib/actions/trips";
import type { TripInput } from "@/lib/validations/trip";
import type { AdminTripRecord } from "@/lib/data/admin-trips";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";
const errorClasses = "mt-1 text-xs text-danger";

const tripTypes = ["ADVENTURE", "LEISURE", "CULTURAL", "ROAD_TRIP", "WEEKEND"] as const;
const difficulties = ["EASY", "MODERATE", "CHALLENGING"] as const;

type FormState = {
  title: string;
  slug: string;
  destinationId: string;
  states: string[];
  durationDays: string;
  durationNights: string;
  price: string;
  currency: string;
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  hotels: string[];
  transport: string;
  meals: string;
  bestSeason: string;
  difficulty: (typeof difficulties)[number];
  tripType: (typeof tripTypes)[number];
  tags: string[];
  rating: string;
  seoTitle: string;
  seoDescription: string;
  faqs: FaqPair[];
};

function slugifyClient(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function TripForm({
  destinations,
  initial,
}: {
  destinations: { id: string; name: string }[];
  initial?: AdminTripRecord;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    destinationId: initial?.destinationId ?? destinations[0]?.id ?? "",
    states: initial?.states ?? [],
    durationDays: initial ? String(initial.durationDays) : "",
    durationNights: initial ? String(initial.durationNights) : "",
    price: initial ? String(initial.price) : "",
    currency: initial?.currency ?? "INR",
    overview: initial?.overview ?? "",
    highlights: initial?.highlights ?? [],
    inclusions: initial?.inclusions ?? [],
    exclusions: initial?.exclusions ?? [],
    hotels: initial?.hotels ?? [],
    transport: initial?.transport ?? "",
    meals: initial?.meals ?? "",
    bestSeason: initial?.bestSeason ?? "",
    difficulty: (initial?.difficulty as FormState["difficulty"]) ?? "EASY",
    tripType: (initial?.tripType as FormState["tripType"]) ?? "LEISURE",
    tags: initial?.tags ?? [],
    rating: initial?.rating != null ? String(initial.rating) : "",
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    faqs: initial?.faqs ?? [],
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
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

    const input: TripInput = {
      title: form.title,
      slug: form.slug || slugifyClient(form.title),
      destinationId: form.destinationId,
      states: form.states,
      durationDays: Number(form.durationDays),
      durationNights: Number(form.durationNights),
      price: Number(form.price),
      currency: form.currency,
      overview: form.overview,
      highlights: form.highlights,
      inclusions: form.inclusions,
      exclusions: form.exclusions,
      hotels: form.hotels,
      transport: form.transport || undefined,
      meals: form.meals || undefined,
      bestSeason: form.bestSeason || undefined,
      difficulty: form.difficulty,
      tripType: form.tripType,
      tags: form.tags,
      rating: form.rating ? Number(form.rating) : undefined,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
    };

    if (isEdit) {
      const result = await updateTrip(initial!.id, input);
      setSaving(false);
      if (!result.success) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      router.push("/admin/trips");
      router.refresh();
    } else {
      const result = await createTrip(input);
      setSaving(false);
      if (!result.success) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      router.push(`/admin/trips/${result.data.id}/edit`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClasses}>Trip Name</label>
          <input
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugifyClient(e.target.value));
            }}
            className={inputClasses}
            required
          />
          {errors.title ? <p className={errorClasses}>{errors.title[0]}</p> : null}
        </div>

        <div>
          <label className={labelClasses}>Slug</label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            className={inputClasses}
            required
          />
          {errors.slug ? <p className={errorClasses}>{errors.slug[0]}</p> : null}
        </div>

        <div>
          <label className={labelClasses}>Destination</label>
          <select value={form.destinationId} onChange={(e) => set("destinationId", e.target.value)} className={inputClasses}>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <ChipListEditor label="States Covered" items={form.states} onChange={(v) => set("states", v)} placeholder="e.g. Rajasthan" />
        </div>

        <div>
          <label className={labelClasses}>Duration (Days)</label>
          <input type="number" min={1} value={form.durationDays} onChange={(e) => set("durationDays", e.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label className={labelClasses}>Duration (Nights)</label>
          <input type="number" min={0} value={form.durationNights} onChange={(e) => set("durationNights", e.target.value)} className={inputClasses} required />
        </div>

        <div>
          <label className={labelClasses}>Starting Price (₹)</label>
          <input type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label className={labelClasses}>Rating (optional, 0–5)</label>
          <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", e.target.value)} className={inputClasses} />
        </div>

        <div>
          <label className={labelClasses}>Trip Type</label>
          <select value={form.tripType} onChange={(e) => set("tripType", e.target.value as FormState["tripType"])} className={inputClasses}>
            {tripTypes.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Difficulty</label>
          <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value as FormState["difficulty"])} className={inputClasses}>
            {difficulties.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Best Season</label>
          <input value={form.bestSeason} onChange={(e) => set("bestSeason", e.target.value)} className={inputClasses} placeholder="e.g. October to March" />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Overview</label>
          <textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} rows={4} className={inputClasses} required />
          {errors.overview ? <p className={errorClasses}>{errors.overview[0]}</p> : null}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <ChipListEditor label="Highlights" items={form.highlights} onChange={(v) => set("highlights", v)} />
        <ChipListEditor label="Tags" items={form.tags} onChange={(v) => set("tags", v)} placeholder="e.g. honeymoon" />
        <ChipListEditor label="Inclusions" items={form.inclusions} onChange={(v) => set("inclusions", v)} />
        <ChipListEditor label="Exclusions" items={form.exclusions} onChange={(v) => set("exclusions", v)} />
        <ChipListEditor label="Hotels" items={form.hotels} onChange={(v) => set("hotels", v)} />
        <div>
          <label className={labelClasses}>Transport</label>
          <input value={form.transport} onChange={(e) => set("transport", e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Meals</label>
          <input value={form.meals} onChange={(e) => set("meals", e.target.value)} className={inputClasses} />
        </div>
      </section>

      <section>
        <FaqListEditor items={form.faqs} onChange={(v) => set("faqs", v)} />
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>SEO Title</label>
          <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>SEO Description</label>
          <input value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={inputClasses} />
        </div>
      </section>

      {formError ? <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{formError}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-6 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : null}
          {isEdit ? "Save Changes" : "Create Trip"}
        </button>
        {!isEdit ? (
          <p className="text-xs text-charcoal/45">You&apos;ll add images and publish after creating the trip.</p>
        ) : null}
      </div>
    </form>
  );
}
