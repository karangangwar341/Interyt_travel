import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <SiteSettingsProvider settings={settings}>
      <div className="flex min-h-screen flex-col">
        <AnalyticsTracker />
        <Header />
        <div className="flex-1 pb-16 lg:pb-0">{children}</div>
        <Footer />
        <StickyMobileCTA />
      </div>
    </SiteSettingsProvider>
  );
}
