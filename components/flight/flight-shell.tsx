"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { flightCopy } from "@/content/flight";
import { useFlight } from "./flight-provider";

const FlightCanvas = dynamic(() => import("./flight-canvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm">
      Canvas loading…
    </div>
  ),
});

function LandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
    >
      {flightCopy.land}
    </button>
  );
}

export function FlightShell() {
  const { close, isOpen } = useFlight();
  const [useFallback, setUseFallback] = useState<boolean | null>(null);

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

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateFallback = () =>
      setUseFallback(coarsePointer.matches || reducedMotion.matches);

    updateFallback();
    coarsePointer.addEventListener("change", updateFallback);
    reducedMotion.addEventListener("change", updateFallback);

    return () => {
      coarsePointer.removeEventListener("change", updateFallback);
      reducedMotion.removeEventListener("change", updateFallback);
      setUseFallback(null);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-title"
      className="fixed inset-0 z-[80] bg-background/95"
    >
      {useFallback === false ? (
        <>
          <FlightCanvas />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
            <h2 id="flight-title" className="font-heading text-xl font-bold">
              {flightCopy.title}
            </h2>
            <LandButton onClick={close} />
          </div>
        </>
      ) : (
        <div className="grid h-full place-items-center p-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
            <h2
              id="flight-title"
              className="font-heading text-2xl font-bold"
            >
              {flightCopy.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {flightCopy.desktopOnly}
            </p>
            <div className="mt-6">
              <LandButton onClick={close} />
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
