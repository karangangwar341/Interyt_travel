"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "./nav-links";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

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
        className="inline-flex items-center justify-center rounded-lg p-2 text-charcoal transition-colors hover:bg-charcoal/5"
      >
        <Menu size={24} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-50 flex justify-end">
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Close menu"
                  className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />

                {/* Slide-out Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="relative z-10 flex h-full w-[85%] max-w-sm flex-col rounded-l-3xl bg-ivory p-6 shadow-2xl overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                    <div onClick={() => setOpen(false)}>
                      <Logo />
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      className="rounded-full p-2 text-charcoal/70 transition-colors hover:bg-charcoal/10 hover:text-charcoal"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-4 py-3 text-lg font-medium text-charcoal transition-colors hover:bg-charcoal/5 hover:text-terracotta"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col gap-3 pt-8 border-t border-charcoal/10">
                    <Button
                      href="/plan-your-trip"
                      variant="primary"
                      size="lg"
                      onClick={() => setOpen(false)}
                      className="w-full justify-center"
                    >
                      Plan My Trip
                    </Button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href={buildTelUrl(settings.phone)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-charcoal/15 px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-charcoal/30"
                      >
                        <Phone size={16} aria-hidden />
                        Call Now
                      </a>
                      <a
                        href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-terracotta-dark px-3 py-2.5 text-sm font-medium text-charcoal shadow-sm shadow-terracotta/30"
                      >
                        <MessageCircle size={16} aria-hidden />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
