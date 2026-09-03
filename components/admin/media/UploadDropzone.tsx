"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadMedia } from "@/lib/actions/media";

export function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ uploaded: number; errors: string[] } | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    const res = await uploadMedia(formData);
    setUploading(false);

    if (res.success) {
      setResult(res.data);
      router.refresh();
    } else {
      setResult({ uploaded: 0, errors: [res.message] });
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-forest bg-forest/5" : "border-charcoal/20 hover:border-forest/40"
        }`}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-forest" size={28} aria-hidden />
        ) : (
          <UploadCloud className="text-charcoal/40" size={28} aria-hidden />
        )}
        <p className="text-sm font-medium text-charcoal">
          {uploading ? "Uploading…" : "Drag & drop images, or click to browse"}
        </p>
        <p className="text-xs text-charcoal/45">JPEG, PNG, WebP, GIF or AVIF — up to 8MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {result ? (
        <div className="mt-3 text-sm">
          {result.uploaded > 0 ? (
            <p className="text-success">
              {result.uploaded} image{result.uploaded === 1 ? "" : "s"} uploaded successfully.
            </p>
          ) : null}
          {result.errors.map((e) => (
            <p key={e} className="text-danger">{e}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
