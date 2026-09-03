import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-terracotta to-terracotta-dark text-charcoal shadow-sm shadow-terracotta/30 hover:shadow-md hover:shadow-terracotta/40",
  secondary:
    "bg-gradient-to-r from-forest to-forest-dark text-ivory shadow-sm shadow-forest/30 hover:shadow-md hover:shadow-forest/40",
  outline:
    "border-2 border-charcoal/15 text-charcoal hover:border-forest/40 hover:bg-forest/[0.04]",
  ghost: "text-charcoal hover:bg-charcoal/[0.05]",
};

const sizeStyles: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 ease-smooth disabled:opacity-50 disabled:pointer-events-none";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
