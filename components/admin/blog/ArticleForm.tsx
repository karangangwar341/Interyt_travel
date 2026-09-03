"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SectionListEditor } from "@/components/admin/blog/SectionListEditor";
import { createArticle, updateArticle } from "@/lib/actions/blog";
import type { BlogInput } from "@/lib/validations/blog";
import type { AdminArticleRecord } from "@/lib/data/admin-blog";
import type { GuideSection } from "@/lib/data/types";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";
const errorClasses = "mt-1 text-xs text-danger";

function slugifyClient(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type FormState = {
  title: string;
  slug: string;
  categoryId: string;
  destinationId: string;
  excerpt: string;
  readTimeMinutes: string;
  sections: GuideSection[];
  relatedTripIds: string[];
  seoTitle: string;
  seoDescription: string;
};

export function ArticleForm({
  categories,
  destinations,
  trips,
  initial,
}: {
  categories: { id: string; name: string }[];
  destinations: { id: string; name: string }[];
  trips: { id: string; title: string }[];
  initial?: AdminArticleRecord;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    destinationId: initial?.destinationId ?? "",
    excerpt: initial?.excerpt ?? "",
    readTimeMinutes: initial ? String(initial.readTimeMinutes) : "5",
    sections: initial?.sections && initial.sections.length > 0 ? initial.sections : [{ heading: "", paragraphs: [""], list: [] }],
    relatedTripIds: initial?.relatedTripIds ?? [],
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

  function toggleRelatedTrip(tripId: string) {
    setForm((f) => ({
      ...f,
      relatedTripIds: f.relatedTripIds.includes(tripId)
        ? f.relatedTripIds.filter((id) => id !== tripId)
        : [...f.relatedTripIds, tripId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setErrors({});

    const input: BlogInput = {
      title: form.title,
      slug: form.slug || slugifyClient(form.title),
      categoryId: form.categoryId,
      destinationId: form.destinationId || undefined,
      excerpt: form.excerpt,
      readTimeMinutes: Number(form.readTimeMinutes),
      sections: form.sections
        .map((s) => ({ ...s, paragraphs: s.paragraphs.map((p) => p.trim()).filter(Boolean), list: s.list ?? [] }))
        .filter((s) => s.paragraphs.length > 0),
      relatedTripIds: form.relatedTripIds,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
    };

    if (isEdit) {
      const result = await updateArticle(initial!.id, input);
      setSaving(false);
      if (!result.success) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } else {
      const result = await createArticle(input);
      setSaving(false);
      if (!result.success) {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      router.push(`/admin/blog/${result.data.id}/edit`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClasses}>Title</label>
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
          <label className={labelClasses}>Category</label>
          <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClasses}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Related Destination (optional)</label>
          <select value={form.destinationId} onChange={(e) => set("destinationId", e.target.value)} className={inputClasses}>
            <option value="">None</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Read Time (minutes)</label>
          <input type="number" min={1} value={form.readTimeMinutes} onChange={(e) => set("readTimeMinutes", e.target.value)} className={inputClasses} required />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} className={inputClasses} required />
          {errors.excerpt ? <p className={errorClasses}>{errors.excerpt[0]}</p> : null}
        </div>
      </section>

      <section>
        <SectionListEditor sections={form.sections} onChange={(sections) => set("sections", sections)} />
      </section>

      {trips.length > 0 ? (
        <section>
          <p className={labelClasses}>Related Trips (optional)</p>
          <div className="flex flex-wrap gap-2">
            {trips.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleRelatedTrip(t.id)}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                  form.relatedTripIds.includes(t.id)
                    ? "border-forest bg-forest text-ivory"
                    : "border-charcoal/15 text-charcoal hover:border-forest/40"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

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
          {isEdit ? "Save Changes" : "Create Article"}
        </button>
        {!isEdit ? (
          <p className="text-xs text-charcoal/45">You&apos;ll add a hero image after creating the article.</p>
        ) : null}
      </div>
    </form>
  );
}
