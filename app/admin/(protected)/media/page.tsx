import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { getAllMedia } from "@/lib/data/media";

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest2 text-terracotta-dark">Content</p>
      <h1 className="mt-3 font-display text-3xl text-charcoal">Media Library</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-charcoal/65">
        Upload once, reuse everywhere. Images here can be attached to trips, destinations, blog
        articles and more as those sections come online.
      </p>

      <div className="mt-8">
        <MediaLibrary media={media} />
      </div>
    </div>
  );
}
