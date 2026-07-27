"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACHIEVEMENTS,
  type AchievementId,
} from "@/lib/flight-world/achievements";
import {
  buildPlaygroundLayout,
  type BayDef,
  type LandmarkDef,
  type PlaygroundLayout,
} from "@/lib/flight-world/layout";
import {
  getFlightMuted,
  playSfx,
  setFlightMuted,
} from "./audio";

const ACH_KEY = "flight-achievements";

type FlightWorldStore = {
  layout: PlaygroundLayout;
  phase: "hangar" | "playing";
  setPhase: (p: "hangar" | "playing") => void;
  discovered: Set<string>;
  discover: (id: string) => void;
  nearLandmark: LandmarkDef | null;
  setNearId: (id: string | null) => void;
  /** Dismiss the near card only if it still shows this landmark. */
  clearNearIf: (id: string) => void;
  activeBay: BayDef | null;
  setActiveBayId: (id: string | null) => void;
  clearBayIf: (id: string) => void;
  collected: Set<string>;
  collect: (id: string) => void;
  smashed: number;
  registerSmash: () => void;
  respawnToken: number;
  respawn: () => void;
  farFromPlatform: boolean;
  setFarFromPlatform: (value: boolean) => void;
  muted: boolean;
  toggleMute: () => void;
  mapOpen: boolean;
  setMapOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  optionsOpen: boolean;
  setOptionsOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  unlocked: Set<AchievementId>;
  quality: "high" | "low";
  setQuality: (q: "high" | "low") => void;
};

const Ctx = createContext<FlightWorldStore | null>(null);

function loadAchievements(): Set<AchievementId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(ACH_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as AchievementId[]);
  } catch {
    return new Set();
  }
}

