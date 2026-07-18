"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { questAchievements, questCopy } from "@/content/quest";
import { useQuest } from "@/components/quest/quest-provider";
import { cn } from "@/lib/utils";

export function QuestHud() {
  const {
    hydrated,
    state,
    level,
    levelProgress,
    overallProgress,
    achievementTotal,
    setSkipped,
  } = useQuest();
  const [open, setOpen] = useState(false);

  if (!hydrated || state.skipped) return null;

  const unlocked = state.unlockedAchievements.length;
  const nextName = levelProgress.next?.name;

  return (
    <div className="fixed right-2 bottom-2 z-50 w-[min(calc(100%-1rem),18.5rem)] sm:right-5 sm:bottom-5 sm:w-[min(100%-2.5rem,20rem)]">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-[0_0_40px_oklch(from_var(--brand)_l_c_h_/_0.1)] backdrop-blur-md",
          "transition-shadow",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset sm:gap-3 sm:px-3.5 sm:py-3"
          aria-expanded={open}
          aria-controls="quest-hud-panel"
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand sm:size-8">
            <Sparkles className="size-3.5 sm:size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {questCopy.hudLabel}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {unlocked}/{achievementTotal}
              </span>
            </span>
            <span className="mt-0.5 block truncate font-heading text-sm font-semibold">
              {level.name}
              {nextName ? (
                <span className="hidden font-normal text-muted-foreground sm:inline">
                  {" "}
                  → {nextName}
                </span>
              ) : null}
            </span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-border/80 sm:mt-2">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-brand to-brand-secondary transition-[width] duration-500"
                style={{
                  width: `${Math.round(
                    (state.questComplete
                      ? 1
                      : levelProgress.next
                        ? levelProgress.ratio
                        : overallProgress) * 100,
                  )}%`,
                }}
              />
            </span>
          </span>
          {open ? (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
          )}
        </button>

        {open && (
          <div
            id="quest-hud-panel"
            className="border-t border-border/70 px-3.5 pt-3 pb-3.5"
          >
            <p className="text-xs text-muted-foreground">{level.blurb}</p>

            <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {questAchievements.map((ach) => {
                const got = state.unlockedAchievements.includes(ach.id);
                return (
                  <li
                    key={ach.id}
                    className={cn(
                      "flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs",
                      got ? "bg-secondary/40" : "opacity-45",
                    )}
                  >
                    <span
                      className="mt-0.5 size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: got ? ach.accent : "var(--border)",
                      }}
                      aria-hidden
                    />
                    <span>
                      <span className="font-medium text-foreground">
                        {ach.title}
                      </span>
                      <span className="mt-0.5 block text-muted-foreground">
                        {ach.description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => setSkipped(true)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border/80 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <X className="size-3.5" aria-hidden />
              {questCopy.skipLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
