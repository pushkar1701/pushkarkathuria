import { experience, projects } from "@/content/site";
import { FLIGHT_ACCENTS } from "@/lib/flight/accents";
import {
  DEFAULT_BOUNDS,
  type SolidBox,
  type Vec3,
  type WorldBounds,
} from "@/lib/flight/collision";

export type LandmarkKind =
  | "company"
  | "project"
  | "contact"
  | "resume"
  | "secret";

export type Landmark = {
  id: string;
  kind: LandmarkKind;
  title: string;
  subtitle?: string;
  body?: string;
  accent: string;
  position: Vec3;
  /** Discovery trigger radius */
  radius: number;
  /** Navigate after close, e.g. #contact or /resume or external URL */
  href?: string;
};

export type Collectible = {
  id: string;
  position: Vec3;
  radius: number;
};

export type FlightWorld = {
  landmarks: Landmark[];
  solids: SolidBox[];
  collectibles: Collectible[];
  bounds: WorldBounds;
  spawn: { position: Vec3; heading: number };
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

/** Lay an open career district: companies, projects, pads, props, secrets. */
export function buildFlightWorld(): FlightWorld {
  const ordered = [...experience].reverse();
  const landmarks: Landmark[] = [];
  const solids: SolidBox[] = [];
  const collectibles: Collectible[] = [];

  // Company cluster — loose arc, west side
  ordered.forEach((job, i) => {
    const t = ordered.length === 1 ? 0 : i / (ordered.length - 1);
    const angle = -0.9 + t * 1.8;
    const r = 14;
    const x = Math.sin(angle) * r - 6;
    const z = -Math.cos(angle) * r - 2;
    const y = 2.2 + Math.sin(t * Math.PI) * 0.8;
    const accent = FLIGHT_ACCENTS[i % FLIGHT_ACCENTS.length];
    landmarks.push({
      id: `company-${job.id}`,
      kind: "company",
      title: shortCompany(job.company),
      subtitle: job.role,
      body: job.dates,
      accent,
      position: [x, y, z],
      radius: 3.2,
    });
    solids.push({
      id: `pad-company-${job.id}`,
      position: [x, 0.35, z],
      size: [3.2, 0.7, 3.2],
    });
  });

  // Projects plaza — east
  const featured = projects.filter((p) => p.featured);
  featured.forEach((project, i) => {
    const x = 16 + (i % 2) * 5;
    const z = -8 + Math.floor(i / 2) * 6;
    const y = 2.4;
    const accent = FLIGHT_ACCENTS[(i + 2) % FLIGHT_ACCENTS.length];
    landmarks.push({
      id: `project-${project.slug}`,
      kind: "project",
      title: project.title,
      subtitle: project.company,
      body: project.metric,
      accent,
      position: [x, y, z],
      radius: 3.4,
      href: "url" in project ? project.url : undefined,
    });
    solids.push({
      id: `pad-project-${project.slug}`,
      position: [x, 0.4, z],
      size: [4, 0.8, 4],
    });
  });

  // Contact + Resume
  landmarks.push({
    id: "pad-contact",
    kind: "contact",
    title: "Contact",
    subtitle: "Say hello",
    body: "Fly close, then jump to the contact section.",
    accent: "#4ec8d4",
    position: [-18, 2.5, 12],
    radius: 3.5,
    href: "#contact",
  });
  solids.push({
    id: "solid-contact",
    position: [-18, 0.45, 12],
    size: [4.5, 0.9, 4.5],
  });

  landmarks.push({
    id: "pad-resume",
    kind: "resume",
    title: "Resume",
    subtitle: "Full CV",
    body: "Open the resume page when you land.",
    accent: "#e07050",
    position: [8, 2.5, 14],
    radius: 3.5,
    href: "/resume",
  });
  solids.push({
    id: "solid-resume",
    position: [8, 0.45, 14],
    size: [4.5, 0.9, 4.5],
  });

  // Secrets
  landmarks.push({
    id: "secret-fly",
    kind: "secret",
    title: "Hidden chord",
    subtitle: "fly",
    body: "You can still type fly on the homepage to open the hangar.",
    accent: "#e8c547",
    position: [0, 5.5, -22],
    radius: 2.8,
  });
  landmarks.push({
    id: "secret-bonafide",
    kind: "secret",
    title: "Bonafide Losers",
    subtitle: "Side projects",
    body: "Five iOS puzzles shipped under my own label.",
    accent: "#5ecf8a",
    position: [22, 3.2, 6],
    radius: 2.8,
    href: "https://bonafide-losers.vercel.app/apps",
  });

  // Atmosphere solids — low platforms & billboards (thin walls)
  const deco: SolidBox[] = [
    { id: "plaza-deck", position: [17, 0.25, -4], size: [14, 0.5, 16] },
    { id: "center-ring", position: [0, 0.2, 0], size: [10, 0.4, 10] },
    { id: "west-ledge", position: [-14, 0.3, -6], size: [8, 0.6, 6] },
    { id: "billboard-a", position: [-4, 3, -14], size: [6, 3.2, 0.4] },
    { id: "billboard-b", position: [12, 2.8, 2], size: [0.4, 2.8, 5] },
    { id: "block-n", position: [2, 1.2, 8], size: [2.2, 2.4, 2.2] },
    { id: "block-s", position: [-8, 0.9, 4], size: [1.8, 1.8, 1.8] },
  ];
  solids.push(...deco);

  // Collectible rings / coins
  const coinSpots: Vec3[] = [
    [0, 3.5, 4],
    [-10, 4, -10],
    [10, 3.8, -12],
    [18, 4.2, 0],
    [-16, 3.6, 4],
    [4, 5, -18],
    [14, 3.5, 10],
    [-2, 4.5, 16],
  ];
  coinSpots.forEach((position, i) => {
    collectibles.push({
      id: `coin-${i}`,
      position,
      radius: 1.1,
    });
  });

  return {
    landmarks,
    solids,
    collectibles,
    bounds: DEFAULT_BOUNDS,
    spawn: { position: [0, 4.5, 18], heading: Math.PI },
  };
}
