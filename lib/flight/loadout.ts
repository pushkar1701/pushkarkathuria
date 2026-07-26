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
    sky: "#070612",
    skyHi: "#1a1540",
    ground: "#0e1020",
    fog: "#0a0818",
    brand: "#ff7a52",
    brandSecondary: "#5cefff",
    star: "#e8e4ff",
    grid: "#3a3560",
  },
  {
    id: "neon",
    label: "Neon dusk",
    sky: "#10051a",
    skyHi: "#4a1470",
    ground: "#180c28",
    fog: "#140820",
    brand: "#ff5ed8",
    brandSecondary: "#52f0ff",
    star: "#ffd0ff",
    grid: "#4a2870",
  },
  {
    id: "aurora",
    label: "Aurora",
    sky: "#031418",
    skyHi: "#0a4a48",
    ground: "#061c1c",
    fog: "#041414",
    brand: "#4dff9a",
    brandSecondary: "#4ef0ff",
    star: "#d0fff0",
    grid: "#1a4848",
  },
  {
    id: "ember",
    label: "Ember",
    sky: "#120806",
    skyHi: "#4a1c10",
    ground: "#1a0e0a",
    fog: "#100606",
    brand: "#ff6a3d",
    brandSecondary: "#ffd24a",
    star: "#ffe8d0",
    grid: "#4a2c18",
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
