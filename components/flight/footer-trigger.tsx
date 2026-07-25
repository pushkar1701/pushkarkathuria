"use client";

import { Plane } from "lucide-react";
import { flightCopy } from "@/content/flight";
import { useFlight } from "./flight-provider";

export function FooterTrigger() {
  const { open } = useFlight();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={flightCopy.footerAria}
      className="text-muted-foreground opacity-40 transition-[color,opacity] hover:text-brand hover:opacity-100"
    >
      <Plane aria-hidden="true" className="size-4" />
    </button>
  );
}
