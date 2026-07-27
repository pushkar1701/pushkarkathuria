export type AchievementId =
  | "first-flight"
  | "company-tour"
  | "project-scout"
  | "crate-chaos"
  | "secret-hunter"
  | "coin-collector"
  | "contact-call"
  | "lap-ish";

export type AchievementDef = {
  id: AchievementId;
  title: string;
  description: string;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-flight",
    title: "Ignition",
    description: "Launch into the playground.",
  },
  {
    id: "company-tour",
    title: "Career tour",
    description: "Discover every company beacon.",
  },
  {
    id: "project-scout",
    title: "Project scout",
    description: "Visit every project pad.",
  },
  {
    id: "crate-chaos",
    title: "Crate chaos",
    description: "Smash or topple 8 crates/pins.",
  },
  {
    id: "secret-hunter",
    title: "Secret hunter",
    description: "Find every secret.",
  },
  {
    id: "coin-collector",
    title: "Coin pocket",
    description: "Collect 5 coins.",
  },
  {
    id: "contact-call",
    title: "Open channel",
    description: "Reach the Contact bay.",
  },
  {
    id: "lap-ish",
    title: "Island hopper",
    description: "Respawn after exploring (press R once airborne).",
  },
];
