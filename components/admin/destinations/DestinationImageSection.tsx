"use client";

import { useState } from "react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { setDestinationHeroImage } from "@/lib/actions/destinations";
import type { MediaItem } from "@/lib/data/media";
import type { AdminDestinationRecord } from "@/lib/data/admin-destinations";

function toMediaItem(image: AdminDestinationRecord["heroImage"]): MediaItem | null {
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

export function DestinationImageSection({ destinationId, initialHero }: { destinationId: string; initialHero: AdminDestinationRecord["heroImage"] }) {
  const [hero, setHero] = useState<MediaItem | null>(toMediaItem(initialHero));
  const [saving, setSaving] = useState(false);

  async function handleChange(media: MediaItem | null) {
    setHero(media);
    setSaving(true);
    await setDestinationHeroImage(destinationId, media?.id ?? null);
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
      <MediaPicker label="Hero Image" value={hero} onChange={handleChange} />
      {saving ? <p className="mt-1 text-xs text-charcoal/45">Saving…</p> : null}
    </div>
  );
}
