"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { Plane } from "lucide-react";
import { flightCopy } from "@/content/flight";
import { cn } from "@/lib/utils";

function useMediaQuery(query: string, serverSnapshot: boolean): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Desktop-only deep link into the /flight playground. */
export function FlightCta({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "experience";
  className?: string;
}) {
  const coarsePointer = useMediaQuery("(pointer: coarse)", true);
  const isMdUp = useMediaQuery("(min-width: 768px)", false);

  if (coarsePointer || !isMdUp) return null;

  const label =
    variant === "experience" ? flightCopy.ctaExperience : flightCopy.ctaHero;

  if (variant === "experience") {
    return (
      <Link
        href="/flight"
        className={cn(
          "mt-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand/15",
          className,
        )}
      >
        <Plane className="size-4" aria-hidden />
        {label}
      </Link>
    );
  }

  return (
    <Link
      href="/flight"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-brand/50 bg-brand/15 px-4 text-sm font-medium text-brand transition-colors hover:bg-brand/25",
        className,
      )}
    >
      <Plane className="size-4" aria-hidden />
      {label}
    </Link>
  );
}
