"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { navLinks } from "./nav-links";
import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center p-2 text-charcoal"
      >
        <Menu size={24} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-charcoal/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col rounded-l-3xl bg-ivory p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl text-forest">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 text-charcoal"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg text-charcoal hover:bg-charcoal/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button href="/plan-your-trip" variant="primary" size="lg" onClick={() => setOpen(false)}>
                Plan My Trip
              </Button>
              <a
                href={buildTelUrl(settings.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-5 py-3 text-base font-medium text-charcoal"
              >
                <Phone size={18} aria-hidden />
                Call Now
              </a>
              <a
                href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-terracotta-dark px-5 py-3 text-base font-medium text-charcoal shadow-sm shadow-terracotta/30"
              >
                <MessageCircle size={18} aria-hidden />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
