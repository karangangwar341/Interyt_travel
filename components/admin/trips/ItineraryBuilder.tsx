"use client";

import { useState } from "react";
import { Plus, X, ChevronUp, ChevronDown, Loader2, GripVertical } from "lucide-react";
import { ChipListEditor } from "@/components/admin/ChipListEditor";
import { replaceItinerary } from "@/lib/actions/itinerary";
import type { AdminItineraryDay } from "@/lib/data/admin-trips";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";

function emptyDay(): AdminItineraryDay {
  return { title: "", location: "", travelDistance: "", travelTime: "", hotel: "", meals: "", notes: "", activities: [] };
}

export function ItineraryBuilder({ tripId, initial }: { tripId: string; initial: AdminItineraryDay[] }) {
  const [days, setDays] = useState<AdminItineraryDay[]>(initial.length > 0 ? initial : []);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update(index: number, patch: Partial<AdminItineraryDay>) {
    setDays((d) => d.map((day, i) => (i === index ? { ...day, ...patch } : day)));
    setSaved(false);
  }

  function addDay() {
    setDays((d) => [...d, emptyDay()]);
    setOpenIndex(days.length);
    setSaved(false);
  }

  function removeDay(index: number) {
    setDays((d) => d.filter((_, i) => i !== index));
    setOpenIndex(null);
    setSaved(false);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= days.length) return;
    setDays((d) => {
      const next = [...d];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item!);
      return next;
    });
    setOpenIndex(target);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const result = await replaceItinerary(tripId, days);
    setSaving(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSaved(true);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-charcoal/10 bg-ivory p-5">
      {days.length === 0 ? (
        <p className="text-sm text-charcoal/50">No itinerary days yet.</p>
      ) : null}

      {days.map((day, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="rounded-xl border border-charcoal/10 bg-warm-white">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <GripVertical size={15} className="text-charcoal/30" aria-hidden />
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs font-semibold text-ivory">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-charcoal">{day.title || `Day ${i + 1}`}</span>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                  <ChevronUp size={15} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === days.length - 1} className="p-1 text-charcoal/40 hover:text-charcoal disabled:opacity-30">
                  <ChevronDown size={15} />
                </button>
                <button type="button" onClick={() => removeDay(i)} className="p-1 text-charcoal/40 hover:text-danger">
                  <X size={15} />
                </button>
              </div>
            </button>

            {open ? (
              <div className="space-y-4 border-t border-charcoal/10 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClasses}>Day Title</label>
                    <input value={day.title} onChange={(e) => update(i, { title: e.target.value })} className={inputClasses} placeholder="Arrival in Srinagar" />
                  </div>
                  <div>
                    <label className={labelClasses}>Location</label>
                    <input value={day.location} onChange={(e) => update(i, { location: e.target.value })} className={inputClasses} placeholder="Srinagar" />
                  </div>
                  <div>
                    <label className={labelClasses}>Travel Distance</label>
                    <input value={day.travelDistance} onChange={(e) => update(i, { travelDistance: e.target.value })} className={inputClasses} placeholder="e.g. 90 km" />
                  </div>
                  <div>
                    <label className={labelClasses}>Travel Time</label>
                    <input value={day.travelTime} onChange={(e) => update(i, { travelTime: e.target.value })} className={inputClasses} placeholder="e.g. 2.5 hrs" />
                  </div>
                  <div>
                    <label className={labelClasses}>Hotel</label>
                    <input value={day.hotel} onChange={(e) => update(i, { hotel: e.target.value })} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Meals</label>
                    <input value={day.meals} onChange={(e) => update(i, { meals: e.target.value })} className={inputClasses} placeholder="Breakfast & Dinner" />
                  </div>
                </div>

                <ChipListEditor label="Activities" items={day.activities} onChange={(v) => update(i, { activities: v })} placeholder="e.g. Shikara ride on Dal Lake" />

                <div>
                  <label className={labelClasses}>Notes</label>
                  <textarea value={day.notes} onChange={(e) => update(i, { notes: e.target.value })} rows={2} className={inputClasses} />
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={addDay}
          className="inline-flex items-center gap-1 rounded-xl border-2 border-charcoal/15 px-3 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
        >
          <Plus size={15} /> Add Day
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={15} /> : null}
          Save Itinerary
        </button>
        {saved ? <span className="text-xs text-forest-dark">Saved</span> : null}
        {error ? <span className="text-xs text-danger">{error}</span> : null}
      </div>
    </div>
  );
}
