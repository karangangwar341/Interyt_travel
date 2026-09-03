"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Destination } from "@/lib/data/types";

const tripTypes = [
  { value: "", label: "Any trip type" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "LEISURE", label: "Leisure" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "ROAD_TRIP", label: "Road Trip" },
  { value: "WEEKEND", label: "Weekend" },
];

const durations = [
  { value: "", label: "Any duration" },
  { value: "2-4", label: "2-4 Days" },
  { value: "5-7", label: "5-7 Days" },
  { value: "8-10", label: "8-10 Days" },
  { value: "10+", label: "10+ Days" },
];

const budgets = [
  { value: "", label: "Any budget" },
  { value: "under20000", label: "Under ₹20,000" },
  { value: "under35000", label: "Under ₹35,000" },
  { value: "under50000", label: "Under ₹50,000" },
];

const difficulties = [
  { value: "", label: "Any difficulty" },
  { value: "EASY", label: "Easy" },
  { value: "MODERATE", label: "Moderate" },
  { value: "CHALLENGING", label: "Challenging" },
];

const sorts = [
  { value: "", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
  { value: "rating", label: "Highest Rated" },
];

const selectClasses =
  "w-full rounded-full border-2 border-charcoal/15 bg-ivory px-4 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";

export function TripFilters({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/trips?${params.toString()}`);
  }

  function toggle(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === "1") {
      params.delete(key);
    } else {
      params.set(key, "1");
    }
    router.push(`/trips?${params.toString()}`);
  }

  const family = searchParams.get("family") === "1";
  const honeymoon = searchParams.get("honeymoon") === "1";

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5 shadow-md shadow-charcoal/5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-1">
          <label htmlFor="filter-destination" className={labelClasses}>Destination</label>
          <select
            id="filter-destination"
            className={selectClasses}
            value={searchParams.get("destination") ?? ""}
            onChange={(e) => update("destination", e.target.value)}
          >
            <option value="">Any destination</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-type" className={labelClasses}>Trip Type</label>
          <select
            id="filter-type"
            className={selectClasses}
            value={searchParams.get("type") ?? ""}
            onChange={(e) => update("type", e.target.value)}
          >
            {tripTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-duration" className={labelClasses}>Duration</label>
          <select
            id="filter-duration"
            className={selectClasses}
            value={searchParams.get("duration") ?? ""}
            onChange={(e) => update("duration", e.target.value)}
          >
            {durations.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-budget" className={labelClasses}>Budget</label>
          <select
            id="filter-budget"
            className={selectClasses}
            value={searchParams.get("budget") ?? ""}
            onChange={(e) => update("budget", e.target.value)}
          >
            {budgets.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-difficulty" className={labelClasses}>Difficulty</label>
          <select
            id="filter-difficulty"
            className={selectClasses}
            value={searchParams.get("difficulty") ?? ""}
            onChange={(e) => update("difficulty", e.target.value)}
          >
            {difficulties.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="filter-sort" className={labelClasses}>Sort By</label>
          <select
            id="filter-sort"
            className={selectClasses}
            value={searchParams.get("sort") ?? ""}
            onChange={(e) => update("sort", e.target.value)}
          >
            {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggle("family")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            family ? "bg-forest text-ivory" : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
          }`}
        >
          Family Friendly
        </button>
        <button
          type="button"
          onClick={() => toggle("honeymoon")}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            honeymoon ? "bg-forest text-ivory" : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
          }`}
        >
          Honeymoon
        </button>
        {searchParams.toString() ? (
          <button
            type="button"
            onClick={() => router.push("/trips")}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-terracotta-dark hover:bg-terracotta/10"
          >
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}
