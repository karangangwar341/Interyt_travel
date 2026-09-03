import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { navLinks } from "./nav-links";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-ivory/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={buildTelUrl(settings.phone)}
            className="inline-flex items-center gap-2 text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta-dark"
          >
            <Phone size={16} aria-hidden />
            Call
          </a>
          <a
            href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta-dark"
          >
            <MessageCircle size={16} aria-hidden />
            WhatsApp
          </a>
          <Button href="/plan-your-trip" variant="primary" size="md">
            Plan My Trip
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
