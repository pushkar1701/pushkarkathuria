"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useFlight } from "./flight-provider";
import {
  DesktopOnlyPanel,
  FlightHud,
  ReducedMotionRouteList,
} from "./flight-hud";

const FlightCanvas = dynamic(() => import("./flight-canvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm">
      Canvas loading…
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

/** Subscribes to a media query and returns its current match state, resolved
 * synchronously at render time so the first paint is already correct (no
 * effect-driven flash of the wrong branch). `serverSnapshot` is the safe
 * fallback used when this ever evaluates outside the browser. */
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

export function FlightShell() {
  const { close, isOpen } = useFlight();
  // Safe defaults if this ever evaluates before the browser can answer:
  // assume a fine pointer (not coarse) but prefer the reduced-motion, no-WebGL
  // route list rather than risk flashing the canvas.
  const coarsePointer = useMediaQuery("(pointer: coarse)", false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [endless, setEndless] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Reset progress each time the overlay opens (adjust state while
  // rendering, per React's guidance, instead of in an effect).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setVisited(new Set());
      setEndless(false);
    }
  }

  const handleVisit = useCallback((id: string) => {
    setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const handleLoopRoute = useCallback(() => {
    setVisited(new Set());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Focus management: move focus into the dialog on open, restore it (or
  // fall back to the footer trigger) on close.
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
  } else {
    content = (
      <>
        <FlightCanvas visited={visited} onVisit={handleVisit} />
        <FlightHud
          visited={visited}
          close={close}
          endless={endless}
          onEndlessChange={setEndless}
          onLoopRoute={handleLoopRoute}
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
      className="fixed inset-0 z-[80] bg-background/95 outline-none"
    >
      {content}
    </div>,
    document.body,
  );
}
