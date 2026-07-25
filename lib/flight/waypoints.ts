import { experience } from "@/content/site";
import { FLIGHT_ACCENTS } from "@/lib/flight/accents";

export type FlightWaypoint = {
  id: string;
  company: string;
  shortCompany: string;
  role: string;
  dates: string;
  accent: string;
  position: [number, number, number];
};

function shortCompany(name: string) {
  if (name.includes("Basware")) return "Basware";
  if (name.includes("Sapient")) return "Sapient";
  if (name.includes("DMI")) return "DMI";
  if (name.includes("Cognizant")) return "Cognizant";
  if (name.includes("RSystems")) return "RSystems";
  if (name.includes("Deloitte")) return "Deloitte";
  if (name.includes("Datalogz")) return "Datalogz";
  return name;
}

/** Lay stops along a gentle arc in world space (oldest → newest). */
export function buildFlightWaypoints(): FlightWaypoint[] {
  const ordered = [...experience].reverse();
  const n = ordered.length;
  return ordered.map((job, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const x = (t - 0.5) * 48;
    const z = Math.sin(t * Math.PI) * -10;
    const y = 2 + Math.sin(t * Math.PI * 2) * 0.6;
    return {
      id: job.id,
      company: job.company,
      shortCompany: shortCompany(job.company),
      role: job.role,
      dates: job.dates,
      accent: FLIGHT_ACCENTS[i % FLIGHT_ACCENTS.length],
      position: [x, y, z],
    };
  });
}
