import { experience, hobbies, projects, skills, careerAchievements } from "@/content/site";
import { FLIGHT_ACCENTS } from "@/lib/flight/accents";

export type Vec3 = [number, number, number];

export type LandmarkDef = {
  id: string;
  kind:
    | "company"
    | "project"
    | "contact"
    | "resume"
    | "secret"
    | "skill"
    | "hobby"
    | "achievement";
  title: string;
  subtitle?: string;
  body?: string;
  accent: string;
  position: Vec3;
  href?: string;
  /** Which pit-stop bay this landmark belongs to (if any). */
  bayId?: BayId;
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
  // South straight of the oval, facing into the circuit
  position: [0, 4.2, 26],
  lookYaw: 0,
};

/** Leave staging when beyond this XZ distance from world origin. */
export const PLATFORM_RADIUS = 58;

/** Soft floor before auto-return. */
export const WORLD_FALL_Y = -320;

/** Outer roam limit — beyond this the craft respawns. */
export const GALAXY_HARD_VOID = 980;

/** Oval track centerline radii (x, z). */
export const CIRCUIT = {
  a: 30,
  b: 22,
  trackHalfWidth: 4.2,
} as const;

export type BayId =
  | "companies"
  | "technologies"
  | "projects"
  | "achievements"
  | "hobbies"
  | "contact"
  | "playground";

export type BayDef = {
  id: BayId;
  title: string;
  subtitle: string;
  blurb: string;
  accent: string;
  /** Exit mouth on the loop (flag + gate). */
  gate: Vec3;
  yaw: number;
  /** Bay pad center (sensor). */
  center: Vec3;
  padSize: Vec3;
  sensorRadius: number;
};

/** Point on the oval: θ=0 at +Z (south), CCW toward +X (east). */
export function circuitPoint(theta: number, radiusScale = 1): Vec3 {
  const a = CIRCUIT.a * radiusScale;
  const b = CIRCUIT.b * radiusScale;
  return [Math.sin(theta) * a, 0, Math.cos(theta) * b];
}

function outwardYaw(theta: number): number {
  // Face away from origin along the radial in XZ
  const [x, , z] = circuitPoint(theta);
  return Math.atan2(x, z);
}

function bayGrid(
  origin: Vec3,
  count: number,
  cols: number,
  gapX: number,
  gapZ: number,
  y = 1.85,
): Vec3[] {
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ox = ((cols - 1) * gapX) / 2;
    return [origin[0] + col * gapX - ox, y, origin[2] + row * gapZ] as Vec3;
  });
}

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

/**
 * Pit-stop exits around the oval (θ=0 south, CCW).
 * Bays sit outside the track; flags mark the exit mouths.
 */
export const CIRCUIT_BAYS: BayDef[] = [
  {
    id: "companies",
    title: "Companies",
    subtitle: "Career beacons",
    blurb: "Take this exit to tour every company stop on the career path.",
    accent: "#ff7a52",
    gate: [...circuitPoint((3 * Math.PI) / 2, 1.02)] as Vec3,
    yaw: outwardYaw((3 * Math.PI) / 2),
    center: [...circuitPoint((3 * Math.PI) / 2, 1.48)] as Vec3,
    padSize: [18, 0.55, 14],
    sensorRadius: 9,
  },
  {
    id: "technologies",
    title: "Technologies",
    subtitle: "What I build with",
    blurb: "Skills and tools — roll the bay to discover each stack piece.",
    accent: "#4dff9a",
    gate: [...circuitPoint(3.9, 1.02)] as Vec3,
    yaw: outwardYaw(3.9),
    center: [...circuitPoint(3.9, 1.45)] as Vec3,
    padSize: [16, 0.55, 12],
    sensorRadius: 8,
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Featured builds",
    blurb: "Featured product work — drive the pads for metrics and links.",
    accent: "#5cefff",
    gate: [...circuitPoint(Math.PI / 2, 1.02)] as Vec3,
    yaw: outwardYaw(Math.PI / 2),
    center: [...circuitPoint(Math.PI / 2, 1.45)] as Vec3,
    padSize: [16, 0.55, 14],
    sensorRadius: 8.5,
  },
  {
    id: "achievements",
    title: "Achievements",
    subtitle: "Recognition & milestones",
    blurb: "Career highlights — awards, exams, and apps that shipped in the real world.",
    accent: "#ffe08a",
    gate: [...circuitPoint(2.2, 1.02)] as Vec3,
    yaw: outwardYaw(2.2),
    center: [...circuitPoint(2.2, 1.42)] as Vec3,
    padSize: [14, 0.55, 12],
    sensorRadius: 8,
  },
  {
    id: "hobbies",
    title: "Hobbies",
    subtitle: "Off the clock",
    blurb: "Dancing, FIFA, football — and a side-quest for Bonafide Losers.",
    accent: "#ff7ab8",
    gate: [...circuitPoint(5.2, 1.02)] as Vec3,
    yaw: outwardYaw(5.2),
    center: [...circuitPoint(5.2, 1.45)] as Vec3,
    padSize: [14, 0.55, 12],
    sensorRadius: 8,
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Say hello · Resume",
    blurb: "Leave the playground for contact or open the full CV.",
    accent: "#4ec8d4",
    gate: [...circuitPoint(0.55, 1.02)] as Vec3,
    yaw: outwardYaw(0.55),
    center: [...circuitPoint(0.55, 1.4)] as Vec3,
    padSize: [12, 0.55, 10],
    sensorRadius: 7,
  },
  {
    id: "playground",
    title: "Playground",
    subtitle: "Crates · bounce · coins",
    blurb: "Smash toys and grab coins — then merge back onto the loop.",
    accent: "#e8c547",
    gate: [...circuitPoint(Math.PI, 1.02)] as Vec3,
    yaw: outwardYaw(Math.PI),
    center: [...circuitPoint(Math.PI, 1.4)] as Vec3,
    padSize: [16, 0.55, 14],
    sensorRadius: 8.5,
  },
];

