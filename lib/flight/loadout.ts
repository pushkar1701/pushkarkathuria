export type SkyId = "midnight" | "neon" | "aurora" | "ember";
export type CraftId = "dart" | "rocket" | "scout";

export type SkyTheme = {
  id: SkyId;
  label: string;
  sky: string;
  skyHi: string;
  ground: string;
  fog: string;
  brand: string;
  brandSecondary: string;
  star: string;
  grid: string;
};

export type CraftDef = {
  id: CraftId;
  label: string;
  body: string;
  accent: string;
  trail: string;
  kind: "dart" | "rocket" | "scout";
};

export const SKY_THEMES: SkyTheme[] = [
  {
    id: "midnight",
    label: "Midnight",
    sky: "#0c0b14",
    skyHi: "#16132a",
    ground: "#12101c",
    fog: "#0c0b14",
    brand: "#e07050",
    brandSecondary: "#4ec8d4",
    star: "#d8d4ec",
    grid: "#2a2640",
  },
  {
    id: "neon",
    label: "Neon dusk",
    sky: "#12081c",
    skyHi: "#3a1058",
    ground: "#1a0f28",
    fog: "#180a22",
    brand: "#ff5cc8",
    brandSecondary: "#5ce1ff",
    star: "#f0c8ff",
    grid: "#3a2058",
  },
  {
    id: "aurora",
    label: "Aurora",
    sky: "#06141a",
    skyHi: "#0a3a3a",
    ground: "#0a1818",
    fog: "#061414",
    brand: "#5ecf8a",
    brandSecondary: "#4ec8d4",
    star: "#c8f0e0",
    grid: "#1a3a38",
  },
  {
    id: "ember",
    label: "Ember",
    sky: "#140a08",
    skyHi: "#3a1810",
    ground: "#1a100c",
    fog: "#120808",
    brand: "#e07050",
    brandSecondary: "#e8c547",
    star: "#f0dcc8",
    grid: "#3a2418",
  },
];

export const CRAFTS: CraftDef[] = [
  {
    id: "dart",
    label: "Dart",
    body: "#f0ece4",
    accent: "#4ec8d4",
    trail: "#4ec8d4",
    kind: "dart",
  },
  {
    id: "rocket",
    label: "Rocket",
    body: "#e8e4f0",
    accent: "#e07050",
    trail: "#e07050",
    kind: "rocket",
  },
  {
    id: "scout",
    label: "Scout",
    body: "#e8f0e4",
    accent: "#5ecf8a",
    trail: "#5ecf8a",
    kind: "scout",
  },
];

export function getSkyTheme(id: SkyId): SkyTheme {
  return SKY_THEMES.find((s) => s.id === id) ?? SKY_THEMES[0];
}

export function getCraft(id: CraftId): CraftDef {
  return CRAFTS.find((c) => c.id === id) ?? CRAFTS[0];
}
