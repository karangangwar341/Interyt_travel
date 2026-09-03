"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { setTripHeroImage, setTripGallery } from "@/lib/actions/trips";
import type { MediaItem } from "@/lib/data/media";
import type { AdminTripRecord } from "@/lib/data/admin-trips";

function toMediaItem(image: AdminTripRecord["heroImage"]): MediaItem | null {
  if (!image) return null;
  return {
    id: image.mediaId,
    url: image.url,
    thumbnailUrl: null,
    fileName: image.alt,
    mimeType: "image/jpeg",
    fileSize: 0,
    width: image.width ?? null,
    height: image.height ?? null,
    altText: image.alt,
    title: null,
    caption: null,
    description: null,
    createdAt: "",
    usageCount: 0,
  };
}

export function TripImagesSection({
  tripId,
  initialHero,
  initialGallery,
}: {
  tripId: string;
  initialHero: AdminTripRecord["heroImage"];
  initialGallery: AdminTripRecord["gallery"];
}) {
  const [hero, setHero] = useState<MediaItem | null>(toMediaItem(initialHero));
  const [gallery, setGallery] = useState<MediaItem[]>(initialGallery.map((g) => toMediaItem(g)!));
  const [savingHero, setSavingHero] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);

  async function handleHeroChange(media: MediaItem | null) {
    setHero(media);
    setSavingHero(true);
    await setTripHeroImage(tripId, media?.id ?? null);
    setSavingHero(false);
  }

  async function persistGallery(next: MediaItem[]) {
    setGallery(next);
    setSavingGallery(true);
    await setTripGallery(tripId, next.map((m) => m.id));
    setSavingGallery(false);
  }

  function addToGallery(media: MediaItem | null) {
    if (!media) return;
    if (gallery.some((m) => m.id === media.id)) return;
    persistGallery([...gallery, media]);
  }

  function removeFromGallery(id: string) {
    persistGallery(gallery.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-6 rounded-2xl border border-charcoal/10 bg-ivory p-5">
      <div>
        <MediaPicker label="Hero Image" value={hero} onChange={handleHeroChange} />
        {savingHero ? <p className="mt-1 text-xs text-charcoal/45">Saving…</p> : null}
      </div>

      <div>
        <p className="mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45">
          Gallery {savingGallery ? "· Saving…" : ""}
        </p>
        {gallery.length > 0 ? (
          <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {gallery.map((m) => (
              <div key={m.id} className="group relative aspect-square overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal/5">
                <Image src={m.url} alt={m.altText ?? m.fileName} fill className="object-cover" sizes="150px" />
                <button
                  type="button"
                  onClick={() => removeFromGallery(m.id)}
                  aria-label="Remove from gallery"
                  className="absolute right-1 top-1 rounded-full bg-charcoal/70 p-1 text-ivory opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <MediaPicker label="Add to Gallery" value={null} onChange={addToGallery} />
      </div>
    </div>
  );
}
