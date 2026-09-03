"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaqListEditor, type FaqPair } from "@/components/admin/FaqListEditor";
import { replaceGlobalFaqs } from "@/lib/actions/global-faqs";

export function GlobalFaqEditor({ initial }: { initial: FaqPair[] }) {
  const [faqs, setFaqs] = useState<FaqPair[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await replaceGlobalFaqs(faqs);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
      <FaqListEditor
        items={faqs}
        onChange={(v) => {
          setFaqs(v);
          setSaved(false);
        }}
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={15} /> : null}
          Save FAQs
        </button>
        {saved ? <span className="text-xs text-forest-dark">Saved</span> : null}
      </div>
    </div>
  );
}
