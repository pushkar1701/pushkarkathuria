"use client";

import { useEffect, useRef } from "react";
import { useQuestOptional } from "@/components/quest/quest-provider";
import type { QuestEvent } from "@/lib/quest/types";

/**
 * Observes an element by DOM id and emits a one-time section_enter when it enters view.
 * Safe to drop into server-rendered sections as a child.
 */
export function QuestSectionTracker({ sectionId }: { sectionId: string }) {
  useQuestElementEvent(sectionId, () => ({
    type: "section_enter",
    sectionId,
  }));
  return null;
}

export function QuestGroupTracker({
  company,
  elementId,
}: {
  company: string;
  elementId: string;
}) {
  useQuestElementEvent(elementId, () => ({
    type: "project_group",
    company,
  }));
  return null;
}

function useQuestElementEvent(
  elementId: string,
  buildEvent: () => QuestEvent,
) {
  const quest = useQuestOptional();
  const fired = useRef(false);
  const buildRef = useRef(buildEvent);
  buildRef.current = buildEvent;

  useEffect(() => {
    fired.current = false;
  }, [elementId]);

  const emit = quest?.emit;
  const skipped = quest?.state.skipped ?? false;

  useEffect(() => {
    if (!emit || skipped) return;
    const el = document.getElementById(elementId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || fired.current) return;
        fired.current = true;
        emit(buildRef.current());
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [emit, skipped, elementId]);
}
