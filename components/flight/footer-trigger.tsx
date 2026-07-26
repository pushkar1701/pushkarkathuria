"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { Plane } from "lucide-react";
import { flightCopy } from "@/content/flight";

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

export function FooterTrigger() {
  const coarsePointer = useMediaQuery("(pointer: coarse)", true);
  const isMdUp = useMediaQuery("(min-width: 768px)", false);

  if (coarsePointer || !isMdUp) return null;

  return (
    <Link
      href="/flight"
      data-flight-trigger="true"
      aria-label={flightCopy.footerAria}
      className="text-muted-foreground opacity-40 transition-[color,opacity] hover:text-brand hover:opacity-100"
    >
      <Plane aria-hidden="true" className="size-4" />
    </Link>
  );
}
