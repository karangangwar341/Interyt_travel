"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, ImageOff } from "lucide-react";
import { UploadDropzone } from "./UploadDropzone";
import { MediaDetailPanel } from "./MediaDetailPanel";
import type { MediaItem } from "@/lib/data/media";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibrary({ media }: { media: MediaItem[] }) {
  const [search, setSearch] = useState("");
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return media.filter((m) => {
      if (unusedOnly && m.usageCount > 0) return false;
      if (!q) return true;
      return (
        m.fileName.toLowerCase().includes(q) ||
        (m.altText ?? "").toLowerCase().includes(q) ||
        (m.caption ?? "").toLowerCase().includes(q) ||
        (m.title ?? "").toLowerCase().includes(q)
      );
    });
  }, [media, search, unusedOnly]);

  // Keep the panel's data fresh after edits (router.refresh() gives new props).
  const selectedFresh = selected ? media.find((m) => m.id === selected.id) ?? null : null;

  return (
    <div>
      <UploadDropzone />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, alt text, or caption…"
            className="w-full rounded-full border-2 border-charcoal/15 bg-ivory py-2 pl-9 pr-4 text-sm text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setUnusedOnly((v) => !v)}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
            unusedOnly ? "bg-forest text-ivory" : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
          }`}
        >
          Unused Only
        </button>
      </div>

      <p className="mt-4 text-sm text-charcoal/50">
        {filtered.length} image{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-charcoal/10 bg-ivory py-16 text-center">
          <ImageOff className="text-charcoal/30" size={28} aria-hidden />
          <p className="text-sm text-charcoal/50">
            {media.length === 0 ? "No images uploaded yet — add your first one above." : "No images match your search."}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group text-left"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal/5">
                <Image
                  src={item.url}
                  alt={item.altText ?? item.fileName}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.usageCount > 0 ? (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-forest/90 px-2 py-0.5 text-[10px] font-semibold text-ivory">
                    {item.usageCount}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 truncate text-xs text-charcoal/70">{item.fileName}</p>
              <p className="text-[11px] text-charcoal/40">{formatBytes(item.fileSize)}</p>
            </button>
          ))}
        </div>
      )}

      {selectedFresh ? (
        <MediaDetailPanel media={selectedFresh} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
