"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { CraftId, SkyId } from "@/lib/flight/loadout";
import { isEditableTarget } from "@/lib/flight/controls";
import { FlightGate } from "./gate";
import { FlightWorldHangar } from "./hangar";
import { FlightHud } from "./hud";
import { FlightWorldProvider, useFlightWorld } from "./store";

const FlightWorldCanvas = dynamic(
  () =>
    import("./scene/canvas").then((m) => m.FlightWorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[100svh] place-items-center text-sm text-muted-foreground">
        Warming thrusters…
      </div>
    ),
  },
);

function useMediaQuery(query: string, serverSnapshot: boolean): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function FlightAppInner() {
  const router = useRouter();
  const coarse = useMediaQuery("(pointer: coarse)", false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const [forcePlay, setForcePlay] = useState(false);
  const {
    phase,
    setPhase,
    respawn,
    toggleMute,
    setMapOpen,
    optionsOpen,
    setOptionsOpen,
  } = useFlightWorld();

  const [skyId, setSkyId] = useState<SkyId>("midnight");
  const [craftId, setCraftId] = useState<CraftId>("rocket");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;
      if (e.code === "KeyR" && phase === "playing") {
        e.preventDefault();
        respawn();
      }
      if (e.code === "KeyM" && phase === "playing") {
        e.preventDefault();
        setMapOpen((open) => !open);
      }
      if (e.code === "KeyL") {
        e.preventDefault();
        toggleMute();
      }
      if (e.code === "Escape") {
        e.preventDefault();
        if (optionsOpen) setOptionsOpen(false);
        else if (phase === "playing") setOptionsOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    phase,
    respawn,
    toggleMute,
    setMapOpen,
    optionsOpen,
    setOptionsOpen,
  ]);

  if (coarse) {
    return <FlightGate />;
  }
  if (reduceMotion && !forcePlay) {
    return (
      <FlightGate
        title="Career district"
        body="Motion is reduced on this device — here’s the route map instead."
        onPlayAnyway={() => setForcePlay(true)}
      />
    );
  }

  if (phase === "hangar") {
    return (
      <FlightWorldHangar
        skyId={skyId}
        craftId={craftId}
        onSkyChange={setSkyId}
        onCraftChange={setCraftId}
        onLaunch={() => setPhase("playing")}
        onLeave={() => router.push("/")}
      />
    );
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-background">
      <FlightWorldCanvas skyId={skyId} craftId={craftId} />
      <FlightHud />
    </div>
  );
}

export function FlightApp() {
  return (
    <FlightWorldProvider>
      <FlightAppInner />
    </FlightWorldProvider>
  );
}
