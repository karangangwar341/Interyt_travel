"use client";

import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { ChipListEditor } from "@/components/admin/ChipListEditor";
import type { GuideSection } from "@/lib/data/types";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";

function emptySection(): GuideSection {
  return { heading: "", paragraphs: [""], list: [] };
}

export function SectionListEditor({
  sections,
  onChange,
}: {
  sections: GuideSection[];
  onChange: (sections: GuideSection[]) => void;
}) {
  function updateSection(index: number, patch: Partial<GuideSection>) {
    onChange(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  function moveSection(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    onChange(next);
  }

  function addSection() {
    onChange([...sections, emptySection()]);
  }

  function updateParagraph(sectionIndex: number, pIndex: number, value: string) {
    const section = sections[sectionIndex]!;
    const paragraphs = section.paragraphs.map((p, i) => (i === pIndex ? value : p));
    updateSection(sectionIndex, { paragraphs });
  }

  function addParagraph(sectionIndex: number) {
    const section = sections[sectionIndex]!;
    updateSection(sectionIndex, { paragraphs: [...section.paragraphs, ""] });
  }

  function removeParagraph(sectionIndex: number, pIndex: number) {
    const section = sections[sectionIndex]!;
    updateSection(sectionIndex, { paragraphs: section.paragraphs.filter((_, i) => i !== pIndex) });
  }

  return (
    <div>
      <p className={labelClasses}>Article Content</p>
      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="rounded-xl border border-charcoal/10 bg-warm-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Section {i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} className="p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                  <ChevronUp size={15} />
                </button>
                <button type="button" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} className="p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                  <ChevronDown size={15} />
                </button>
                <button type="button" onClick={() => removeSection(i)} className="p-1 text-charcoal/40 hover:text-danger">
                  <X size={15} />
                </button>
              </div>
            </div>

            <input
              value={section.heading ?? ""}
              onChange={(e) => updateSection(i, { heading: e.target.value })}
              placeholder="Heading (optional)"
              className={`${inputClasses} mb-3`}
            />

            <div className="space-y-2">
              {section.paragraphs.map((p, pi) => (
                <div key={pi} className="flex items-start gap-2">
                  <textarea
                    value={p}
                    onChange={(e) => updateParagraph(i, pi, e.target.value)}
                    rows={2}
                    placeholder="Paragraph text"
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(i, pi)}
                    disabled={section.paragraphs.length === 1}
                    className="mt-2 p-1 text-charcoal/40 hover:text-danger disabled:opacity-30"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addParagraph(i)}
                className="inline-flex items-center gap-1 rounded-lg border border-charcoal/15 px-2.5 py-1.5 text-xs font-medium text-charcoal hover:border-forest/40"
              >
                <Plus size={13} /> Add Paragraph
              </button>
            </div>

            <div className="mt-3">
              <ChipListEditor
                label="Bullet List (optional)"
                items={section.list ?? []}
                onChange={(list) => updateSection(i, { list })}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="mt-3 inline-flex items-center gap-1 rounded-xl border-2 border-charcoal/15 px-3 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
      >
        <Plus size={15} /> Add Section
      </button>
    </div>
  );
}
