"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Map,
  CalendarClock,
  Newspaper,
  Compass,
  Star,
  HelpCircle,
  Inbox,
  Ticket,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/trips", label: "Trips", icon: Map },
  { href: "/admin/destinations", label: "Destinations", icon: Compass },
  { href: "/admin/departures", label: "Departures", icon: CalendarClock },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

// Bottom tab bar only has room for a handful of icons before it becomes
// unusable — these are the four most frequently used day-to-day, everything
// else lives behind "More".
const primaryMobileHrefs = ["/admin/dashboard", "/admin/trips", "/admin/departures", "/admin/enquiries"];
const primaryMobileItems = navItems.filter((item) => primaryMobileHrefs.includes(item.href));
const moreMobileItems = navItems.filter((item) => !primaryMobileHrefs.includes(item.href));

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = moreMobileItems.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));

  return (
    <div className="flex min-h-screen bg-warm-white">
      <aside className="hidden w-64 shrink-0 border-r border-charcoal/10 bg-ivory md:block">
        <div className="border-b border-charcoal/10 px-6 py-5">
          <Logo />
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-forest text-ivory" : "text-charcoal/70 hover:bg-charcoal/5",
                )}
              >
                <item.icon size={17} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-charcoal/10 bg-ivory px-6 py-4 md:hidden">
          <Logo />
          <LogoutButton />
        </header>
        <header className="hidden items-center justify-end border-b border-charcoal/10 bg-ivory px-6 py-4 md:flex">
          <LogoutButton />
        </header>

        <div className="flex-1 p-6">{children}</div>

        <nav className="flex border-t border-charcoal/10 bg-ivory md:hidden">
          {primaryMobileItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-forest" : "text-charcoal/60",
                )}
              >
                <item.icon size={18} aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              isMoreActive ? "text-forest" : "text-charcoal/60",
            )}
          >
            <Menu size={18} aria-hidden />
            More
          </button>
        </nav>

        {moreOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button aria-label="Close menu" className="absolute inset-0 bg-charcoal/40" onClick={() => setMoreOpen(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-ivory p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg text-charcoal">More</span>
                <button type="button" onClick={() => setMoreOpen(false)} aria-label="Close menu" className="p-1.5 text-charcoal">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {moreMobileItems.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center text-xs font-medium",
                        active ? "bg-forest text-ivory" : "bg-charcoal/5 text-charcoal/70",
                      )}
                    >
                      <item.icon size={18} aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
