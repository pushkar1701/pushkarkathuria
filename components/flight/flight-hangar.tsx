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

type HangarProps = {
  skyId: SkyId;
  craftId: CraftId;
  onSkyChange: (id: SkyId) => void;
  onCraftChange: (id: CraftId) => void;
  onLaunch: () => void;
  onCancel: () => void;
};

function CraftPreview({ craftId }: { craftId: CraftId }) {
  const craft = getCraft(craftId);
  if (craft.kind === "rocket") {
    return (
      <div className="relative mx-auto flex h-28 w-20 items-end justify-center">
        <div
          className="h-20 w-8 rounded-t-full rounded-b-md"
          style={{ backgroundColor: craft.body }}
        />
        <div
          className="absolute bottom-0 h-6 w-10 rounded-b-lg"
          style={{ backgroundColor: craft.accent }}
        />
        <div
          className="absolute -bottom-3 h-8 w-3 rounded-full opacity-80 blur-[2px]"
          style={{ backgroundColor: craft.trail }}
        />
      </div>
    );
  }
  if (craft.kind === "scout") {
    return (
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <div
          className="h-4 w-24 rounded-full"
          style={{ backgroundColor: craft.accent }}
        />
        <div
          className="absolute h-10 w-10 rounded-full border-4"
          style={{
            backgroundColor: craft.body,
            borderColor: craft.accent,
          }}
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto flex h-28 w-32 items-center justify-center">
      <div
        className="h-3 w-28 rounded-sm"
        style={{ backgroundColor: craft.accent }}
      />
      <div
        className="absolute h-12 w-6 rounded-sm"
        style={{
          backgroundColor: craft.body,
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
}

export function FlightHangar({
  skyId,
  craftId,
  onSkyChange,
  onCraftChange,
  onLaunch,
  onCancel,
}: HangarProps) {
  const sky = getSkyTheme(skyId);

  return (
    <div className="grid h-full place-items-center overflow-y-auto p-4 sm:p-8">
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 shadow-2xl"
        style={{
          background: `linear-gradient(160deg, ${sky.skyHi} 0%, ${sky.sky} 55%, ${sky.ground} 100%)`,
        }}
      >
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
            {flightCopy.title}
          </p>
          <h2
            id="flight-title"
            className="mt-1 font-heading text-2xl font-bold text-white sm:text-3xl"
          >
            {flightCopy.hangarTitle}
          </h2>
          <p className="mt-2 text-sm text-white/65">{flightCopy.hangarBody}</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div
            className="mb-6 rounded-2xl border border-white/10 py-6"
            style={{ backgroundColor: `${sky.ground}cc` }}
          >
            <CraftPreview craftId={craftId} />
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              Preview
            </p>
          </div>

          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            {flightCopy.skyLabel}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SKY_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSkyChange(theme.id)}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-left transition-colors",
                  skyId === theme.id
                    ? "border-white/50 bg-white/15"
                    : "border-white/10 bg-black/20 hover:border-white/25",
                )}
              >
                <span
                  className="mb-1.5 block h-6 rounded-md"
                  style={{
                    background: `linear-gradient(90deg, ${theme.sky}, ${theme.brandSecondary})`,
                  }}
                />
                <span className="text-xs font-medium text-white/90">
                  {theme.label}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            {flightCopy.craftLabel}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CRAFTS.map((craft) => (
              <button
                key={craft.id}
                type="button"
                onClick={() => onCraftChange(craft.id)}
                className={cn(
                  "rounded-xl border px-2 py-3 text-center transition-colors",
                  craftId === craft.id
                    ? "border-white/50 bg-white/15"
                    : "border-white/10 bg-black/20 hover:border-white/25",
                )}
              >
                <span
                  className="mx-auto mb-2 block size-3 rounded-full"
                  style={{ backgroundColor: craft.accent }}
                />
                <span className="text-xs font-medium text-white/90">
                  {craft.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onLaunch}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              style={{ backgroundColor: sky.brand }}
            >
              {flightCopy.launch}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              {flightCopy.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
