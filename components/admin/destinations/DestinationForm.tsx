"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ChipListEditor } from "@/components/admin/ChipListEditor";
import { FaqListEditor, type FaqPair } from "@/components/admin/FaqListEditor";
import { createDestination, updateDestination } from "@/lib/actions/destinations";
import type { DestinationInput } from "@/lib/validations/destination";
import type { AdminDestinationRecord } from "@/lib/data/admin-destinations";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";
const errorClasses = "mt-1 text-xs text-danger";

const regions = ["NORTH", "WEST", "SOUTH", "EAST", "NORTHEAST"] as const;
const regionLabels: Record<(typeof regions)[number], string> = {
  NORTH: "North India",
  WEST: "West India",
  SOUTH: "South India",
  EAST: "East India",
  NORTHEAST: "Northeast India",
};

function slugifyClient(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type FormState = {
  name: string;
  slug: string;
  state: string;
  region: (typeof regions)[number];
  summary: string;
  description: string;
  bestSeason: string;
  thingsToDo: string[];
  experiences: string[];
  faqs: FaqPair[];
  seoTitle: string;
  seoDescription: string;
};

export function DestinationForm({ initial }: { initial?: AdminDestinationRecord }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    state: initial?.state ?? "",
    region: (initial?.region as FormState["region"]) ?? "NORTH",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    bestSeason: initial?.bestSeason ?? "",
    thingsToDo: initial?.thingsToDo ?? [],
    experiences: initial?.experiences ?? [],
    faqs: initial?.faqs ?? [],
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
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

    const input: DestinationInput = {
      name: form.name,
      slug: form.slug || slugifyClient(form.name),
      state: form.state,
      region: form.region,
      summary: form.summary,
      description: form.description,
      bestSeason: form.bestSeason,
      thingsToDo: form.thingsToDo,
      experiences: form.experiences,
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
    };

    if (isEdit) {
      const result = await updateDestination(initial!.id, input);
      setSaving(false);
      if (!result.success) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      router.push("/admin/destinations");
      router.refresh();
    } else {
      const result = await createDestination(input);
      setSaving(false);
      if (!result.success) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      router.push(`/admin/destinations/${result.data.id}/edit`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClasses}>Destination Name</label>
          <input
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugTouched) set("slug", slugifyClient(e.target.value));
            }}
            className={inputClasses}
            required
          />
          {errors.name ? <p className={errorClasses}>{errors.name[0]}</p> : null}
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
          <label className={labelClasses}>State</label>
          <input value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClasses} placeholder="e.g. Rajasthan" required />
          {errors.state ? <p className={errorClasses}>{errors.state[0]}</p> : null}
        </div>

        <div>
          <label className={labelClasses}>Region</label>
          <select value={form.region} onChange={(e) => set("region", e.target.value as FormState["region"])} className={inputClasses}>
            {regions.map((r) => (
              <option key={r} value={r}>{regionLabels[r]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Best Season</label>
          <input value={form.bestSeason} onChange={(e) => set("bestSeason", e.target.value)} className={inputClasses} placeholder="e.g. October to March" required />
          {errors.bestSeason ? <p className={errorClasses}>{errors.bestSeason[0]}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Summary (shown on destination cards)</label>
          <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={2} className={inputClasses} required />
          {errors.summary ? <p className={errorClasses}>{errors.summary[0]}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Full Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className={inputClasses} required />
          {errors.description ? <p className={errorClasses}>{errors.description[0]}</p> : null}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <ChipListEditor label="Things to Do" items={form.thingsToDo} onChange={(v) => set("thingsToDo", v)} />
        <ChipListEditor label="Experiences" items={form.experiences} onChange={(v) => set("experiences", v)} />
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
          {isEdit ? "Save Changes" : "Create Destination"}
        </button>
        {!isEdit ? (
          <p className="text-xs text-charcoal/45">You&apos;ll add a hero image after creating the destination.</p>
        ) : null}
      </div>
    </form>
  );
}
