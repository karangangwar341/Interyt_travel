"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const travelerOptions = ["1", "2", "3", "4", "5+"];

const selectClasses =
  "w-full appearance-none border-0 border-b-2 border-charcoal/15 bg-transparent py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";

export function TravelSearch({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("");
  const [duration, setDuration] = useState("");
  const [month, setMonth] = useState("");
  const [travelers, setTravelers] = useState("2");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (tripType) params.set("type", tripType);
    if (duration) params.set("duration", duration);
    if (month) params.set("month", month);
    if (travelers) params.set("travelers", travelers);
    router.push(`/trips?${params.toString()}`);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 mx-4 -mt-10 overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory p-6 shadow-xl shadow-charcoal/10 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-terracotta before:to-forest md:mx-auto md:-mt-12 md:max-w-5xl md:p-8"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:items-end">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="search-destination" className={labelClasses}>
            Where to?
          </label>
          <select
            id="search-destination"
            className={selectClasses}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Any destination</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-type" className={labelClasses}>
            Trip Type
          </label>
          <select
            id="search-type"
            className={selectClasses}
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            {tripTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-duration" className={labelClasses}>
            How Long?
          </label>
          <select
            id="search-duration"
            className={selectClasses}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            {durations.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-month" className={labelClasses}>
            When?
          </label>
          <select
            id="search-month"
            className={selectClasses}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Any month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-travelers" className={labelClasses}>
            Travelers
          </label>
          <select
            id="search-travelers"
            className={selectClasses}
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
          >
            {travelerOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-terracotta-dark px-6 py-3.5 text-sm font-semibold text-charcoal shadow-sm shadow-terracotta/30 transition-all hover:shadow-md hover:shadow-terracotta/40 lg:mt-8"
      >
        <Search size={16} aria-hidden />
        Search Trips
      </button>
    </motion.form>
  );
}
