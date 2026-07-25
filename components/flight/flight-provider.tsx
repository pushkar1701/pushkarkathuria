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
import { isEditableTarget } from "@/lib/flight/controls";

const CHORD = "fly";
const CHORD_TIMEOUT_MS = 2_000;

type FlightContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

type ChordResult = {
  buffer: string;
  matched: boolean;
};

const FlightContext = createContext<FlightContextValue | null>(null);

export function advanceFlightChord(
  buffer: string,
  key: string,
  idleMs: number,
): ChordResult {
  const activeBuffer = idleMs > CHORD_TIMEOUT_MS ? "" : buffer;
  const nextLetter = key.toLowerCase();

  if (nextLetter !== CHORD[activeBuffer.length]) {
    return { buffer: "", matched: false };
  }

  const nextBuffer = activeBuffer + nextLetter;
  if (nextBuffer === CHORD) {
    return { buffer: "", matched: true };
  }

  return { buffer: nextBuffer, matched: false };
}

export function FlightProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    let buffer = "";
    let lastLetterAt = 0;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isOpen) close();
        return;
      }

      if (isEditableTarget(event.target)) return;
      if (event.repeat || !/^[a-z]$/i.test(event.key)) return;

      const now = Date.now();
      const result = advanceFlightChord(buffer, event.key, now - lastLetterAt);
      buffer = result.buffer;
      lastLetterAt = now;

      if (result.matched) open();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, isOpen, open]);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [close, isOpen, open],
  );

  return (
    <FlightContext.Provider value={value}>{children}</FlightContext.Provider>
  );
}

export function useFlight() {
  const context = useFlightOptional();
  if (!context) {
    throw new Error("useFlight must be used within FlightProvider");
  }
  return context;
}

export function useFlightOptional() {
  return useContext(FlightContext);
}
