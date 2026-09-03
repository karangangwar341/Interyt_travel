"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Search, UploadCloud, Loader2, ImageOff } from "lucide-react";
import { getAllMediaAction, uploadMedia } from "@/lib/actions/media";
import type { MediaItem } from "@/lib/data/media";

/**
 * Reusable image field for CMS forms (Trip/Destination/Blog editors, etc).
 * Opens a modal offering "Choose Existing" (search the library) or
 * "Upload New" — either way the caller gets a MediaItem back. No content
 * editor should ever require pasting an image URL.
 */
export function MediaPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="mb-1.5 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45">{label}</p>

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-charcoal/10 bg-ivory p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-charcoal/5">
            <Image src={value.url} alt={value.altText ?? value.fileName} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-charcoal">{value.fileName}</p>
            {value.width && value.height ? (
              <p className="text-xs text-charcoal/45">{value.width}×{value.height}px</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border-2 border-charcoal/15 px-3 py-1.5 text-xs font-medium text-charcoal hover:border-forest/40"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="p-1.5 text-charcoal/40 hover:text-danger"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-charcoal/20 px-4 py-6 text-sm text-charcoal/60 hover:border-forest/40"
        >
          <UploadCloud size={18} aria-hidden />
          Select or upload an image
        </button>
      )}

      {open ? (
        <PickerModal
          onClose={() => setOpen(false)}
          onSelect={(media) => {
            onChange(media);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function PickerModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
}) {
  const [tab, setTab] = useState<"existing" | "upload">("existing");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    getAllMediaAction().then((rows) => {
      setMedia(rows);
      setLoading(false);
    });
  }, []);

  const filtered = media.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return m.fileName.toLowerCase().includes(q) || (m.altText ?? "").toLowerCase().includes(q);
  });

  async function handleUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("files", file);
    const res = await uploadMedia(formData);
    setUploading(false);
    if (res.success && res.data.created[0]) {
      onSelect(res.data.created[0]);
    } else if (!res.success) {
      setUploadError(res.message);
    } else if (res.data.errors[0]) {
      setUploadError(res.data.errors[0]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close" className="absolute inset-0 bg-charcoal/50" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-ivory shadow-xl">
        <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("existing")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === "existing" ? "bg-forest text-ivory" : "text-charcoal/60"}`}
            >
              Choose Existing
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === "upload" ? "bg-forest text-ivory" : "text-charcoal/60"}`}
            >
              Upload New
            </button>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 text-charcoal/60 hover:text-charcoal">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "existing" ? (
            <>
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images…"
                  className="w-full rounded-full border-2 border-charcoal/15 bg-ivory py-2 pl-9 pr-4 text-sm text-charcoal focus:border-terracotta focus:outline-none"
                />
              </div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-forest" size={24} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <ImageOff className="text-charcoal/30" size={24} />
                  <p className="text-sm text-charcoal/50">No images found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className="relative aspect-square overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal/5 hover:ring-2 hover:ring-forest"
                    >
                      <Image src={item.url} alt={item.altText ?? item.fileName} fill className="object-cover" sizes="200px" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/20 px-6 py-12 text-center hover:border-forest/40">
                {uploading ? (
                  <Loader2 className="animate-spin text-forest" size={28} />
                ) : (
                  <UploadCloud className="text-charcoal/40" size={28} />
                )}
                <span className="text-sm font-medium text-charcoal">
                  {uploading ? "Uploading…" : "Click to choose a file"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
              {uploadError ? <p className="mt-3 text-sm text-danger">{uploadError}</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
