"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { GalleryImage } from "@/lib/data/types";

export function Gallery({ images, title }: { images?: GalleryImage[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % images!.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + images!.length) % images!.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, images]);

  if (!images || images.length === 0) return null;

  const visible = images.slice(0, 5);
  const remaining = images.length - visible.length;

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl text-charcoal">Gallery</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
        {visible.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`group relative overflow-hidden rounded-2xl bg-charcoal/5 ${
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-200 group-hover:bg-charcoal/20 group-hover:opacity-100">
              <Expand className="text-ivory" size={20} aria-hidden />
            </span>
            {i === visible.length - 1 && remaining > 0 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-charcoal/50 text-lg font-semibold text-ivory">
                +{remaining} more
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4">
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20"
          >
            <X size={22} />
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20 sm:left-4"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative h-[70vh] w-full max-w-4xl">
            <Image
              src={images[openIndex]!.url}
              alt={images[openIndex]!.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20 sm:right-4"
          >
            <ChevronRight size={24} />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-ivory/70">
            {title} — {openIndex + 1} / {images.length}
            {images[openIndex]!.credit ? ` · Photo: ${images[openIndex]!.credit}` : ""}
          </p>
        </div>
      ) : null}
    </section>
  );
}
