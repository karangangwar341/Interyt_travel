"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import type { SiteSettingsInput } from "@/lib/validations/site-settings";
import type { SiteSettingsData } from "@/lib/data/site-settings";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";
const errorClasses = "mt-1 text-xs text-danger";

type FormState = {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  businessHours: string;
  supportMessage: string;
};

export function SiteSettingsForm({ initial }: { initial: SiteSettingsData }) {
  const [form, setForm] = useState<FormState>({
    businessName: initial.businessName,
    phone: initial.phone,
    whatsapp: initial.whatsapp,
    email: initial.email,
    address: initial.address ?? "",
    instagramUrl: initial.instagramUrl ?? "",
    facebookUrl: initial.facebookUrl ?? "",
    youtubeUrl: initial.youtubeUrl ?? "",
    defaultSeoTitle: initial.defaultSeoTitle,
    defaultSeoDescription: initial.defaultSeoDescription,
    businessHours: initial.businessHours ?? "",
    supportMessage: initial.supportMessage ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setErrors({});

    const input: SiteSettingsInput = {
      businessName: form.businessName,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      address: form.address || undefined,
      instagramUrl: form.instagramUrl || undefined,
      facebookUrl: form.facebookUrl || undefined,
      youtubeUrl: form.youtubeUrl || undefined,
      defaultSeoTitle: form.defaultSeoTitle,
      defaultSeoDescription: form.defaultSeoDescription,
      businessHours: form.businessHours || undefined,
      supportMessage: form.supportMessage || undefined,
    };

    const result = await updateSiteSettings(input);
    setSaving(false);

    if (!result.success) {
      setFormError(result.message);
      if (result.fieldErrors) setErrors(result.fieldErrors);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Business Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Business Name</label>
            <input value={form.businessName} onChange={(e) => set("businessName", e.target.value)} className={inputClasses} required />
            {errors.businessName ? <p className={errorClasses}>{errors.businessName[0]}</p> : null}
          </div>
          <div>
            <label className={labelClasses}>Support Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClasses} required />
            {errors.email ? <p className={errorClasses}>{errors.email[0]}</p> : null}
          </div>
          <div>
            <label className={labelClasses}>Phone Number</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClasses} placeholder="+911234567890" required />
            {errors.phone ? <p className={errorClasses}>{errors.phone[0]}</p> : null}
          </div>
          <div>
            <label className={labelClasses}>WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClasses} placeholder="911234567890" required />
            {errors.whatsapp ? <p className={errorClasses}>{errors.whatsapp[0]}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Office Address (optional)</label>
            <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Business Hours (optional)</label>
            <input value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)} className={inputClasses} placeholder="Monday – Saturday, 10am – 7pm IST" />
          </div>
          <div>
            <label className={labelClasses}>Support Message (optional)</label>
            <input value={form.supportMessage} onChange={(e) => set("supportMessage", e.target.value)} className={inputClasses} placeholder="e.g. We usually reply within a few hours" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Social Links</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClasses}>Instagram URL</label>
            <input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inputClasses} placeholder="https://instagram.com/..." />
            {errors.instagramUrl ? <p className={errorClasses}>{errors.instagramUrl[0]}</p> : null}
          </div>
          <div>
            <label className={labelClasses}>Facebook URL</label>
            <input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} className={inputClasses} placeholder="https://facebook.com/..." />
            {errors.facebookUrl ? <p className={errorClasses}>{errors.facebookUrl[0]}</p> : null}
          </div>
          <div>
            <label className={labelClasses}>YouTube URL</label>
            <input value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} className={inputClasses} placeholder="https://youtube.com/..." />
            {errors.youtubeUrl ? <p className={errorClasses}>{errors.youtubeUrl[0]}</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Default SEO</p>
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Default Page Title</label>
            <input value={form.defaultSeoTitle} onChange={(e) => set("defaultSeoTitle", e.target.value)} className={inputClasses} required />
            {errors.defaultSeoTitle ? <p className={errorClasses}>{errors.defaultSeoTitle[0]}</p> : null}
          </div>
          <div>
            <label className={labelClasses}>Default Meta Description</label>
            <textarea value={form.defaultSeoDescription} onChange={(e) => set("defaultSeoDescription", e.target.value)} rows={3} className={inputClasses} required />
            {errors.defaultSeoDescription ? <p className={errorClasses}>{errors.defaultSeoDescription[0]}</p> : null}
          </div>
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
          Save Settings
        </button>
        {saved ? <span className="text-sm text-forest-dark">Saved — changes are live across the site.</span> : null}
      </div>
    </form>
  );
}
