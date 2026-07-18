export const QUEST_STORAGE_KEY = "pk-career-quest-v1";

export const questLevels = [
  {
    id: "support",
    name: "Support",
    minXp: 0,
    blurb: "Every career starts somewhere.",
  },
  {
    id: "engineer",
    name: "Engineer",
    minXp: 50,
    blurb: "You're shipping and exploring the craft.",
  },
  {
    id: "consultant",
    name: "Consultant",
    minXp: 110,
    blurb: "Programs, clients, and delivery at scale.",
  },
  {
    id: "lead",
    name: "Lead",
    minXp: 180,
    blurb: "Systems, mentoring, and ownership.",
  },
  {
    id: "architect",
    name: "Architect",
    minXp: 250,
    blurb: "Career Quest complete — the full tour.",
  },
] as const;

export type QuestLevelId = (typeof questLevels)[number]["id"];

/** XP granted once per trigger key. */
export const questXp = {
  section: 10,
  projectGroup: 15,
  experiencePin: 15,
  experienceExpand: 25,
  contactCta: 30,
  heroPath: 10,
} as const;

export const questAchievements = [
  {
    id: "first-impression",
    title: "First impression",
    description: "You made it to About.",
    accent: "var(--brand)",
  },
  {
    id: "portfolio-scout",
    title: "Portfolio scout",
    description: "Explored projects across two companies.",
    accent: "oklch(0.8 0.14 85)",
  },
  {
    id: "career-cartographer",
    title: "Career cartographer",
    description: "Visited four stops on the Experience path.",
    accent: "var(--brand-secondary)",
  },
  {
    id: "deep-dive",
    title: "Deep dive",
    description: "Opened the highlights on a role.",
    accent: "oklch(0.76 0.13 155)",
  },
  {
    id: "toolbelt",
    title: "Toolbelt unlocked",
    description: "Checked the Skills section.",
    accent: "var(--brand)",
  },
  {
    id: "receipts",
    title: "Receipts collected",
    description: "Saw Recognition and Education.",
    accent: "oklch(0.8 0.14 85)",
  },
  {
    id: "ready-to-talk",
    title: "Ready to talk",
    description: "Reached out via Contact.",
    accent: "var(--brand-secondary)",
  },
  {
    id: "quest-complete",
    title: "Career Quest complete",
    description: "You finished the full tour.",
    accent: "oklch(0.76 0.13 155)",
  },
] as const;

export type AchievementId = (typeof questAchievements)[number]["id"];

export const questCopy = {
  hudLabel: "Career Quest",
  skipLabel: "Skip quest",
  resumeLabel: "Resume quest",
  heroNudge:
    "There's a Career Quest as you explore — or ignore it and keep scrolling.",
  contactComplete:
    "Career Quest complete — say hi if you want the next chapter.",
  levelUpTitle: "Stage unlocked",
  toastFallback: "Progress saved",
} as const;

/** Max XP used for the HUD bar (Architect threshold). */
export const questMaxXp = questLevels[questLevels.length - 1].minXp;