function saveAchievements(set: Set<AchievementId>) {
  try {
    localStorage.setItem(ACH_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

function evaluateUnlocks(args: {
  layout: PlaygroundLayout;
  discovered: Set<string>;
  collected: Set<string>;
  smashed: number;
  hasRespawned: boolean;
  phase: "hangar" | "playing";
  unlocked: Set<AchievementId>;
}): Set<AchievementId> | null {
  const next = new Set(args.unlocked);
  let changed = false;
  const grant = (id: AchievementId) => {
    if (!next.has(id)) {
      next.add(id);
      changed = true;
    }
  };

  if (args.phase === "playing") grant("first-flight");

  const companies = args.layout.landmarks.filter(
    (l) => l.kind === "company" && l.bayId === "companies",
  );
  if (
    companies.length &&
    companies.every((c) => args.discovered.has(c.id))
  ) {
    grant("company-tour");
  }

  const projects = args.layout.landmarks.filter((l) => l.kind === "project");
  if (projects.length && projects.every((p) => args.discovered.has(p.id))) {
    grant("project-scout");
  }

  const secrets = args.layout.landmarks.filter((l) => l.kind === "secret");
  if (secrets.every((s) => args.discovered.has(s.id))) grant("secret-hunter");

  if (args.discovered.has("pad-contact")) grant("contact-call");
  if (args.collected.size >= 5) grant("coin-collector");
  if (args.smashed >= 8) grant("crate-chaos");
  if (args.hasRespawned) grant("lap-ish");

  return changed ? next : null;
}

export function FlightWorldProvider({ children }: { children: ReactNode }) {
  const layout = useMemo(() => buildPlaygroundLayout(), []);
  const [phase, setPhaseState] = useState<"hangar" | "playing">("hangar");
  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set());
  const [nearId, setNearIdState] = useState<string | null>(null);
  const [activeBayId, setActiveBayIdState] = useState<string | null>(null);
  const [collected, setCollected] = useState<Set<string>>(() => new Set());
  const [smashed, setSmashed] = useState(0);
  const [respawnToken, setRespawnToken] = useState(0);
  const [farFromPlatform, setFarFromPlatform] = useState(false);
  const [muted, setMuted] = useState(() => getFlightMuted());
  const [mapOpen, setMapOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(loadAchievements);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [hasRespawned, setHasRespawned] = useState(false);

  const applyUnlocks = useCallback(
    (snapshot: {
      discovered: Set<string>;
      collected: Set<string>;
      smashed: number;
      hasRespawned: boolean;
      phase: "hangar" | "playing";
    }) => {
      setUnlocked((prev) => {
        const result = evaluateUnlocks({
          layout,
          unlocked: prev,
          ...snapshot,
        });
        if (!result) return prev;
        saveAchievements(result);
        playSfx("ui");
        return result;
      });
    },
    [layout],
  );

  const setPhase = useCallback(
    (p: "hangar" | "playing") => {
      setPhaseState(p);
      applyUnlocks({
        discovered,
        collected,
        smashed,
        hasRespawned,
        phase: p,
      });
    },
    [applyUnlocks, discovered, collected, smashed, hasRespawned],
  );

  const discover = useCallback(
    (id: string) => {
      setDiscovered((prev) => {
        if (prev.has(id)) return prev;
        playSfx("discover");
        const next = new Set(prev).add(id);
        queueMicrotask(() =>
          applyUnlocks({
            discovered: next,
            collected,
            smashed,
            hasRespawned,
            phase,
          }),
        );
        return next;
      });
    },
    [applyUnlocks, collected, smashed, hasRespawned, phase],
  );

  const setNearId = useCallback((id: string | null) => {
    setNearIdState(id);
  }, []);

  const clearNearIf = useCallback((id: string) => {
    setNearIdState((current) => (current === id ? null : current));
  }, []);

  const setActiveBayId = useCallback((id: string | null) => {
    setActiveBayIdState(id);
  }, []);

  const clearBayIf = useCallback((id: string) => {
    setActiveBayIdState((current) => (current === id ? null : current));
  }, []);

  const collect = useCallback(
    (id: string) => {
      setCollected((prev) => {
        if (prev.has(id)) return prev;
        playSfx("collect");
        const next = new Set(prev).add(id);
        queueMicrotask(() =>
          applyUnlocks({
            discovered,
            collected: next,
            smashed,
            hasRespawned,
            phase,
          }),
        );
        return next;
      });
    },
    [applyUnlocks, discovered, smashed, hasRespawned, phase],
  );

  const registerSmash = useCallback(() => {
    setSmashed((n) => {
      const next = n + 1;
      playSfx("crash");
      queueMicrotask(() =>
        applyUnlocks({
          discovered,
          collected,
          smashed: next,
          hasRespawned,
          phase,
        }),
      );
      return next;
    });
  }, [applyUnlocks, discovered, collected, hasRespawned, phase]);

  const respawn = useCallback(() => {
    setRespawnToken((n) => n + 1);
    setNearIdState(null);
    setActiveBayIdState(null);
    setFarFromPlatform(false);
    setHasRespawned(true);
    playSfx("ui");
    applyUnlocks({
      discovered,
      collected,
      smashed,
      hasRespawned: true,
      phase,
    });
  }, [applyUnlocks, discovered, collected, smashed, phase]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      setFlightMuted(next);
      return next;
    });
  }, []);

  const nearLandmark = useMemo(
    () => layout.landmarks.find((l) => l.id === nearId) ?? null,
    [layout.landmarks, nearId],
  );

  const activeBay = useMemo(
    () => layout.bays.find((b) => b.id === activeBayId) ?? null,
    [layout.bays, activeBayId],
  );

  const value = useMemo<FlightWorldStore>(
    () => ({
      layout,
      phase,
      setPhase,
      discovered,
      discover,
      nearLandmark,
      setNearId,
      clearNearIf,
      activeBay,
      setActiveBayId,
      clearBayIf,
      collected,
      collect,
      smashed,
      registerSmash,
      respawnToken,
      respawn,
      farFromPlatform,
      setFarFromPlatform,
      muted,
      toggleMute,
      mapOpen,
      setMapOpen,
      optionsOpen,
      setOptionsOpen,
      unlocked,
      quality,
      setQuality,
    }),
    [
      layout,
      phase,
      setPhase,
      discovered,
      discover,
      nearLandmark,
      setNearId,
      clearNearIf,
      activeBay,
      setActiveBayId,
      clearBayIf,
      collected,
      collect,
      smashed,
      registerSmash,
      respawnToken,
      respawn,
      farFromPlatform,
      muted,
      toggleMute,
      mapOpen,
      optionsOpen,
      unlocked,
      quality,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFlightWorld() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFlightWorld requires provider");
  return ctx;
}

export { ACHIEVEMENTS };
