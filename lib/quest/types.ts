export type QuestEvent =
  | { type: "section_enter"; sectionId: string }
  | { type: "project_group"; company: string }
  | { type: "experience_pin"; jobId: string }
  | { type: "experience_expand" }
  | { type: "contact_cta"; kind: "email" | "resume" | "linkedin" }
  | { type: "hero_path" };

export type QuestToast =
  | {
      id: string;
      kind: "achievement";
      title: string;
      description: string;
    }
  | {
      id: string;
      kind: "level_up";
      title: string;
      description: string;
    }
  | {
      id: string;
      kind: "quest_complete";
      title: string;
      description: string;
    };

export type QuestState = {
  xp: number;
  unlockedAchievements: string[];
  visitedSections: string[];
  visitedPins: string[];
  visitedProjectGroups: string[];
  expandedExperience: boolean;
  contactCta: boolean;
  heroPath: boolean;
  questComplete: boolean;
  skipped: boolean;
};

export type ApplyResult = {
  state: QuestState;
  toasts: QuestToast[];
  leveledUp: boolean;
  completedQuest: boolean;
};
