import type { Metadata } from "next";
import { FlightApp } from "@/components/flight-world/flight-app";

export const metadata: Metadata = {
  title: "Career Flight",
  description:
    "A physics playground through Pushkar Kathuria’s career — fly a rocket, smash toys, and discover the work.",
  robots: { index: false, follow: true },
};

export default function FlightPage() {
  return <FlightApp />;
}
