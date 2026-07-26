"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { flightCopy } from "@/content/flight";
import { LinkButton } from "@/components/link-button";
import { buildFlightWorld, type FlightWorld, type Landmark } from "@/lib/flight/world";
import { cn } from "@/lib/utils";

function useOverlayNavigate(onClose: () => void) {
  const router = useRouter();
  return useCallback(
    (href: string) => (event: MouseEvent) => {
      event.preventDefault();
      onClose();
      window.requestAnimationFrame(() => {
        if (href.startsWith("#")) {
          window.location.hash = href;
        } else if (href.startsWith("http")) {
          window.open(href, "_blank", "noopener,noreferrer");
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

function LandmarkCard({
  landmark,
  onClose,
}: {
  landmark: Landmark;
  onClose: () => void;
}) {
  const navigate = useOverlayNavigate(onClose);
  const kindLabel =
    landmark.kind === "company"
      ? "Company"
      : landmark.kind === "project"
        ? "Project"
        : landmark.kind === "secret"
          ? "Secret"
          : landmark.kind === "contact"
            ? "Contact"
            : "Resume";

  return (
    <div
      className="pointer-events-auto w-56 rounded-2xl border bg-card/85 p-4 backdrop-blur-sm sm:w-64"
      style={{
        borderColor: `color-mix(in oklch, ${landmark.accent} 40%, var(--border))`,
        boxShadow: `0 0 28px color-mix(in oklch, ${landmark.accent} 14%, transparent)`,
      }}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {kindLabel}
      </p>
      <p
        className="mt-1.5 font-heading text-lg font-semibold"
        style={{ color: landmark.accent }}
      >
        {landmark.title}
      </p>
      {landmark.subtitle ? (
        <p className="mt-0.5 text-sm text-muted-foreground">{landmark.subtitle}</p>
      ) : null}
      {landmark.body ? (
        <p className="mt-1 text-xs text-muted-foreground/80">{landmark.body}</p>
      ) : null}
      {landmark.href ? (
        <div className="mt-3">
          {landmark.href.startsWith("http") ? (
            <LinkButton
              href={landmark.href}
              size="sm"
              variant="outline"
              onClick={navigate(landmark.href)}
            >
              {flightCopy.openLink}
            </LinkButton>
          ) : landmark.kind === "contact" ? (
            <LinkButton href={landmark.href} size="sm" onClick={navigate(landmark.href)}>
              {flightCopy.contact}
            </LinkButton>
          ) : landmark.kind === "resume" ? (
            <LinkButton href={landmark.href} size="sm" onClick={navigate(landmark.href)}>
              {flightCopy.resume}
            </LinkButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function FlightHud({
  world,
  discovered,
  collectedCount,
  nearId,
  close,
  onRespawn,
}: {
  world: FlightWorld;
  discovered: Set<string>;
  collectedCount: number;
  nearId: string | null;
  close: () => void;
  onRespawn: () => void;
}) {
  const total = world.landmarks.length;
  const near = useMemo(
    () => world.landmarks.find((l) => l.id === nearId) ?? null,
    [world.landmarks, nearId],
  );

  const [hintVisible, setHintVisible] = useState(true);
  useEffect(() => {
    function handleKeyDown() {
      setHintVisible(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-6">
        <div className="flex min-w-0 flex-wrap items-baseline gap-3">
          <h2 id="flight-title" className="font-heading text-xl font-bold">
            {flightCopy.title}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {flightCopy.discoveredLabel}{" "}
            {flightCopy.progress(discovered.size, total)}
          </span>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] text-brand">
            {flightCopy.coinsLabel} {collectedCount}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LandButton onClick={onRespawn} label={flightCopy.respawn} />
          <LandButton onClick={close} label={flightCopy.cancel} />
        </div>
      </div>

      {near ? (
        <div className="absolute inset-y-0 right-4 flex items-center sm:right-6">
          <LandmarkCard landmark={near} onClose={close} />
        </div>
      ) : null}

      <p
        className={cn(
          "absolute inset-x-0 bottom-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-opacity duration-700",
          hintVisible ? "opacity-70" : "opacity-0",
        )}
      >
        {flightCopy.controlsHint}
      </p>
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
  const navigate = useOverlayNavigate(onClose);
  const landmarks = useMemo(
    () =>
      buildFlightWorld().landmarks.filter(
        (l) => l.kind === "company" || l.kind === "project",
      ),
    [],
  );

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
          {landmarks.map((landmark, index) => (
            <li
              key={landmark.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
            >
              <span
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-background"
                style={{ backgroundColor: landmark.accent }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: landmark.accent }}
                >
                  {landmark.title}
                </p>
                {landmark.subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {landmark.subtitle}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="#contact" onClick={navigate("#contact")}>
            {flightCopy.contact}
          </LinkButton>
          <LinkButton
            href="/resume"
            variant="outline"
            onClick={navigate("/resume")}
          >
            {flightCopy.resume}
          </LinkButton>
          <LandButton onClick={onClose} label={flightCopy.cancel} />
        </div>
      </div>
    </div>
  );
}
