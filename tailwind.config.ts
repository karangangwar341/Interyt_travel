import type { Config } from "tailwindcss";

function withOpacity(cssVar: string) {
  return `rgb(var(${cssVar}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1180px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        // All brand colors are driven by CSS variables (see app/globals.css)
        // so the palette can switch live via [data-theme] without a rebuild.
        ivory: withOpacity("--color-ivory"),
        "warm-white": withOpacity("--color-warm-white"),
        charcoal: withOpacity("--color-charcoal"),
        forest: {
          DEFAULT: withOpacity("--color-forest"),
          light: withOpacity("--color-forest-light"),
          dark: withOpacity("--color-forest-dark"),
        },
        terracotta: {
          DEFAULT: withOpacity("--color-terracotta"),
          light: withOpacity("--color-terracotta-light"),
          dark: withOpacity("--color-terracotta-dark"),
        },
        sand: {
          DEFAULT: withOpacity("--color-sand"),
          light: withOpacity("--color-sand-light"),
          dark: withOpacity("--color-sand-dark"),
        },
        gold: {
          DEFAULT: withOpacity("--color-gold"),
          light: withOpacity("--color-gold-light"),
        },
        success: {
          DEFAULT: withOpacity("--color-success"),
          light: withOpacity("--color-success-light"),
        },
        danger: {
          DEFAULT: withOpacity("--color-danger"),
          light: withOpacity("--color-danger-light"),
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      maxWidth: {
        prose: "68ch",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        floatA: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(6%, 8%) scale(1.15)" },
        },
        floatB: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(-8%, 5%) scale(1.1)" },
        },
        floatC: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(4%, -7%) scale(1.2)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        kenBurns: "kenBurns 20s ease-in-out infinite alternate",
        floatA: "floatA 18s ease-in-out infinite alternate",
        floatB: "floatB 22s ease-in-out infinite alternate",
        floatC: "floatC 26s ease-in-out infinite alternate",
        bounceSubtle: "bounceSubtle 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
