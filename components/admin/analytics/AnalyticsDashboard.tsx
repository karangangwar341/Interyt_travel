import Link from "next/link";
import { Eye, Users, MessageCircle, Phone, Inbox } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/data/admin-analytics";

const sourceLabels: Record<string, string> = {
  BOOKING_FORM: "Booking Form",
  CUSTOM_TRIP: "Custom Trip",
  CONTACT_FORM: "Contact Form",
  WHATSAPP: "WhatsApp",
  PHONE: "Phone",
};

function StatCard({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
      <Icon className="mb-3 text-forest" size={20} aria-hidden />
      <p className="text-2xl font-semibold text-charcoal">{value.toLocaleString("en-IN")}</p>
      <p className="text-xs text-charcoal/50">{label}</p>
    </div>
  );
}

export function AnalyticsDashboard({ summary, rangeDays }: { summary: AnalyticsSummary; rangeDays: number }) {
  const maxDaily = Math.max(1, ...summary.dailyPageViews.map((d) => d.views));
  const maxTopPage = Math.max(1, ...summary.topPages.map((p) => p.views));
  const totalDevice = Math.max(1, summary.deviceBreakdown.reduce((sum, d) => sum + d.count, 0));

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {[7, 30, 90].map((d) => (
          <Link
            key={d}
            href={`/admin/analytics?days=${d}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              rangeDays === d ? "bg-forest text-ivory" : "border-2 border-charcoal/15 text-charcoal"
            }`}
          >
            Last {d} days
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Eye} label="Page Views" value={summary.totalPageViews} />
        <StatCard icon={Users} label="Unique Visitors" value={summary.uniqueSessions} />
        <StatCard icon={MessageCircle} label="WhatsApp Clicks" value={summary.whatsappClicks} />
        <StatCard icon={Phone} label="Phone Clicks" value={summary.phoneClicks} />
        <StatCard icon={Inbox} label="Enquiries" value={summary.enquiriesSubmitted} />
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Page Views Over Time</p>
        <div className="flex h-32 items-end gap-1">
          {summary.dailyPageViews.map((d) => (
            <div key={d.date} className="group relative flex-1">
              <div
                className="w-full rounded-t bg-forest/60 transition-colors group-hover:bg-forest"
                style={{ height: `${Math.max(4, (d.views / maxDaily) * 100)}%` }}
              />
              <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-charcoal px-2 py-1 text-[10px] text-ivory group-hover:block">
                {d.date}: {d.views}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Top Pages</p>
          {summary.topPages.length === 0 ? (
            <p className="text-sm text-charcoal/45">No page view data yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.topPages.map((p) => (
                <div key={p.page}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate text-charcoal">{p.page}</span>
                    <span className="text-charcoal/50">{p.views}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-charcoal/10">
                    <div className="h-1.5 rounded-full bg-terracotta" style={{ width: `${(p.views / maxTopPage) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Devices</p>
          {summary.deviceBreakdown.length === 0 ? (
            <p className="text-sm text-charcoal/45">No device data yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.deviceBreakdown.map((d) => (
                <div key={d.device}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal">{d.device}</span>
                    <span className="text-charcoal/50">{Math.round((d.count / totalDevice) * 100)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-charcoal/10">
                    <div className="h-1.5 rounded-full bg-forest" style={{ width: `${(d.count / totalDevice) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-ivory p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Enquiries by Source</p>
        {summary.enquiriesBySource.length === 0 ? (
          <p className="text-sm text-charcoal/45">No enquiries in this range.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {summary.enquiriesBySource.map((s) => (
              <div key={s.source} className="rounded-xl border border-charcoal/10 bg-warm-white px-4 py-2 text-sm">
                <span className="font-medium text-charcoal">{s.count}</span>{" "}
                <span className="text-charcoal/60">{sourceLabels[s.source] ?? s.source}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
