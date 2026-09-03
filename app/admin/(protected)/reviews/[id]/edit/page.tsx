import { notFound } from "next/navigation";
import { getTripOptions } from "@/lib/data/admin-upcoming-trips";
import { getReviewForEdit } from "@/lib/data/admin-reviews";
import { ReviewForm } from "@/components/admin/reviews/ReviewForm";

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const [trips, review] = await Promise.all([getTripOptions(), getReviewForEdit(params.id)]);
  if (!review) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">Edit Review</h1>
      <p className="mb-6 text-sm text-charcoal/55">Update this review.</p>
      <ReviewForm trips={trips} initial={review} />
    </div>
  );
}
