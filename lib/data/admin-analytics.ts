import { prisma } from "@/lib/db";

export interface AnalyticsSummary {
  rangeDays: number;
  totalPageViews: number;
  uniqueSessions: number;
  whatsappClicks: number;
  phoneClicks: number;
  enquiriesSubmitted: number;
  topPages: { page: string; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
  dailyPageViews: { date: string; views: number }[];
  enquiriesBySource: { source: string; count: number }[];
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export async function getAnalyticsSummary(rangeDays = 30): Promise<AnalyticsSummary> {
  const since = startOfDay(new Date());
  since.setDate(since.getDate() - (rangeDays - 1));

  const [pageViewEvents, whatsappClicks, phoneClicks, enquiries] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { eventType: "PAGE_VIEW", createdAt: { gte: since } },
      select: { page: true, sessionId: true, device: true, createdAt: true },
    }),
    prisma.analyticsEvent.count({ where: { eventType: "WHATSAPP_CLICK", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { eventType: "PHONE_CLICK", createdAt: { gte: since } } }),
    prisma.enquiry.findMany({ where: { createdAt: { gte: since } }, select: { source: true } }),
  ]);

  const pageCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();
  const sessions = new Set<string>();

  for (const event of pageViewEvents) {
    pageCounts.set(event.page, (pageCounts.get(event.page) ?? 0) + 1);
    sessions.add(event.sessionId);
    if (event.device) deviceCounts.set(event.device, (deviceCounts.get(event.device) ?? 0) + 1);
    const day = event.createdAt.toISOString().slice(0, 10);
    dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
  }

  const sourceCounts = new Map<string, number>();
  for (const enquiry of enquiries) {
    sourceCounts.set(enquiry.source, (sourceCounts.get(enquiry.source) ?? 0) + 1);
  }

  const dailyPageViews: { date: string; views: number }[] = [];
  for (let i = 0; i < rangeDays; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyPageViews.push({ date: key, views: dailyCounts.get(key) ?? 0 });
  }

  return {
    rangeDays,
    totalPageViews: pageViewEvents.length,
    uniqueSessions: sessions.size,
    whatsappClicks,
    phoneClicks,
    enquiriesSubmitted: enquiries.length,
    topPages: [...pageCounts.entries()]
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
    deviceBreakdown: [...deviceCounts.entries()].map(([device, count]) => ({ device, count })),
    dailyPageViews,
    enquiriesBySource: [...sourceCounts.entries()].map(([source, count]) => ({ source, count })),
  };
}
