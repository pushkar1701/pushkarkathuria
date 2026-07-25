"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { flightCopy } from "@/content/flight";
import { LinkButton } from "@/components/link-button";
import { nextWaypoint } from "@/lib/flight/path";
import { buildFlightWaypoints, type FlightWaypoint } from "@/lib/flight/waypoints";
import { cn } from "@/lib/utils";

/** Close the overlay first, then navigate on the next frame so the
 * `overflow: hidden` unlock (triggered by the close) commits before we
 * change the hash / route, otherwise the browser can't scroll to the
 * target while the body is still locked. */
function useOverlayNavigate(onClose: () => void) {
  const router = useRouter();
  return useCallback(
    (href: string) => (event: MouseEvent) => {
      event.preventDefault();
      onClose();
      window.requestAnimationFrame(() => {
        if (href.startsWith("#")) {
          window.location.hash = href;
        } else {
          router.push(href);
        }
      });
    },
    [onClose, router],
  );
}

function LandButton({
  onClick,
  className,
  label = flightCopy.land,
}: {
  onClick: () => void;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand",
        className,
      )}
    >
      {label}
    </button>
  );
}

function StopBadge({ index, accent }: { index: number; accent: string }) {
  return (
    <span
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-background"
      style={{ backgroundColor: accent }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function StopCard({
  waypoint,
  label,
}: {
  waypoint: FlightWaypoint;
  label: string;
}) {
  return (
    <div
      className="pointer-events-auto w-52 rounded-2xl border bg-card/80 p-4 backdrop-blur-sm sm:w-60"
      style={{
        borderColor: `color-mix(in oklch, ${waypoint.accent} 40%, var(--border))`,
        boxShadow: `0 0 32px color-mix(in oklch, ${waypoint.accent} 14%, transparent)`,
      }}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-1.5 font-heading text-lg font-semibold"
        style={{ color: waypoint.accent }}
      >
        {waypoint.shortCompany}
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">{waypoint.role}</p>
      <p className="mt-0.5 text-xs text-muted-foreground/70">
        {waypoint.dates}
      </p>
    </div>
  );
}

function CreditsCard({
  waypoints,
  onClose,
  onKeepFlying,
  score,
}: {
  waypoints: FlightWaypoint[];
  onClose: () => void;
  onKeepFlying: () => void;
  score: number;
}) {
  const navigate = useOverlayNavigate(onClose);
  return (
    <div className="pointer-events-auto absolute inset-0 z-10 grid place-items-center bg-background/85 p-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl sm:max-w-md sm:p-8">
        <h3 className="font-heading text-2xl font-bold">
          {flightCopy.creditsTitle}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          {flightCopy.creditsBody}
        </p>
        <p className="mt-3 font-mono text-lg text-brand">
          {flightCopy.scoreLabel} {score.toLocaleString()}
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
          {waypoints.map((waypoint, index) => (
            <li key={waypoint.id} className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: waypoint.accent }}
              >
                {waypoint.shortCompany}
              </span>
              {index < waypoints.length - 1 && (
                <span aria-hidden className="text-muted-foreground/40">
                  {"\u2192"}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <LandButton onClick={onKeepFlying} label={flightCopy.keepFlying} />
          <LinkButton href="#contact" onClick={navigate("#contact")}>
            {flightCopy.contact}
          </LinkButton>
          <LinkButton href="/resume" variant="outline" onClick={navigate("/resume")}>
            {flightCopy.resume}
          </LinkButton>
          <LandButton onClick={onClose} label={flightCopy.cancel} />
        </div>
      </div>
    </div>
  );
}

export function FlightHud({
  visited,
  close,
  endless,
  onEndlessChange,
  onLoopRoute,
  score,
  combo,
}: {
  visited: Set<string>;
  close: () => void;
  endless: boolean;
  onEndlessChange: (value: boolean) => void;
  onLoopRoute: () => void;
  score: number;
  combo: number;
}) {
  const waypoints = useMemo(() => buildFlightWaypoints(), []);
  const total = waypoints.length;
  const complete = visited.size === total;

  const upNext = useMemo(
    () => nextWaypoint(waypoints, visited),
    [waypoints, visited],
  );
  const lastVisited = useMemo(() => {
    for (let i = waypoints.length - 1; i >= 0; i -= 1) {
      if (visited.has(waypoints[i].id)) return waypoints[i];
    }
    return null;
  }, [waypoints, visited]);
  const sideStop = upNext ?? lastVisited;
  const sideLabel = upNext ? "Next stop" : "Last stop";

  const [hintVisible, setHintVisible] = useState(true);
  useEffect(() => {
    function handleKeyDown() {
      setHintVisible(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!endless || !complete) return;
    onLoopRoute();
  }, [endless, complete, onLoopRoute]);

  const showCredits = complete && !endless;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-6">
        <div className="flex min-w-0 flex-wrap items-baseline gap-3">
          <h2 id="flight-title" className="font-heading text-xl font-bold">
            {flightCopy.title}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {flightCopy.progress(visited.size, total)}
          </span>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] text-brand">
            {flightCopy.scoreLabel} {score.toLocaleString()}
          </span>
          <span className="rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-2.5 py-0.5 font-mono text-[10px] text-brand-secondary">
            {flightCopy.comboLabel} ×{combo.toFixed(1)}
          </span>
          {endless ? (
            <span className="rounded-full border border-brand-secondary/40 bg-brand-secondary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-secondary">
              {flightCopy.endlessHint}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-pressed={endless}
            onClick={() => onEndlessChange(!endless)}
            className={cn(
              "rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
              endless
                ? "border-brand-secondary/50 bg-brand-secondary/15 text-brand-secondary"
                : "border-border bg-background/80 text-muted-foreground hover:border-brand/40 hover:text-foreground",
            )}
          >
            {endless ? flightCopy.endlessOn : flightCopy.endlessOff}
          </button>
          <LandButton onClick={close} label={flightCopy.cancel} />
        </div>
      </div>

      {sideStop && !showCredits && (
        <div className="absolute inset-y-0 right-4 flex items-center sm:right-6">
          <StopCard waypoint={sideStop} label={sideLabel} />
        </div>
      )}

      <p
        className={cn(
          "absolute inset-x-0 bottom-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-opacity duration-700",
          hintVisible ? "opacity-70" : "opacity-0",
        )}
      >
        {flightCopy.controlsHint}
      </p>

      {showCredits && (
        <CreditsCard
          waypoints={waypoints}
          onClose={close}
          score={score}
          onKeepFlying={() => {
            onEndlessChange(true);
            onLoopRoute();
          }}
        />
      )}
    </div>
  );
}

export function DesktopOnlyPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
        <h2 id="flight-title" className="font-heading text-2xl font-bold">
          {flightCopy.title}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {flightCopy.desktopOnly}
        </p>
        <div className="mt-6">
          <LandButton onClick={onClose} label={flightCopy.cancel} />
        </div>
      </div>
    </div>
  );
}

export function ReducedMotionRouteList({ onClose }: { onClose: () => void }) {
  const waypoints = useMemo(() => buildFlightWaypoints(), []);
  const navigate = useOverlayNavigate(onClose);

  return (
    <div className="grid h-full place-items-center overflow-y-auto p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <h2
          id="flight-title"
          className="text-center font-heading text-2xl font-bold"
        >
          {flightCopy.reducedMotionTitle}
        </h2>
        <ol className="mt-6 space-y-2.5">
          {waypoints.map((waypoint, index) => (
            <li
              key={waypoint.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
            >
              <StopBadge index={index} accent={waypoint.accent} />
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: waypoint.accent }}
                >
                  {waypoint.shortCompany}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {waypoint.role} · {waypoint.dates}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="#contact" onClick={navigate("#contact")}>
            {flightCopy.contact}
          </LinkButton>
          <LinkButton href="/resume" variant="outline" onClick={navigate("/resume")}>
            {flightCopy.resume}
          </LinkButton>
          <LandButton onClick={onClose} label={flightCopy.cancel} />
        </div>
      </div>
    </div>
  );
}
