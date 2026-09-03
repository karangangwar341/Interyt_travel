"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Loader2, ExternalLink, AlertTriangle } from "lucide-react";
import { updateMediaMetadata, deleteMedia, replaceMediaFile, fetchMediaUsages } from "@/lib/actions/media";
import type { MediaItem, MediaUsageDetail } from "@/lib/data/media";

const inputClasses =
  "w-full rounded-xl border-2 border-charcoal/15 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-terracotta focus:outline-none";
const labelClasses = "mb-1 block text-xs font-medium uppercase tracking-widest2 text-charcoal/45";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaDetailPanel({ media, onClose }: { media: MediaItem; onClose: () => void }) {
  const router = useRouter();
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [altText, setAltText] = useState(media.altText ?? "");
  const [title, setTitle] = useState(media.title ?? "");
  const [caption, setCaption] = useState(media.caption ?? "");
  const [description, setDescription] = useState(media.description ?? "");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [usages, setUsages] = useState<MediaUsageDetail[] | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAltText(media.altText ?? "");
    setTitle(media.title ?? "");
    setCaption(media.caption ?? "");
    setDescription(media.description ?? "");
    setUsages(null);
    setDeleteError("");
    setConfirmingDelete(false);
    fetchMediaUsages(media.id).then(setUsages);
  }, [media]);

  async function handleSave() {
    setSaving(true);
    setSavedMessage("");
    const res = await updateMediaMetadata(media.id, { altText, title, caption, description });
    setSaving(false);
    if (res.success) {
      setSavedMessage("Saved.");
      router.refresh();
    }
  }

  async function handleReplace(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    const formData = new FormData();
    formData.set("file", file);
    const res = await replaceMediaFile(media.id, formData);
    setBusy(false);
    if (res.success) {
      router.refresh();
    }
  }

  async function handleDelete(force: boolean) {
    setBusy(true);
    setDeleteError("");
    const res = await deleteMedia(media.id, force);
    setBusy(false);
    if (res.success) {
      router.refresh();
      onClose();
    } else if (!force) {
      setDeleteError(res.message);
      setConfirmingDelete(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-charcoal/40"
        onClick={onClose}
      />
      <div className="relative flex w-full max-w-md flex-col overflow-y-auto bg-ivory p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-charcoal">Edit Image</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-charcoal/60 hover:text-charcoal">
            <X size={20} />
          </button>
        </div>

        <div className="relative mt-4 h-56 w-full overflow-hidden rounded-xl bg-charcoal/5">
          <Image src={media.url} alt={media.altText ?? media.fileName} fill className="object-contain" />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/50">
          <span>{media.fileName}</span>
          {media.width && media.height ? <span>{media.width}×{media.height}px</span> : null}
          <span>{formatBytes(media.fileSize)}</span>
          <span>{new Date(media.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={labelClasses}>Alt Text</label>
            <input value={altText} onChange={(e) => setAltText(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClasses} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2 text-sm font-semibold text-ivory shadow-sm shadow-forest/30 disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : null}
              Save
            </button>
            {savedMessage ? <span className="text-xs text-success">{savedMessage}</span> : null}
          </div>
        </div>

        <div className="mt-6 border-t border-charcoal/10 pt-4">
          <p className={labelClasses}>Used In</p>
          {usages === null ? (
            <p className="mt-2 text-sm text-charcoal/45">Checking usage…</p>
          ) : usages.length === 0 ? (
            <p className="mt-2 text-sm text-charcoal/45">Not currently used anywhere.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {usages.map((u, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/75">
                    {u.ownerType} — {u.label}{" "}
                    <span className="text-charcoal/40">({u.role.toLowerCase()})</span>
                  </span>
                  {u.href ? (
                    <a href={u.href} target="_blank" rel="noopener noreferrer" className="text-forest">
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 border-t border-charcoal/10 pt-4">
          <label className={labelClasses}>Replace Image</label>
          <button
            onClick={() => replaceInputRef.current?.click()}
            disabled={busy}
            className="mt-1 inline-flex items-center rounded-full border-2 border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:border-forest/40 disabled:opacity-60"
          >
            Upload replacement
          </button>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => handleReplace(e.target.files)}
          />
          <p className="mt-1.5 text-xs text-charcoal/45">
            Replacing keeps this image&apos;s ID — every place it&apos;s used updates automatically.
          </p>
        </div>

        <div className="mt-6 border-t border-charcoal/10 pt-4">
          {deleteError ? (
            <div className="mb-3 flex items-start gap-2 rounded-xl bg-danger-light px-3 py-2.5 text-sm text-danger">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>{deleteError} Deleting will remove it from all of them.</span>
            </div>
          ) : null}
          <button
            onClick={() => handleDelete(confirmingDelete)}
            disabled={busy}
            className="inline-flex items-center rounded-full border-2 border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-danger-light disabled:opacity-60"
          >
            {confirmingDelete ? "Delete anyway" : "Delete Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
