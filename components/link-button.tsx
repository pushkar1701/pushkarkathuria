import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import type { MouseEventHandler, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = VariantProps<typeof buttonVariants> & {
  href: string;
  className?: string;
  children: ReactNode;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  external,
  onClick,
}: LinkButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const isExternal =
    external ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
