import {
  questAchievements,
  questCopy,
  questLevels,
  questMaxXp,
  questXp,
} from "@/content/quest";
import type {
  ApplyResult,
  QuestEvent,
  QuestState,
  QuestToast,
} from "@/lib/quest/types";

export function createInitialQuestState(
  overrides: Partial<QuestState> = {},
): QuestState {
  return {
    xp: 0,
    unlockedAchievements: [],
    visitedSections: [],
    visitedPins: [],
    visitedProjectGroups: [],
    expandedExperience: false,
    contactCta: false,
    heroPath: false,
    questComplete: false,
    skipped: false,
    ...overrides,
  };
}

export function getLevelForXp(xp: number) {
  let current: (typeof questLevels)[number] = questLevels[0];
  for (const level of questLevels) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function getNextLevel(xp: number) {
  const current = getLevelForXp(xp);
  const index = questLevels.findIndex((l) => l.id === current.id);
  return questLevels[index + 1] ?? null;
}

export function getLevelProgress(xp: number) {
  const current = getLevelForXp(xp);
  const next = getNextLevel(xp);
  if (!next) {
    return { current, next: null, ratio: 1, intoLevel: 0, needed: 0 };
  }
  const span = next.minXp - current.minXp;
  const intoLevel = xp - current.minXp;
  return {
    current,
    next,
    ratio: Math.min(1, Math.max(0, intoLevel / span)),
    intoLevel,
    needed: span,
  };
}

export function getOverallProgress(xp: number) {
  return Math.min(1, Math.max(0, xp / questMaxXp));
}

function unlockAchievement(
  state: QuestState,
  id: string,
  toasts: QuestToast[],
) {
  if (state.unlockedAchievements.includes(id)) return state;
  const def = questAchievements.find((a) => a.id === id);
  if (!def) return state;

  const next = {
    ...state,
    unlockedAchievements: [...state.unlockedAchievements, id],
  };
  toasts.push({
    id: `ach-${id}-${Date.now()}`,
    kind: "achievement",
    title: def.title,
    description: def.description,
  });
  return next;
}

function addXp(state: QuestState, amount: number, toasts: QuestToast[]) {
  if (amount <= 0) return state;
  const prevLevel = getLevelForXp(state.xp);
  const xp = Math.min(questMaxXp + 40, state.xp + amount);
  let next = { ...state, xp };
  const newLevel = getLevelForXp(xp);

  if (newLevel.id !== prevLevel.id) {
    toasts.push({
      id: `lvl-${newLevel.id}-${Date.now()}`,
      kind: "level_up",
      title: `${questCopy.levelUpTitle}: ${newLevel.name}`,
      description: newLevel.blurb,
    });
  }

  if (xp >= questMaxXp && !next.questComplete) {
    next = { ...next, questComplete: true };
    next = unlockAchievement(next, "quest-complete", toasts);
    toasts.push({
      id: `complete-${Date.now()}`,
      kind: "quest_complete",
      title: questCopy.contactComplete.split(" — ")[0] ?? "Career Quest complete",
      description: questCopy.contactComplete,
    });
  }

  return next;
}

function evaluateAchievements(state: QuestState, toasts: QuestToast[]) {
  let next = state;

  if (next.visitedSections.includes("about")) {
    next = unlockAchievement(next, "first-impression", toasts);
  }
  if (next.visitedProjectGroups.length >= 2) {
    next = unlockAchievement(next, "portfolio-scout", toasts);
  }
  if (next.visitedPins.length >= 4) {
    next = unlockAchievement(next, "career-cartographer", toasts);
  }
  if (next.expandedExperience) {
    next = unlockAchievement(next, "deep-dive", toasts);
  }
  if (next.visitedSections.includes("skills")) {
    next = unlockAchievement(next, "toolbelt", toasts);
  }
  if (next.visitedSections.includes("recognition")) {
    next = unlockAchievement(next, "receipts", toasts);
  }
  if (next.contactCta) {
    next = unlockAchievement(next, "ready-to-talk", toasts);
  }

  return next;
}

export function applyQuestEvent(
  state: QuestState,
  event: QuestEvent,
): ApplyResult {
  if (state.skipped) {
    return { state, toasts: [], leveledUp: false, completedQuest: false };
  }

  const toasts: QuestToast[] = [];
  const prevLevelId = getLevelForXp(state.xp).id;
  const wasComplete = state.questComplete;
  let next = state;
  let gained = 0;

  switch (event.type) {
    case "section_enter": {
      if (next.visitedSections.includes(event.sectionId)) break;
      next = {
        ...next,
        visitedSections: [...next.visitedSections, event.sectionId],
      };
      gained = questXp.section;
      break;
    }
    case "project_group": {
      if (next.visitedProjectGroups.includes(event.company)) break;
      next = {
        ...next,
        visitedProjectGroups: [...next.visitedProjectGroups, event.company],
      };
      gained = questXp.projectGroup;
      break;
    }
    case "experience_pin": {
      if (next.visitedPins.includes(event.jobId)) break;
      next = {
        ...next,
        visitedPins: [...next.visitedPins, event.jobId],
      };
      gained = questXp.experiencePin;
      break;
    }
    case "experience_expand": {
      if (next.expandedExperience) break;
      next = { ...next, expandedExperience: true };
      gained = questXp.experienceExpand;
      break;
    }
    case "contact_cta": {
      if (next.contactCta) break;
      next = { ...next, contactCta: true };
      gained = questXp.contactCta;
      break;
    }
    case "hero_path": {
      if (next.heroPath) break;
      next = { ...next, heroPath: true };
      gained = questXp.heroPath;
      break;
    }
    default:
      break;
  }

  if (gained > 0) {
    next = addXp(next, gained, toasts);
  }

  next = evaluateAchievements(next, toasts);

  // Deduplicate achievement toasts if quest-complete also unlocked via XP path
  const seen = new Set<string>();
  const uniqueToasts = toasts.filter((t) => {
    const key =
      t.kind === "achievement"
        ? `a:${t.title}`
        : t.kind === "level_up"
          ? `l:${t.title}`
          : `c:${t.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    state: next,
    toasts: uniqueToasts,
    leveledUp: getLevelForXp(next.xp).id !== prevLevelId,
    completedQuest: next.questComplete && !wasComplete,
  };
}

export function serializeQuestState(state: QuestState): string {
  return JSON.stringify(state);
}

export function parseQuestState(raw: string | null): QuestState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<QuestState>;
    return createInitialQuestState({
      xp: typeof data.xp === "number" ? data.xp : 0,
      unlockedAchievements: Array.isArray(data.unlockedAchievements)
        ? data.unlockedAchievements.filter((x): x is string => typeof x === "string")
        : [],
      visitedSections: Array.isArray(data.visitedSections)
        ? data.visitedSections.filter((x): x is string => typeof x === "string")
        : [],
      visitedPins: Array.isArray(data.visitedPins)
        ? data.visitedPins.filter((x): x is string => typeof x === "string")
        : [],
      visitedProjectGroups: Array.isArray(data.visitedProjectGroups)
        ? data.visitedProjectGroups.filter((x): x is string => typeof x === "string")
        : [],
      expandedExperience: Boolean(data.expandedExperience),
      contactCta: Boolean(data.contactCta),
      heroPath: Boolean(data.heroPath),
      questComplete: Boolean(data.questComplete),
      skipped: Boolean(data.skipped),
    });
  } catch {
    return null;
  }
}
