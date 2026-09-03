import { Phone, MessageCircle, Compass } from "lucide-react";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import Link from "next/link";

export async function StickyMobileCTA() {
  const settings = await getSiteSettings();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex overflow-hidden rounded-t-2xl border border-b-0 border-charcoal/10 bg-ivory shadow-xl shadow-charcoal/15 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={buildTelUrl(settings.phone)}
        className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-charcoal"
      >
        <Phone size={18} aria-hidden />
        Call
      </a>
      <a
        href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-0.5 border-x border-charcoal/10 py-2.5 text-xs font-medium text-charcoal"
      >
        <MessageCircle size={18} aria-hidden />
        WhatsApp
      </a>
      <Link
        href="/plan-your-trip"
        className="flex flex-1 flex-col items-center gap-0.5 bg-gradient-to-r from-terracotta to-terracotta-dark py-2.5 text-xs font-semibold text-charcoal"
      >
        <Compass size={18} aria-hidden />
        Plan Trip
      </Link>
    </div>
  );
}
