import { getSiteSettings } from "@/lib/data/site-settings";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">Settings</h1>
      <p className="mb-6 text-sm text-charcoal/55">
        Business contact info, social links, and default SEO — used across the header, footer, WhatsApp/call buttons, and page metadata site-wide.
      </p>
      <SiteSettingsForm initial={settings} />
    </div>
  );
}
