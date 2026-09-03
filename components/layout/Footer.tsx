import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Destinations", href: "/destinations" },
      { label: "Trips", href: "/trips" },
      { label: "Experiences", href: "/trips" },
      { label: "Travel Guide", href: "/travel-guide" },
    ],
  },
  {
    title: "Popular",
    links: [
      { label: "Kashmir", href: "/destinations/kashmir" },
      { label: "Ladakh", href: "/destinations/ladakh" },
      { label: "Manali & Spiti", href: "/destinations/himachal-pradesh" },
      { label: "Rajasthan", href: "/destinations/rajasthan" },
      { label: "Goa", href: "/destinations/goa" },
      { label: "Kerala", href: "/destinations/kerala" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cancellation Policy", href: "/legal/cancellation" },
    ],
  },
];

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-charcoal/10 bg-warm-white pb-24 pt-16 lg:pb-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal/60">
              {settings.defaultSeoDescription}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href={settings.instagramUrl ?? "#"} aria-label="Instagram" className="text-charcoal/60 hover:text-terracotta-dark">
                <Instagram size={20} />
              </a>
              <a href={settings.facebookUrl ?? "#"} aria-label="Facebook" className="text-charcoal/60 hover:text-terracotta-dark">
                <Facebook size={20} />
              </a>
              <a href={settings.youtubeUrl ?? "#"} aria-label="YouTube" className="text-charcoal/60 hover:text-terracotta-dark">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-medium uppercase tracking-widest2 text-charcoal/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-charcoal/75 hover:text-terracotta-dark">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest2 text-charcoal/50">
              Connect
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-charcoal/75 hover:text-terracotta-dark">
                  <MessageCircle size={15} aria-hidden />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={buildTelUrl(settings.phone)} className="inline-flex items-center gap-2 text-sm text-charcoal/75 hover:text-terracotta-dark">
                  <Phone size={15} aria-hidden />
                  {settings.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-charcoal/10 pt-6 text-xs text-charcoal/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <p>Made for travelers who explore India on their own terms.</p>
        </div>
      </Container>
    </footer>
  );
}
