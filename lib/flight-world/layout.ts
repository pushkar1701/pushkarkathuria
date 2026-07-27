import { experience, projects, skills } from "@/content/site";
import { FLIGHT_ACCENTS } from "@/lib/flight/accents";

export type Vec3 = [number, number, number];

export type LandmarkDef = {
  id: string;
  kind: "company" | "project" | "contact" | "resume" | "secret" | "skill";
  title: string;
  subtitle?: string;
  body?: string;
  accent: string;
  position: Vec3;
  href?: string;
};

export type CrateDef = {
  id: string;
  position: Vec3;
  size: Vec3;
};

export type CoinDef = {
  id: string;
  position: Vec3;
};

export type BouncePadDef = {
  id: string;
  position: Vec3;
  size: Vec3;
  impulse: number;
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

export const SPAWN: { position: Vec3; lookYaw: number } = {
  position: [0, 6, 28],
  // 0 ⇒ world forward (0,0,-1) toward the island center
  lookYaw: 0,
};

/** Leave staging when beyond this XZ distance from world origin. */
export const PLATFORM_RADIUS = 48;

/** Soft floor before auto-return. */
export const WORLD_FALL_Y = -320;

/** Outer roam limit — beyond this the craft respawns. */
export const GALAXY_HARD_VOID = 980;

export type GalaxyPlanetDef = {
  id: string;
  position: Vec3;
  radius: number;
  /** Color key resolved from sky theme in the scene */
  colorFrom: "brand" | "brandSecondary" | "custom";
  customColor?: string;
  ring?: boolean;
  ringColorFrom?: "brand" | "brandSecondary" | "custom";
  customRingColor?: string;
};

/** Distant worlds — visual + solid obstacles across deep space. */
export const GALAXY_PLANETS: GalaxyPlanetDef[] = [
  // Near orbit (just off the island)
  {
    id: "planet-coral",
    position: [-85, 38, -70],
    radius: 12,
    colorFrom: "brand",
    ring: true,
    ringColorFrom: "brandSecondary",
  },
  {
    id: "planet-cyan",
    position: [95, 28, -40],
    radius: 8,
    colorFrom: "brandSecondary",
  },
  {
    id: "planet-violet",
    position: [30, 50, -120],
    radius: 16,
    colorFrom: "custom",
    customColor: "#c9a0ff",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#ffe08a",
  },
  // Mid reach
  {
    id: "planet-ember",
    position: [-160, 55, 90],
    radius: 14,
    colorFrom: "custom",
    customColor: "#ff6a3d",
  },
  {
    id: "planet-mint",
    position: [180, 40, 60],
    radius: 10,
    colorFrom: "custom",
    customColor: "#4dff9a",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#a8ffe0",
  },
  {
    id: "planet-ice",
    position: [-40, 70, -220],
    radius: 18,
    colorFrom: "custom",
    customColor: "#b8e8ff",
  },
  {
    id: "moon-ice-a",
    position: [-55, 78, -235],
    radius: 4,
    colorFrom: "custom",
    customColor: "#e8f4ff",
  },
  {
    id: "planet-rose",
    position: [220, 35, -150],
    radius: 11,
    colorFrom: "custom",
    customColor: "#ff7ab8",
  },
  {
    id: "planet-gold",
    position: [60, -20, 200],
    radius: 9,
    colorFrom: "custom",
    customColor: "#ffd24a",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#ffe9a8",
  },
  // Far systems
  {
    id: "planet-indigo",
    position: [-280, 90, -180],
    radius: 22,
    colorFrom: "custom",
    customColor: "#5a6bff",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#a0b0ff",
  },
  {
    id: "moon-indigo-a",
    position: [-305, 100, -165],
    radius: 5,
    colorFrom: "custom",
    customColor: "#9aa6ff",
  },
  {
    id: "moon-indigo-b",
    position: [-260, 85, -205],
    radius: 3.5,
    colorFrom: "custom",
    customColor: "#c8cfff",
  },
  {
    id: "planet-crimson",
    position: [310, 60, 120],
    radius: 15,
    colorFrom: "custom",
    customColor: "#ff3d5a",
  },
  {
    id: "planet-teal",
    position: [140, 110, -320],
    radius: 20,
    colorFrom: "custom",
    customColor: "#2ee6c5",
    ring: true,
    ringColorFrom: "brandSecondary",
  },
  {
    id: "planet-sand",
    position: [-200, 30, 280],
    radius: 13,
    colorFrom: "custom",
    customColor: "#e8c090",
  },
  {
    id: "planet-plasma",
    position: [40, 140, 350],
    radius: 17,
    colorFrom: "custom",
    customColor: "#ff5ed8",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#52f0ff",
  },
  // Deep frontier
  {
    id: "planet-giant",
    position: [-420, 80, -380],
    radius: 36,
    colorFrom: "custom",
    customColor: "#6a4cff",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#ffc86a",
  },
  {
    id: "moon-giant-a",
    position: [-470, 95, -360],
    radius: 7,
    colorFrom: "custom",
    customColor: "#c9b8ff",
  },
  {
    id: "moon-giant-b",
    position: [-390, 70, -420],
    radius: 5,
    colorFrom: "custom",
    customColor: "#ffe0a0",
  },
  {
    id: "planet-hollow",
    position: [480, 50, -280],
    radius: 24,
    colorFrom: "custom",
    customColor: "#3a5068",
  },
  {
    id: "planet-binary-a",
    position: [360, -40, 400],
    radius: 12,
    colorFrom: "brand",
  },
  {
    id: "planet-binary-b",
    position: [390, -25, 420],
    radius: 8,
    colorFrom: "brandSecondary",
  },
  {
    id: "planet-frost",
    position: [-500, 120, 200],
    radius: 19,
    colorFrom: "custom",
    customColor: "#d0fff0",
    ring: true,
    ringColorFrom: "custom",
    customRingColor: "#ffffff",
  },
  {
    id: "planet-obsidian",
    position: [200, 160, 520],
    radius: 14,
    colorFrom: "custom",
    customColor: "#2a1838",
  },
  {
    id: "planet-sol",
    position: [-100, 200, -550],
    radius: 28,
    colorFrom: "custom",
    customColor: "#ffe08a",
  },
];

export type SectionBannerDef = {
  id: string;
  title: string;
  subtitle: string;
  position: Vec3;
  yaw: number;
  accent: string;
};

/** Tall flags that label each district on the staging island. */
export const SECTION_BANNERS: SectionBannerDef[] = [
  {
    id: "banner-companies",
    title: "Companies",
    subtitle: "Career beacons",
    position: [-10, 0, -3],
    yaw: 0.25,
    accent: "#ff7a52",
  },
  {
    id: "banner-projects",
    title: "Projects",
    subtitle: "Featured builds",
    position: [20, 0, 4],
    yaw: -0.7,
    accent: "#5cefff",
  },
  {
    id: "banner-technologies",
    title: "Technologies",
    subtitle: "What I build with",
    position: [-22, 0, 2],
    yaw: 0.9,
    accent: "#4dff9a",
  },
  {
    id: "banner-contact",
    title: "Contact",
    subtitle: "Say hello",
    position: [-24, 0, 16],
    yaw: 0.4,
    accent: "#4ec8d4",
  },
  {
    id: "banner-resume",
    title: "Resume",
    subtitle: "Full CV",
    position: [10, 0, 18],
    yaw: -0.35,
    accent: "#e07050",
  },
  {
    id: "banner-playground",
    title: "Playground",
    subtitle: "Crates · bounce pads",
    position: [2, 0, 10],
    yaw: 0,
    accent: "#ffe08a",
  },
];

/** Authored playground layout — code-first island. */
export function buildPlaygroundLayout() {
  const companies = [...experience].reverse().map((job, i) => {
    const t = i / Math.max(1, experience.length - 1);
    const angle = -1.0 + t * 2.0;
    const r = 22;
    // Drive-height beacons — readable without jumping
    const position: Vec3 = [
      Math.sin(angle) * r - 8,
      1.85,
      -Math.cos(angle) * r - 4,
    ];
    return {
      id: `company-${job.id}`,
      kind: "company" as const,
      title: shortCompany(job.company),
      subtitle: job.role,
      body: job.dates,
      accent: FLIGHT_ACCENTS[i % FLIGHT_ACCENTS.length],
      position,
    } satisfies LandmarkDef;
  });

  const featured = projects.filter((p) => p.featured);
  const projectLandmarks = featured.map((project, i) => {
    const position: Vec3 = [24 + (i % 2) * 6, 1.85, -6 + Math.floor(i / 2) * 7];
    return {
      id: `project-${project.slug}`,
      kind: "project" as const,
      title: project.title,
      subtitle: project.company,
      body: project.metric,
      accent: FLIGHT_ACCENTS[(i + 3) % FLIGHT_ACCENTS.length],
      position,
      href: "url" in project ? project.url : undefined,
    } satisfies LandmarkDef;
  });

  // Technologies plaza — curated skill boxes
  const techPicks = [
    ...skills.frontend.slice(0, 5),
    ...skills.visualization.slice(0, 2),
    ...skills.tools.slice(0, 3),
  ];
  const skillLandmarks = techPicks.map((name, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const position: Vec3 = [-26 + col * 2.4, 1.7, -2 + row * 3.2];
    return {
      id: `skill-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      kind: "skill" as const,
      title: name,
      subtitle: "Technology",
      body: "A tool I use to ship product UI.",
      accent: FLIGHT_ACCENTS[(i + 1) % FLIGHT_ACCENTS.length],
      position,
    } satisfies LandmarkDef;
  });

  const landmarks: LandmarkDef[] = [
    ...companies,
    ...projectLandmarks,
    ...skillLandmarks,
    {
      id: "pad-contact",
      kind: "contact",
      title: "Contact",
      subtitle: "Say hello",
      body: "Leave the playground for the contact section.",
      accent: "#4ec8d4",
      position: [-26, 1.85, 14],
      href: "/#contact",
    },
    {
      id: "pad-resume",
      kind: "resume",
      title: "Resume",
      subtitle: "Full CV",
      body: "Open the resume page.",
      accent: "#e07050",
      position: [12, 1.85, 22],
      href: "/resume",
    },
    {
      id: "secret-fly",
      kind: "secret",
      title: "Hidden chord",
      subtitle: "fly",
      body: "Type fly on the homepage anytime.",
      accent: "#e8c547",
      position: [0, 2.5, -36],
    },
    {
      id: "secret-cave",
      kind: "secret",
      title: "Under island",
      subtitle: "Secret ledge",
      body: "You found the underside perch.",
      accent: "#5ecf8a",
      position: [-6, -1.2, 2],
    },
    {
      id: "secret-bonafide",
      kind: "secret",
      title: "Bonafide Losers",
      subtitle: "Side projects",
      body: "Five iOS puzzles under my own label.",
      accent: "#5ecf8a",
      position: [32, 4, 10],
      href: "https://bonafide-losers.vercel.app/apps",
    },
  ];

  const crates: CrateDef[] = [];
  for (let i = 0; i < 12; i += 1) {
    crates.push({
      id: `crate-${i}`,
      position: [-4 + (i % 4) * 1.4, 1.2 + Math.floor(i / 4) * 1.3, 8],
      size: [1.1, 1.1, 1.1],
    });
  }

  const pins: CrateDef[] = [];
  for (let i = 0; i < 6; i += 1) {
    pins.push({
      id: `pin-${i}`,
      position: [6 + (i % 3) * 1.2, 1.4, -2 - Math.floor(i / 3) * 1.2],
      size: [0.55, 1.6, 0.55],
    });
  }

  const coins: CoinDef[] = [
    { id: "coin-0", position: [0, 5, 16] },
    { id: "coin-1", position: [-12, 6, 0] },
    { id: "coin-2", position: [18, 5, -12] },
    { id: "coin-3", position: [-20, 4, -10] },
    { id: "coin-4", position: [8, 8, 4] },
    { id: "coin-5", position: [0, 4, -28] },
    { id: "coin-6", position: [28, 5, 4] },
    { id: "coin-7", position: [-28, 5, 8] },
  ];

  const bouncePads: BouncePadDef[] = [
    {
      id: "bounce-a",
      position: [4, 0.4, 12],
      size: [3, 0.4, 3],
      impulse: 18,
    },
    {
      id: "bounce-b",
      position: [-14, 0.4, -8],
      size: [3.5, 0.4, 3.5],
      impulse: 22,
    },
    {
      id: "bounce-c",
      position: [16, 0.4, 8],
      size: [3, 0.4, 3],
      impulse: 16,
    },
  ];

  return {
    landmarks,
    crates,
    pins,
    coins,
    bouncePads,
    spawn: SPAWN,
  };
}

export type PlaygroundLayout = ReturnType<typeof buildPlaygroundLayout>;
