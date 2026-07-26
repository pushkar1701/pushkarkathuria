"use client";

import Link from "next/link";
import { flightCopy } from "@/content/flight";
import { buildPlaygroundLayout } from "@/lib/flight-world/layout";

export function FlightGate({
  title = flightCopy.title,
  body = flightCopy.desktopOnly,
  onPlayAnyway,
}: {
  title?: string;
  body?: string;
  onPlayAnyway?: () => void;
}) {
  const landmarks = buildPlaygroundLayout().landmarks.filter(
    (l) => l.kind === "company" || l.kind === "project",
  );

  return (
    <div className="grid min-h-[100svh] place-items-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <h1 className="text-center font-heading text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">{body}</p>
        <ol className="mt-6 max-h-64 space-y-2 overflow-y-auto">
          {landmarks.map((l, i) => (
            <li
              key={l.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2"
            >
              <span
                className="inline-flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-background"
                style={{ backgroundColor: l.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: l.accent }}>
                  {l.title}
                </p>
                {l.subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">{l.subtitle}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onPlayAnyway ? (
            <button
              type="button"
              onClick={onPlayAnyway}
              className="rounded-full border border-brand/50 bg-brand/15 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/25"
            >
              Play anyway
            </button>
          ) : null}
          <Link
            href="/#contact"
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand"
          >
            Contact
          </Link>
          <Link
            href="/resume"
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand"
          >
            Resume
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand hover:text-brand"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
