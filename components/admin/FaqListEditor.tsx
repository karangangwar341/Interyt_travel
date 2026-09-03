"use client";

import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";

export interface FaqPair {
  question: string;
  answer: string;
}

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";

export function FaqListEditor({
  items,
  onChange,
}: {
  items: FaqPair[];
  onChange: (items: FaqPair[]) => void;
}) {
  function update(index: number, patch: Partial<FaqPair>) {
    onChange(items.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    onChange(next);
  }

  function add() {
    onChange([...items, { question: "", answer: "" }]);
  }

  return (
    <div>
      <p className="mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45">FAQs</p>

      <div className="space-y-3">
        {items.map((faq, i) => (
          <div key={i} className="rounded-xl border border-charcoal/10 bg-warm-white p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  value={faq.question}
                  onChange={(e) => update(i, { question: e.target.value })}
                  placeholder="Question"
                  className={inputClasses}
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => update(i, { answer: e.target.value })}
                  placeholder="Answer"
                  rows={2}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                  <ChevronUp size={15} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                  <ChevronDown size={15} />
                </button>
                <button type="button" onClick={() => remove(i)} className="text-charcoal/40 hover:text-danger">
                  <X size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1 rounded-xl border-2 border-charcoal/15 px-3 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
      >
        <Plus size={15} /> Add FAQ
      </button>
    </div>
  );
}
