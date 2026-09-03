import { getTripOptions } from "@/lib/data/admin-upcoming-trips";
import { ReviewForm } from "@/components/admin/reviews/ReviewForm";

export default async function NewReviewPage() {
  const trips = await getTripOptions();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">Add Review</h1>
      <p className="mb-6 text-sm text-charcoal/55">Add a genuine customer review. Never fabricate customer feedback.</p>
      <ReviewForm trips={trips} />
    </div>
  );
}
