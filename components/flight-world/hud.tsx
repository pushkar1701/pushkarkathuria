"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { flightCopy } from "@/content/flight";
import { ACHIEVEMENTS } from "@/lib/flight-world/achievements";
import { cn } from "@/lib/utils";
import { useFlightWorld } from "./store";

export function FlightHud() {
  const router = useRouter();
  const {
    layout,
    discovered,
    collected,
    nearLandmark,
    respawn,
    farFromPlatform,
    muted,
    toggleMute,
    mapOpen,
    setMapOpen,
    optionsOpen,
    setOptionsOpen,
    unlocked,
    quality,
    setQuality,
  } = useFlightWorld();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-foreground">
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <h1 className="font-heading text-xl font-bold">Career Flight</h1>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            Found {discovered.size}/{layout.landmarks.length} · Coins{" "}
            {collected.size}/{layout.coins.length} · Achievements {unlocked.size}/
            {ACHIEVEMENTS.length}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <HudBtn onClick={() => setMapOpen(!mapOpen)}>
            {mapOpen ? "Map on" : "Map"}
          </HudBtn>
          <HudBtn onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</HudBtn>
          <HudBtn onClick={respawn}>{flightCopy.respawn}</HudBtn>
          <HudBtn onClick={() => setOptionsOpen(true)}>Options</HudBtn>
          <HudBtn onClick={() => router.push("/")}>Leave</HudBtn>
        </div>
      </div>

      {farFromPlatform ? (
        <div className="pointer-events-auto absolute inset-x-0 bottom-16 z-20 flex justify-center px-4">
          <div className="max-w-md rounded-2xl border border-brand/40 bg-card/90 p-4 text-center shadow-xl backdrop-blur-md sm:p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
              {flightCopy.deepSpaceTitle}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {flightCopy.deepSpaceBody}
            </p>
            <button
              type="button"
              onClick={respawn}
              className="mt-4 rounded-full border border-brand/50 bg-brand/20 px-5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/30"
            >
              {flightCopy.returnPlatform}
            </button>
          </div>
        </div>
      ) : null}

      {nearLandmark && !farFromPlatform ? (
        <div className="pointer-events-auto absolute top-1/2 right-4 w-60 -translate-y-1/2 rounded-2xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur-md sm:right-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {kindLabel(nearLandmark.kind)}
          </p>
          <p
            className="mt-1 font-heading text-lg font-semibold"
            style={{ color: nearLandmark.accent }}
          >
            {nearLandmark.title}
          </p>
          {nearLandmark.subtitle ? (
            <p className="text-sm text-muted-foreground">{nearLandmark.subtitle}</p>
          ) : null}
          {nearLandmark.body ? (
            <p className="mt-1 text-xs text-muted-foreground/80">{nearLandmark.body}</p>
          ) : null}
          {nearLandmark.href ? (
            <Link
              href={nearLandmark.href}
              className="mt-3 inline-flex text-sm text-brand underline-offset-4 hover:underline"
              target={nearLandmark.href.startsWith("http") ? "_blank" : undefined}
              rel={
                nearLandmark.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              Open →
            </Link>
          ) : null}
        </div>
      ) : null}

      <p className="absolute inset-x-0 bottom-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        WASD thrust/turn · Shift boost · Space jump · R return · M map · L mute · Esc
        options
      </p>

      {mapOpen ? <MiniMap /> : null}

      {optionsOpen ? (
        <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-background/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="font-heading text-2xl font-bold">Options</h2>
            <div className="mt-5 space-y-3 text-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3"
                onClick={toggleMute}
              >
                <span>Audio</span>
                <span className="text-muted-foreground">
                  {muted ? "Off" : "On"}
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3"
                onClick={() => setQuality(quality === "high" ? "low" : "high")}
              >
                <span>Quality</span>
                <span className="text-muted-foreground capitalize">{quality}</span>
              </button>
              <div className="rounded-xl border border-border px-4 py-3">
                <p className="font-medium">Achievements</p>
                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-muted-foreground">
                  {ACHIEVEMENTS.map((a) => (
                    <li
                      key={a.id}
                      className={cn(unlocked.has(a.id) && "text-brand")}
                    >
                      {unlocked.has(a.id) ? "✓" : "·"} {a.title} — {a.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <HudBtn onClick={() => setOptionsOpen(false)}>Close</HudBtn>
              <Link
                href="/"
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand"
              >
                Back to site
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function kindLabel(kind: string) {
  switch (kind) {
    case "company":
      return "Company";
    case "project":
      return "Project";
    case "skill":
      return "Technology";
    case "contact":
      return "Contact";
    case "resume":
      return "Resume";
    case "secret":
      return "Secret";
    default:
      return kind;
  }
}

function HudBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:border-brand hover:text-brand sm:text-sm"
    >
      {children}
    </button>
  );
}

function MiniMap() {
  const { layout, discovered, nearLandmark } = useFlightWorld();
  return (
    <div className="pointer-events-auto absolute bottom-16 left-4 overflow-hidden rounded-2xl border border-border bg-card/90 p-3 shadow-xl backdrop-blur-md sm:left-6">
      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Map
      </p>
      <svg viewBox="-40 -40 80 80" className="size-40 sm:size-48">
        <rect x="-40" y="-40" width="80" height="80" fill="#12101c" />
        {layout.landmarks.map((l) => {
          const x = l.position[0];
          const z = l.position[2];
          return (
            <circle
              key={l.id}
              cx={x}
              cy={z}
              r={nearLandmark?.id === l.id ? 2.2 : 1.4}
              fill={discovered.has(l.id) ? l.accent : "#555"}
              opacity={discovered.has(l.id) ? 1 : 0.5}
            />
          );
        })}
        <circle cx={0} cy={28} r={1.8} fill="#fff" />
      </svg>
    </div>
  );
}
