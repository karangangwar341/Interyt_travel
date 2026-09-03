import { getAnalyticsSummary } from "@/lib/data/admin-analytics";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";

const allowedRanges = [7, 30, 90];

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: { days?: string } }) {
  const requested = Number(searchParams.days);
  const rangeDays = allowedRanges.includes(requested) ? requested : 30;
  const summary = await getAnalyticsSummary(rangeDays);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Analytics</h1>
        <p className="text-sm text-charcoal/55">Traffic and engagement across the site.</p>
      </div>
      <AnalyticsDashboard summary={summary} rangeDays={rangeDays} />
    </div>
  );
}
