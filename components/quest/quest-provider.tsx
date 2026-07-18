"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { QUEST_STORAGE_KEY, questAchievements } from "@/content/quest";
import {
  applyQuestEvent,
  createInitialQuestState,
  getLevelForXp,
  getLevelProgress,
  getOverallProgress,
  parseQuestState,
  serializeQuestState,
} from "@/lib/quest/engine";
import type { QuestEvent, QuestState, QuestToast } from "@/lib/quest/types";

type QuestContextValue = {
  hydrated: boolean;
  state: QuestState;
  toasts: QuestToast[];
  reducedMotion: boolean;
  level: ReturnType<typeof getLevelForXp>;
  levelProgress: ReturnType<typeof getLevelProgress>;
  overallProgress: number;
  achievementTotal: number;
  emit: (event: QuestEvent) => void;
  dismissToast: (id: string) => void;
  setSkipped: (skipped: boolean) => void;
};

const QuestContext = createContext<QuestContextValue | null>(null);

export function QuestProvider({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<QuestState>(() => createInitialQuestState());
  const [toasts, setToasts] = useState<QuestToast[]>([]);

  useEffect(() => {
    const stored = parseQuestState(
      typeof window !== "undefined"
        ? window.localStorage.getItem(QUEST_STORAGE_KEY)
        : null,
    );
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(QUEST_STORAGE_KEY, serializeQuestState(state));
  }, [state, hydrated]);

  const emit = useCallback((event: QuestEvent) => {
    setState((prev) => {
      const result = applyQuestEvent(prev, event);
      if (result.toasts.length > 0 && !result.state.skipped) {
        queueMicrotask(() => {
          setToasts((current) => {
            const merged = [...current, ...result.toasts];
            return merged.slice(-4);
          });
        });
      }
      return result.state;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const setSkipped = useCallback((skipped: boolean) => {
    setState((prev) => ({ ...prev, skipped }));
    if (skipped) setToasts([]);
  }, []);

  const value = useMemo<QuestContextValue>(() => {
    const level = getLevelForXp(state.xp);
    return {
      hydrated,
      state,
      toasts,
      reducedMotion: Boolean(shouldReduceMotion),
      level,
      levelProgress: getLevelProgress(state.xp),
      overallProgress: getOverallProgress(state.xp),
      achievementTotal: questAchievements.length,
      emit,
      dismissToast,
      setSkipped,
    };
  }, [
    hydrated,
    state,
    toasts,
    shouldReduceMotion,
    emit,
    dismissToast,
    setSkipped,
  ]);

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
}

export function useQuest() {
  const ctx = useContext(QuestContext);
  if (!ctx) {
    throw new Error("useQuest must be used within QuestProvider");
  }
  return ctx;
}

/** Safe for sections that may render outside the provider (e.g. tests). */
export function useQuestOptional() {
  return useContext(QuestContext);
}
