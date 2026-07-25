"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { flightArcade } from "@/content/flight";
import { buildArcadeProps } from "@/lib/flight/arcade";
import {
  getCraft,
  getSkyTheme,
  type CraftId,
  type SkyId,
} from "@/lib/flight/loadout";
import { buildFlightWaypoints } from "@/lib/flight/waypoints";
import { useFlight } from "./flight-provider";
import { FlightHangar } from "./flight-hangar";
import {
  DesktopOnlyPanel,
  FlightHud,
  ReducedMotionRouteList,
} from "./flight-hud";

const FlightCanvas = dynamic(() => import("./flight-canvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-muted-foreground">
      Preparing runway…
    </div>
  ),
});

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

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

type Phase = "hangar" | "playing";

export function FlightShell() {
  const { close, isOpen } = useFlight();
  const coarsePointer = useMediaQuery("(pointer: coarse)", false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  const [phase, setPhase] = useState<Phase>("hangar");
  const [skyId, setSkyId] = useState<SkyId>("midnight");
  const [craftId, setCraftId] = useState<CraftId>("dart");
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [collectedRings, setCollectedRings] = useState<Set<string>>(
    () => new Set(),
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [endless, setEndless] = useState(false);
  const [loop, setLoop] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const waypoints = useMemo(() => buildFlightWaypoints(), []);
  const density = endless ? 1 + Math.min(2, loop * 0.35) : 1;
  const arcade = useMemo(
    () => buildArcadeProps(waypoints, density),
    [waypoints, density],
  );
  const sky = getSkyTheme(skyId);
  const craft = getCraft(craftId);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setPhase("hangar");
      setVisited(new Set());
      setCollectedRings(new Set());
      setScore(0);
      setCombo(1);
      setEndless(false);
      setLoop(0);
    }
  }

  const comboRef = useRef(1);
  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  const handleVisit = useCallback((id: string) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      return new Set(prev).add(id);
    });
    const mult = comboRef.current;
    setScore((s) => s + Math.round(flightArcade.companyPoints * mult));
    setCombo((c) => Math.min(flightArcade.comboMax, c + flightArcade.comboStep));
  }, []);

  const handleRing = useCallback((id: string) => {
    setCollectedRings((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      const mult = comboRef.current;
      setScore((s) => s + Math.round(flightArcade.ringPoints * mult));
      setCombo((c) =>
        Math.min(flightArcade.comboMax, c + flightArcade.comboStep),
      );
      return next;
    });
  }, []);

  const handleHit = useCallback(() => {
    setScore((s) => Math.max(0, s - flightArcade.hitPenalty));
    setCombo(1);
  }, []);

  const handleLoopRoute = useCallback(() => {
    setVisited(new Set());
    setCollectedRings(new Set());
    setLoop((n) => n + 1);
    setCombo(1);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialogRef.current?.focus();
    return () => {
      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) {
        previous.focus();
        return;
      }
      document
        .querySelector<HTMLElement>('[data-flight-trigger="true"]')
        ?.focus();
    };
  }, [isOpen]);

  const handleDialogKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Tab") return;
      const container = dialogRef.current;
      if (!container) return;
      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    },
    [],
  );

  if (!isOpen) return null;

  let content: ReactNode;
  if (coarsePointer) {
    content = <DesktopOnlyPanel onClose={close} />;
  } else if (reduceMotion) {
    content = <ReducedMotionRouteList onClose={close} />;
  } else if (phase === "hangar") {
    content = (
      <FlightHangar
        skyId={skyId}
        craftId={craftId}
        onSkyChange={setSkyId}
        onCraftChange={setCraftId}
        onLaunch={() => setPhase("playing")}
        onCancel={close}
      />
    );
  } else {
    content = (
      <>
        <FlightCanvas
          visited={visited}
          onVisit={handleVisit}
          sky={sky}
          craft={craft}
          rings={arcade.rings}
          rocks={arcade.rocks}
          collectedRingIds={collectedRings}
          onRing={handleRing}
          onHit={handleHit}
        />
        <FlightHud
          visited={visited}
          close={close}
          endless={endless}
          onEndlessChange={setEndless}
          onLoopRoute={handleLoopRoute}
          score={score}
          combo={combo}
        />
      </>
    );
  }

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-title"
      tabIndex={-1}
      onKeyDown={handleDialogKeyDown}
      className="fixed inset-0 z-[80] bg-background outline-none"
    >
      {content}
    </div>,
    document.body,
  );
}
