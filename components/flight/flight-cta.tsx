"use client";

import { Plane } from "lucide-react";
import { flightCopy } from "@/content/flight";
import { useFlightOptional } from "@/components/flight/flight-provider";
import { cn } from "@/lib/utils";

export function FlightCta({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "experience";
  className?: string;
}) {
  const flight = useFlightOptional();
  if (!flight) return null;

  const label =
    variant === "experience" ? flightCopy.ctaExperience : flightCopy.ctaHero;

  if (variant === "experience") {
    return (
      <button
        type="button"
        onClick={flight.open}
        className={cn(
          "mt-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand/15",
          className,
        )}
      >
        <Plane className="size-4" aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={flight.open}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-brand/50 bg-brand/15 px-4 text-sm font-medium text-brand transition-colors hover:bg-brand/25",
        className,
      )}
    >
      <Plane className="size-4" aria-hidden />
      {label}
    </button>
  );
}
