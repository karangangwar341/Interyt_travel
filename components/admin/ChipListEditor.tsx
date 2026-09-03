"use client";

import { useState } from "react";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";

export function ChipListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
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

  return (
    <div>
      <p className="mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45">{label}</p>

      {items.length > 0 ? (
        <ul className="mb-2 space-y-1.5">
          {items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center gap-2 rounded-xl border border-charcoal/10 bg-warm-white px-3 py-2 text-sm text-charcoal"
            >
              <span className="flex-1">{item}</span>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                <ChevronUp size={15} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                <ChevronDown size={15} />
              </button>
              <button type="button" onClick={() => remove(i)} className="text-charcoal/40 hover:text-danger">
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Add an item…"}
          className="flex-1 rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-xl border-2 border-charcoal/15 px-3 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
        >
          <Plus size={15} /> Add
        </button>
      </div>
    </div>
  );
}
