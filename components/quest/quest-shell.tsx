"use client";

import type { ReactNode } from "react";
import { QuestHud } from "@/components/quest/quest-hud";
import { QuestProvider } from "@/components/quest/quest-provider";
import { QuestToast } from "@/components/quest/quest-toast";

export function QuestShell({ children }: { children: ReactNode }) {
  return (
    <QuestProvider>
      {children}
      <QuestHud />
      <QuestToast />
    </QuestProvider>
  );
}
