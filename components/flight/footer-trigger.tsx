"use client";

import { Plane } from "lucide-react";
import { flightCopy } from "@/content/flight";
import { useFlightOptional } from "./flight-provider";

export function FooterTrigger() {
  const flight = useFlightOptional();
  if (!flight) return null;

  return (
    <button
      type="button"
      data-flight-trigger="true"
      onClick={flight.open}
      aria-label={flightCopy.footerAria}
      className="text-muted-foreground opacity-40 transition-[color,opacity] hover:text-brand hover:opacity-100"
    >
      <Plane aria-hidden="true" className="size-4" />
    </button>
  );
}
