"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useQuest } from "@/components/quest/quest-provider";
import { cn } from "@/lib/utils";

export function QuestToast() {
  const { state, toasts, dismissToast, reducedMotion } = useQuest();
  const active = toasts[0];

  useEffect(() => {
    if (!active || state.skipped) return;
    const timer = window.setTimeout(
      () => dismissToast(active.id),
      reducedMotion ? 2200 : 3400,
    );
    return () => window.clearTimeout(timer);
  }, [active, dismissToast, reducedMotion, state.skipped]);

  if (state.skipped) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-20 left-4 right-4 z-[60] flex justify-center sm:bottom-6 sm:left-auto sm:right-24 sm:justify-end"
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            role="status"
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 380, damping: 28 }
            }
            className={cn(
              "pointer-events-auto max-w-sm rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur-md",
              active.kind === "quest_complete" && "border-brand/50",
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
              {active.kind === "achievement"
                ? "Achievement"
                : active.kind === "level_up"
                  ? "Stage up"
                  : "Quest"}
            </p>
            <p className="mt-1 font-heading text-sm font-semibold">
              {active.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {active.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
