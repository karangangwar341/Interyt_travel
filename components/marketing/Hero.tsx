"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GradientSlideshow } from "./GradientSlideshow";
import { RotatingWord } from "./RotatingWord";
import { StatCounter } from "./StatCounter";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";

const destinationWords = ["India", "Kashmir", "Kerala", "Rajasthan", "Ladakh", "Goa", "Meghalaya"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero({
  destinationCount,
  tripCount,
}: {
  destinationCount: number;
  tripCount: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const settings = useSiteSettings();

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden lg:min-h-[92vh]">
      <GradientSlideshow className="absolute inset-0" />

      {/* Ambient floating color orbs for depth and motion */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-gold/30 blur-3xl motion-safe:animate-floatA" />
        <div className="absolute -bottom-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-terracotta/25 blur-3xl motion-safe:animate-floatB" />
        <div className="absolute right-[15%] top-[10%] h-[280px] w-[280px] rounded-full bg-ivory/20 blur-3xl motion-safe:animate-floatC" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgb(var(--color-charcoal) / 0.1) 0%, transparent 40%, rgb(var(--color-charcoal) / 0.7) 100%)",
        }}
      />

      <motion.div
        className="container relative z-10 pb-16 pt-32 text-ivory md:pb-20"
        variants={shouldReduceMotion ? undefined : container}
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
      >
        <motion.p
          variants={shouldReduceMotion ? undefined : item}
          className="text-xs font-medium uppercase tracking-widest2 text-ivory/80"
        >
          India, curated · {destinationCount} destinations · {tripCount} handcrafted trips
        </motion.p>
        <motion.h1
          variants={shouldReduceMotion ? undefined : item}
          className="mt-5 max-w-2xl text-5xl leading-[1.05] md:text-7xl"
        >
          Discover <RotatingWord words={destinationWords} className="italic text-gold-light" />
          <br />
          Your Way.
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? undefined : item}
          className="mt-6 max-w-md text-base leading-relaxed text-ivory/85 md:text-lg"
        >
          Curated journeys across India&apos;s mountains, beaches, deserts, heritage cities and
          hidden gems — planned by experts, built around you.
        </motion.p>
        <motion.div variants={shouldReduceMotion ? undefined : item} className="mt-8 flex flex-wrap gap-3">
          <Button href="/trips" variant="primary" size="lg">
            Explore Trips
          </Button>
          <Button
            href="/plan-your-trip"
            variant="outline"
            size="lg"
            className="border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10"
          >
            Plan a Custom Trip
          </Button>
          <Button
            href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
            className="from-ivory to-ivory text-charcoal shadow-charcoal/20 hover:from-ivory hover:to-ivory hover:shadow-charcoal/30"
          >
            WhatsApp Us
          </Button>
        </motion.div>

        <motion.div
          variants={shouldReduceMotion ? undefined : item}
          className="mt-12 flex max-w-md items-center gap-8 border-t border-ivory/20 pt-6"
        >
          <StatCounter target={destinationCount} label="Destinations" />
          <StatCounter target={tripCount} label="Curated Trips" />
          <StatCounter target={5} label="Regions of India" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute inset-x-0 bottom-16 z-10 hidden justify-center md:flex lg:bottom-20"
      >
        <ChevronDown className="text-ivory/60 motion-safe:animate-bounceSubtle" size={26} aria-hidden />
      </motion.div>
    </section>
  );
}
