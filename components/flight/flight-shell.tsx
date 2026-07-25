"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFlight } from "./flight-provider";
import {
  DesktopOnlyPanel,
  FlightHud,
  ReducedMotionRouteList,
} from "./flight-hud";

const FlightCanvas = dynamic(() => import("./flight-canvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm">
      Canvas loading…
    </div>
  ),
});

export function FlightShell() {
  const { close, isOpen } = useFlight();
  // null = not yet determined; default to the safe (no-WebGL) fallback
  // path until we've checked, matching the reduced-motion route list.
  const [coarsePointer, setCoarsePointer] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  // Reset progress each time the overlay opens (adjust state while
  // rendering, per React's guidance, instead of in an effect).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setVisited(new Set());
  }

  const handleVisit = useCallback((id: string) => {
    setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateGates = () => {
      setCoarsePointer(coarse.matches);
      setReduceMotion(reduced.matches);
    };

    updateGates();
    coarse.addEventListener("change", updateGates);
    reduced.addEventListener("change", updateGates);

    return () => {
      coarse.removeEventListener("change", updateGates);
      reduced.removeEventListener("change", updateGates);
      setCoarsePointer(null);
      setReduceMotion(null);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  let content: ReactNode;
  if (coarsePointer) {
    content = <DesktopOnlyPanel onClose={close} />;
  } else if (coarsePointer === false && reduceMotion) {
    content = <ReducedMotionRouteList onClose={close} />;
  } else if (coarsePointer === false && reduceMotion === false) {
    content = (
      <>
        <FlightCanvas visited={visited} onVisit={handleVisit} />
        <FlightHud visited={visited} close={close} />
      </>
    );
  } else {
    // Gates not yet determined - render the static, WebGL-free fallback.
    content = <ReducedMotionRouteList onClose={close} />;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-title"
      className="fixed inset-0 z-[80] bg-background/95"
    >
      {content}
    </div>,
    document.body,
  );
}
