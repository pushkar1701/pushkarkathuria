"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isEditableTarget } from "@/lib/flight/controls";

const CHORD = "fly";
const CHORD_TIMEOUT_MS = 2_000;

export function advanceFlightChord(
  buffer: string,
  key: string,
  idleMs: number,
): { buffer: string; matched: boolean } {
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

/** Homepage easter egg: type `fly` to open /flight. */
export function FlightChordListener() {
  const router = useRouter();
  const buffer = useRef("");
  const lastLetterAt = useRef(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (event.repeat || !/^[a-z]$/i.test(event.key)) return;

      const now = Date.now();
      const result = advanceFlightChord(
        buffer.current,
        event.key,
        now - lastLetterAt.current,
      );
      buffer.current = result.buffer;
      lastLetterAt.current = now;

      if (result.matched) router.push("/flight");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