/** Exit-mouth flags (same data the banners component renders). */
export const SECTION_BANNERS: SectionBannerDef[] = CIRCUIT_BAYS.map((bay) => ({
  id: `banner-${bay.id}`,
  title: bay.title,
  subtitle: `EXIT · ${bay.subtitle}`,
  position: [bay.gate[0], 0, bay.gate[2]],
  yaw: bay.yaw + Math.PI / 2,
  accent: bay.accent,
}));

/** Authored playground layout — oval circuit + pit-stop bays. */
export function buildPlaygroundLayout() {
  const companiesBay = CIRCUIT_BAYS.find((b) => b.id === "companies")!;
  const techBay = CIRCUIT_BAYS.find((b) => b.id === "technologies")!;
  const projectsBay = CIRCUIT_BAYS.find((b) => b.id === "projects")!;
  const achieveBay = CIRCUIT_BAYS.find((b) => b.id === "achievements")!;
  const hobbiesBay = CIRCUIT_BAYS.find((b) => b.id === "hobbies")!;
  const contactBay = CIRCUIT_BAYS.find((b) => b.id === "contact")!;
  const playBay = CIRCUIT_BAYS.find((b) => b.id === "playground")!;

  const companySlots = bayGrid(companiesBay.center, experience.length, 4, 3.2, 3.4);
  const companies = [...experience].reverse().map((job, i) => ({
    id: `company-${job.id}`,
    kind: "company" as const,
    title: shortCompany(job.company),
    subtitle: job.role,
    body: job.dates,
    accent: FLIGHT_ACCENTS[i % FLIGHT_ACCENTS.length],
    position: companySlots[i] ?? ([
      companiesBay.center[0],
      1.85,
      companiesBay.center[2],
    ] as Vec3),
    bayId: "companies" as const,
  })) satisfies LandmarkDef[];

  const projectSlots = bayGrid(
    projectsBay.center,
    projects.length,
    3,
    4.2,
    3.8,
  );
  const projectLandmarks = projects.map((project, i) => ({
    id: `project-${project.slug}`,
    kind: "project" as const,
    title: project.title,
    subtitle: project.company,
    body: project.metric,
    accent: FLIGHT_ACCENTS[(i + 3) % FLIGHT_ACCENTS.length],
    position: projectSlots[i]!,
    href: "url" in project ? project.url : undefined,
    bayId: "projects" as const,
  })) satisfies LandmarkDef[];

  const techPicks = [
    ...skills.frontend.slice(0, 5),
    ...skills.visualization.slice(0, 2),
    ...skills.tools.slice(0, 3),
  ];
  const skillSlots = bayGrid(techBay.center, techPicks.length, 5, 2.6, 3.0, 1.7);
  const skillLandmarks = techPicks.map((name, i) => ({
    id: `skill-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    kind: "skill" as const,
    title: name,
    subtitle: "Technology",
    body: "A tool I use to ship product UI.",
    accent: FLIGHT_ACCENTS[(i + 1) % FLIGHT_ACCENTS.length],
    position: skillSlots[i]!,
    bayId: "technologies" as const,
  })) satisfies LandmarkDef[];

  const achieveSlots = bayGrid(
    achieveBay.center,
    careerAchievements.length,
    2,
    4.5,
    4,
  );
  const achievementLandmarks = careerAchievements.map((a, i) => ({
    id: `career-${a.id}`,
    kind: "achievement" as const,
    title: a.title,
    subtitle: a.subtitle,
    body: a.body,
    accent: FLIGHT_ACCENTS[(i + 4) % FLIGHT_ACCENTS.length],
    position: achieveSlots[i]!,
    bayId: "achievements" as const,
  })) satisfies LandmarkDef[];

  const hobbySlots = bayGrid(hobbiesBay.center, hobbies.length + 1, 2, 4.2, 3.8);
  const hobbyLandmarks = hobbies.map((h, i) => ({
    id: `hobby-${h.id}`,
    kind: "hobby" as const,
    title: h.title,
    subtitle: h.subtitle,
    body: h.body,
    accent: FLIGHT_ACCENTS[(i + 2) % FLIGHT_ACCENTS.length],
    position: hobbySlots[i]!,
    bayId: "hobbies" as const,
  })) satisfies LandmarkDef[];

  const landmarks: LandmarkDef[] = [
    ...companies,
    ...projectLandmarks,
    ...skillLandmarks,
    ...achievementLandmarks,
    ...hobbyLandmarks,
    {
      id: "hobby-bonafide",
      kind: "hobby",
      title: "Bonafide Losers",
      subtitle: "Side quest",
      body: "Five iOS puzzles under my own label.",
      accent: "#5ecf8a",
      position: hobbySlots[hobbies.length]!,
      href: "https://bonafide-losers.vercel.app/apps",
      bayId: "hobbies",
    },
    {
      id: "pad-contact",
      kind: "contact",
      title: "Contact",
      subtitle: "Say hello",
      body: "Leave the playground for the contact section.",
      accent: "#4ec8d4",
      position: [
        contactBay.center[0] - 2.5,
        1.85,
        contactBay.center[2],
      ],
      href: "/#contact",
      bayId: "contact",
    },
    {
      id: "pad-resume",
      kind: "resume",
      title: "Resume",
      subtitle: "Full CV",
      body: "Open the resume page.",
      accent: "#e07050",
      position: [
        contactBay.center[0] + 2.5,
        1.85,
        contactBay.center[2],
      ],
      href: "/resume",
      bayId: "contact",
    },
    {
      id: "secret-fly",
      kind: "secret",
      title: "Hidden chord",
      subtitle: "fly",
      body: "Type fly on the homepage anytime.",
      accent: "#e8c547",
      position: [0, 1.6, 0],
    },
    {
      id: "secret-cave",
      kind: "secret",
      title: "Under island",
      subtitle: "Secret ledge",
      body: "You found the underside perch.",
      accent: "#5ecf8a",
      position: [0, -1.2, 8],
    },
  ];

  const crates: CrateDef[] = [];
  for (let i = 0; i < 12; i += 1) {
    crates.push({
      id: `crate-${i}`,
      position: [
        playBay.center[0] - 4 + (i % 4) * 1.4,
        1.2 + Math.floor(i / 4) * 1.3,
        playBay.center[2] - 2,
      ],
      size: [1.1, 1.1, 1.1],
    });
  }

  const pins: CrateDef[] = [];
  for (let i = 0; i < 6; i += 1) {
    pins.push({
      id: `pin-${i}`,
      position: [
        playBay.center[0] + 2 + (i % 3) * 1.2,
        1.4,
        playBay.center[2] + 2 - Math.floor(i / 3) * 1.2,
      ],
      size: [0.55, 1.6, 0.55],
    });
  }

  const coins: CoinDef[] = [
    { id: "coin-0", position: [0, 3.5, 26] },
    { id: "coin-1", position: [...circuitPoint(0.8, 1.0)].map((v, i) => (i === 1 ? 3.2 : v)) as Vec3 },
    { id: "coin-2", position: [...circuitPoint(2.0, 1.0)].map((v, i) => (i === 1 ? 3.2 : v)) as Vec3 },
    { id: "coin-3", position: [...circuitPoint(3.5, 1.0)].map((v, i) => (i === 1 ? 3.2 : v)) as Vec3 },
    { id: "coin-4", position: [...circuitPoint(4.8, 1.0)].map((v, i) => (i === 1 ? 3.2 : v)) as Vec3 },
    {
      id: "coin-5",
      position: [playBay.center[0], 4, playBay.center[2]],
    },
    {
      id: "coin-6",
      position: [companiesBay.center[0], 4, companiesBay.center[2]],
    },
    {
      id: "coin-7",
      position: [projectsBay.center[0], 4, projectsBay.center[2]],
    },
  ];

  const bouncePads: BouncePadDef[] = [
    {
      id: "bounce-a",
      position: [playBay.center[0] - 5, 0.4, playBay.center[2] + 3],
      size: [3, 0.4, 3],
      impulse: 18,
    },
    {
      id: "bounce-b",
      position: [playBay.center[0] + 5, 0.4, playBay.center[2] - 2],
      size: [3.5, 0.4, 3.5],
      impulse: 22,
    },
  ];

  return {
    landmarks,
    crates,
    pins,
    coins,
    bouncePads,
    bays: CIRCUIT_BAYS,
    spawn: SPAWN,
  };
}

export type PlaygroundLayout = ReturnType<typeof buildPlaygroundLayout>;
