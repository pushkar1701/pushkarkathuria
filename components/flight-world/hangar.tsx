"use client";

import { flightCopy } from "@/content/flight";
import {
  CRAFTS,
  SKY_THEMES,
  type CraftId,
  type SkyId,
  getCraft,
  getSkyTheme,
} from "@/lib/flight/loadout";
import { cn } from "@/lib/utils";

function CraftPreview({ craftId }: { craftId: CraftId }) {
  const craft = getCraft(craftId);
  if (craft.kind === "rocket") {
    return (
      <div className="relative mx-auto flex h-14 w-12 items-end justify-center">
        <div
          className="h-10 w-4 rounded-t-full rounded-b-sm"
          style={{ backgroundColor: craft.body }}
        />
        <div
          className="absolute bottom-0 h-3 w-6 rounded-b-md"
          style={{ backgroundColor: craft.accent }}
        />
        <div
          className="absolute -bottom-1.5 h-4 w-1.5 rounded-full opacity-80 blur-[1px]"
          style={{ backgroundColor: craft.trail }}
        />
      </div>
    );
  }
  if (craft.kind === "scout") {
    return (
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        <div
          className="h-2 w-12 rounded-full"
          style={{ backgroundColor: craft.accent }}
        />
        <div
          className="absolute h-6 w-6 rounded-full border-[3px]"
          style={{
            backgroundColor: craft.body,
            borderColor: craft.accent,
          }}
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto flex h-14 w-16 items-center justify-center">
      <div
        className="h-1.5 w-14 rounded-sm"
        style={{ backgroundColor: craft.accent }}
      />
      <div
        className="absolute h-8 w-4"
        style={{
          backgroundColor: craft.body,
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
}

export function FlightWorldHangar({
  skyId,
  craftId,
  onSkyChange,
  onCraftChange,
  onLaunch,
  onLeave,
}: {
  skyId: SkyId;
  craftId: CraftId;
  onSkyChange: (id: SkyId) => void;
  onCraftChange: (id: CraftId) => void;
  onLaunch: () => void;
  onLeave: () => void;
}) {
  const sky = getSkyTheme(skyId);
  const craft = getCraft(craftId);

  return (
    <div
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-16"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${sky.skyHi} 0%, ${sky.sky} 55%, #05040a 100%)`,
      }}
    >
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <h1 id="flight-title" className="font-heading text-3xl font-bold">
          {flightCopy.hangarTitle}
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Physics playground — cruise the circuit, take EXIT bays for Companies,
          Tech, Projects, Hobbies, and more.
        </p>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          {flightCopy.skyLabel}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SKY_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSkyChange(theme.id)}
              className={cn(
                "rounded-xl border px-2 py-3 text-left text-xs transition-colors",
                skyId === theme.id
                  ? "border-white/50 bg-white/15"
                  : "border-white/10 bg-white/5 hover:border-white/25",
              )}
            >
              <span
                className="mb-2 block h-8 rounded-md"
                style={{
                  background: `linear-gradient(135deg, ${theme.skyHi}, ${theme.brand})`,
                }}
              />
              {theme.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          {flightCopy.craftLabel}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {CRAFTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onCraftChange(c.id)}
              className={cn(
                "rounded-xl border px-2 py-3 text-center text-xs transition-colors",
                craftId === c.id
                  ? "border-white/50 bg-white/15"
                  : "border-white/10 bg-white/5 hover:border-white/25",
              )}
            >
              <CraftPreview craftId={c.id} />
              <span className="mt-1 block">{c.label}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-white/50">
          Selected: {craft.label} · {sky.label}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onLaunch}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-background"
          >
            {flightCopy.launch}
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/80"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
