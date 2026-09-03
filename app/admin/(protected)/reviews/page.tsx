import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllReviewsForAdmin } from "@/lib/data/admin-reviews";
import { ReviewsTable } from "@/components/admin/reviews/ReviewsTable";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Reviews</h1>
          <p className="text-sm text-charcoal/55">
            Manage customer reviews. Only add reviews from real customers — seeded sample reviews are marked &ldquo;Sample&rdquo;.
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
        >
          <Plus size={16} /> Add Review
        </Link>
      </div>

      <ReviewsTable reviews={reviews} />
    </div>
  );
}
