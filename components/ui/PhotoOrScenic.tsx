import Image from "next/image";
import { ScenicBlock } from "./ScenicBlock";
import { cn } from "@/lib/utils";
import type { GalleryImage, ScenicPattern, ScenicTone } from "@/lib/data/types";

export function PhotoOrScenic({
  image,
  pattern,
  tone,
  alt,
  className,
  sizes,
  priority,
  showCredit,
}: {
  image?: GalleryImage;
  pattern: ScenicPattern;
  tone: ScenicTone;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showCredit?: boolean;
}) {
  if (!image) {
    return <ScenicBlock pattern={pattern} tone={tone} label={alt} className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={image.url}
        alt={image.alt || alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className="object-cover"
      />
      {showCredit && image.credit ? (
        <a
          href={image.creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1.5 right-2 z-10 text-[10px] text-ivory/70 drop-shadow hover:text-ivory"
        >
          Photo: {image.credit}
        </a>
      ) : null}
    </div>
  );
}
