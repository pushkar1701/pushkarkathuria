"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { experience } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Chronological: oldest → newest (left → right on the path) */
const timeline = [...experience].reverse();

const PIN_ACCENTS = [
  "oklch(0.8 0.14 85)",
  "var(--brand-secondary)",
  "var(--brand)",
  "oklch(0.76 0.13 155)",
  "oklch(0.8 0.14 85)",
  "var(--brand-secondary)",
  "var(--brand)",
] as const;

/** Horizontal S-curve for the desktop roadmap stage */
const DESKTOP_PATH =
  "M 48 210 C 160 210, 180 70, 300 70 S 420 350, 540 350 S 660 70, 780 70 S 900 350, 1020 350 S 1120 210, 1152 210";

/** Vertical S-curve for mobile / tablet */
const MOBILE_PATH =
  "M 40 36 C 40 90, 120 110, 120 170 S 40 230, 40 290 S 120 350, 120 410 S 40 470, 40 530 S 120 590, 120 650 S 40 710, 40 760";

type Job = (typeof experience)[number];

function parseYear(dates: string) {
  return dates.match(/\d{4}/)?.[0] ?? "";
}

function isPresent(dates: string) {
  return dates.toLowerCase().includes("present");
}

function shortCompany(name: string) {
  if (name.includes("Cognizant")) return "Cognizant";
  if (name.includes("DMI")) return "DMI";
  if (name.includes("Sapient")) return "Sapient";
  if (name.includes("Basware")) return "Basware";
  if (name.includes("Deloitte")) return "Deloitte";
  return name;
}

function pinYearLabel(job: Job) {
  if (isPresent(job.dates)) return "Present";
  return parseYear(job.dates);
}

function usePathPoints(pathD: string, count: number) {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useLayoutEffect(() => {
    if (typeof document === "undefined" || count === 0) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const length = path.getTotalLength();
    const next =
      count === 1
        ? [{ x: path.getPointAtLength(0).x, y: path.getPointAtLength(0).y }]
        : Array.from({ length: count }, (_, i) => {
            const pt = path.getPointAtLength((i / (count - 1)) * length);
            return { x: pt.x, y: pt.y };
          });
    document.body.removeChild(svg);
    // One-time DOM measurement after mount; server renders no pins so this
    // must land in state post-hydration rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPoints(next);
  }, [pathD, count]);

  return points;
}

function DetailPanel({
  job,
  index,
  total,
  isOpen,
  onToggle,
  onPrev,
  onNext,
  onSelect,
}: {
  job: Job;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  const accent = PIN_ACCENTS[index % PIN_ACCENTS.length];
  const reduce = useReducedMotion();
  const yearLabel = isPresent(job.dates)
    ? "Present · 2026"
    : parseYear(job.dates);

  return (
    <div
      className="relative flex h-full max-h-full flex-col overflow-hidden rounded-2xl border bg-card/80 p-3 backdrop-blur-sm transition-[border-color,box-shadow] duration-500 sm:p-4"
      style={{
        borderColor: `color-mix(in oklch, ${accent} 40%, transparent)`,
        boxShadow: `0 0 36px color-mix(in oklch, ${accent} 14%, transparent)`,
      }}
      aria-live="polite"
    >
      {/* Accent hairline that re-sweeps on every stop change */}
      <motion.div
        key={`sweep-${job.id}`}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left"
        style={{
          background: `linear-gradient(to right, ${accent}, transparent)`,
        }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <motion.span
            key={`badge-${job.id}`}
            initial={reduce ? false : { scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="inline-flex size-7 items-center justify-center rounded-full text-xs font-bold text-background sm:size-8 sm:text-sm"
            style={{ backgroundColor: accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          {job.featured && (
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
              Highlight
            </span>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            {yearLabel}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-30 sm:size-9"
            aria-label="Previous stop"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={index === total - 1}
            className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-30 sm:size-9"
            aria-label="Next stop"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        className="mt-3 flex shrink-0 flex-wrap gap-1.5"
        role="tablist"
        aria-label="Experience stops"
      >
        {timeline.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => onSelect(i)}
            className={cn(
              "size-2.5 rounded-full transition-transform",
              i === index ? "scale-125" : "opacity-40 hover:opacity-80",
            )}
            style={{ backgroundColor: PIN_ACCENTS[i % PIN_ACCENTS.length] }}
            aria-label={`${item.role} at ${item.company}`}
          />
        ))}
      </div>

      <motion.div
        key={`content-${job.id}`}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
      >
        <h3 className="font-heading text-lg font-semibold sm:text-xl">
          {job.role}
        </h3>
        <p className="mt-0.5 text-sm font-medium" style={{ color: accent }}>
          {job.company}
        </p>
        <p className="mt-1.5 flex flex-col gap-0.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:text-sm">
          <span>
            {isPresent(job.dates)
              ? job.dates.replace(/Present/i, "Present · 2026")
              : job.dates}
          </span>
          <span className="hidden text-muted-foreground/50 sm:inline">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0" />
            {job.location}
          </span>
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground/85 sm:text-sm">
          {job.context}
        </p>

        <button
          type="button"
          onClick={onToggle}
          className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:border-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? "Hide what I did" : "What I did here"}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180 text-brand",
            )}
          />
        </button>

        {isOpen && (
          <ul className="mt-2 flex flex-col gap-2 px-1 pb-1">
            {job.highlights.map((highlight) => (
              <li
                key={highlight}
                className="text-xs leading-relaxed text-muted-foreground before:mr-2 before:text-brand before:content-['→'] sm:text-sm"
              >
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

function RoadmapSvg({
  pathD,
  viewBox,
  points,
  jobs,
  activeIndex,
  progress,
  reducedMotion,
  onSelect,
  className,
  idPrefix,
  compactLabels,
}: {
  pathD: string;
  viewBox: string;
  points: { x: number; y: number }[];
  jobs: Job[];
  activeIndex: number;
  progress: number;
  reducedMotion: boolean | null;
  onSelect: (index: number) => void;
  className?: string;
  idPrefix: string;
  compactLabels?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(1);
  const asphaltId = `${idPrefix}-asphalt`;
  const glowId = `${idPrefix}-glow`;
  const pinGlowId = `${idPrefix}-pin-glow`;

  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength() || 1);
    }
  }, [pathD]);

  const traveler = useMemo(() => {
    if (!points.length) return { x: 0, y: 0 };
    if (points.length === 1) return points[0];
    const scaled = progress * (points.length - 1);
    const i = Math.min(points.length - 2, Math.max(0, Math.floor(scaled)));
    const t = scaled - i;
    const a = points[i];
    const b = points[i + 1];
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }, [points, progress]);

  const drawn = reducedMotion
    ? pathLength
    : pathLength * Math.max(0.08, progress);

  return (
    <svg
      viewBox={viewBox}
      className={cn("h-full w-full overflow-visible", className)}
      role="img"
      aria-label="Career path roadmap"
    >
      <defs>
        <linearGradient id={asphaltId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.28 0.02 280)" />
          <stop offset="50%" stopColor="oklch(0.34 0.025 280)" />
          <stop offset="100%" stopColor="oklch(0.28 0.02 280)" />
        </linearGradient>
        <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.9" />
          <stop
            offset="50%"
            stopColor="var(--brand-secondary)"
            stopOpacity="0.8"
          />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.9" />
        </linearGradient>
        <filter id={pinGlowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="220" cy="300" r="70" fill="var(--brand)" opacity="0.05" />
      <circle
        cx="700"
        cy="100"
        r="90"
        fill="var(--brand-secondary)"
        opacity="0.06"
      />
      <circle
        cx="980"
        cy="280"
        r="60"
        fill="oklch(0.8 0.14 85)"
        opacity="0.05"
      />

      <path
        d={pathD}
        fill="none"
        stroke={`url(#${asphaltId})`}
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.2 0.02 280)"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Soft luminous halo over the traveled stretch */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${glowId})`}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - drawn}
        opacity="0.22"
      />
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={`url(#${glowId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - drawn}
      />

      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.92 0.01 280 / 0.35)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 14"
        strokeDashoffset={
          reducedMotion ? 0 : pathLength * (1 - progress) * 0.15
        }
      />

      {points.map((pt, i) => {
        const job = jobs[i];
        const accent = PIN_ACCENTS[i % PIN_ACCENTS.length];
        const active = i === activeIndex;
        const company = shortCompany(job.company);
        const year = pinYearLabel(job);
        const present = isPresent(job.dates);

        return (
          <g key={job.id} transform={`translate(${pt.x} ${pt.y})`}>
            <motion.g
              animate={
                reducedMotion ? undefined : { y: active ? [0, -4, 0] : 0 }
              }
              transition={
                active
                  ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.25 }
              }
            >
              <path
                d="M 0 0 L 0 18"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={active ? 1 : 0.55}
              />
              {active && !reducedMotion && (
                <motion.circle
                  cy="-10"
                  fill="none"
                  stroke={accent}
                  strokeWidth="2"
                  initial={{ r: 18, opacity: 0.8 }}
                  animate={{ r: 34, opacity: 0 }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
              <motion.circle
                cy="-10"
                r={13}
                opacity={0.7}
                fill={accent}
                filter={active ? `url(#${pinGlowId})` : undefined}
                initial={false}
                animate={{ r: active ? 19 : 13, opacity: active ? 1 : 0.7 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 20 }
                }
              />
              <text
                y="-5"
                textAnchor="middle"
                className="fill-background font-heading font-bold"
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                {String(i + 1)}
              </text>
              <text
                y={compactLabels ? 38 : 44}
                textAnchor="middle"
                style={{
                  fontSize: compactLabels ? 12 : 18,
                  fontFamily: "var(--font-geist-mono), monospace",
                  fill: "oklch(0.72 0.02 280)",
                  opacity: active ? 1 : 0.7,
                }}
              >
                {year}
              </text>
              {present && !compactLabels && (
                <text
                  y="66"
                  textAnchor="middle"
                  style={{
                    fontSize: 17,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fill: "var(--brand-secondary)",
                    opacity: active ? 1 : 0.75,
                  }}
                >
                  2026
                </text>
              )}
              <text
                y={present && !compactLabels ? 90 : compactLabels ? 56 : 68}
                textAnchor="middle"
                style={{
                  fontSize: compactLabels ? 12 : 18,
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 600,
                  fill: active ? accent : "oklch(0.78 0.02 280)",
                  opacity: active ? 1 : 0.85,
                }}
              >
                {company}
              </text>
            </motion.g>
            <circle
              r="36"
              fill="transparent"
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${job.role} at ${job.company}, ${job.dates}`}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(i);
                }
              }}
            />
          </g>
        );
      })}

      {points.length > 0 && (
        <motion.g
          animate={{ x: traveler.x, y: traveler.y }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 22 }
          }
        >
          {!reducedMotion && (
            <>
              <motion.circle
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                initial={{ r: 10, opacity: 0.9 }}
                animate={{ r: 30, opacity: 0 }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.circle
                fill="none"
                stroke="var(--brand-secondary)"
                strokeWidth="1.5"
                initial={{ r: 10, opacity: 0.7 }}
                animate={{ r: 24, opacity: 0 }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.45,
                }}
              />
            </>
          )}
          <circle r="18" fill="var(--brand)" opacity="0.2" />
          <circle
            r="11"
            fill="var(--brand-secondary)"
            opacity="0.35"
            filter={`url(#${pinGlowId})`}
          />
          <circle r="8" fill="white" />
          <circle r="5.5" fill="var(--brand)" />
        </motion.g>
      )}
    </svg>
  );
}

/** Page-scroll distance reserved per stop while the stage is pinned. */
const PAGE_VH_PER_STOP = 100;

export function ExperienceSection() {
  const count = timeline.length;
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const clickLockY = useRef<number | null>(null);

  // Oldest → newest; page scroll scrubs left → right while stage is sticky
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  // Start collapsed so the panel never eats the path on entry
  const [expanded, setExpanded] = useState<string[]>([]);

  const desktopPoints = usePathPoints(DESKTOP_PATH, count);
  const mobilePoints = usePathPoints(MOBILE_PATH, count);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: shouldReduceMotion ? 1000 : 100,
    damping: shouldReduceMotion ? 100 : 28,
    mass: 0.35,
  });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (
      clickLockY.current != null &&
      Math.abs(window.scrollY - clickLockY.current) < 64
    ) {
      return;
    }
    if (clickLockY.current != null) {
      clickLockY.current = null;
    }
    const clamped = Math.min(1, Math.max(0, v));
    setProgress(clamped);
    setActiveIndex(Math.round(clamped * (count - 1)));
  });

  // Collapse highlights when the stop changes so the path stays visible
  // (adjust-state-during-render pattern instead of an effect)
  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);
  if (prevActiveIndex !== activeIndex) {
    setPrevActiveIndex(activeIndex);
    setExpanded([]);
  }

  const scrollTrackToProgress = useCallback(
    (nextProgress: number) => {
      const track = trackRef.current;
      if (!track) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, track.offsetHeight - window.innerHeight);
      const targetY = trackTop + nextProgress * scrollRange;
      clickLockY.current = targetY;
      window.scrollTo({
        top: targetY,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [shouldReduceMotion],
  );

  const selectStop = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(count - 1, Math.max(0, index));
      const nextProgress = clampedIndex / Math.max(1, count - 1);
      setActiveIndex(clampedIndex);
      setProgress(nextProgress);
      if (shouldReduceMotion) return;
      scrollTrackToProgress(nextProgress);
    },
    [count, shouldReduceMotion, scrollTrackToProgress],
  );

  const job = timeline[activeIndex];
  const isOpen = expanded.includes(job.id);

  const toggle = () => {
    setExpanded((prev) =>
      prev.includes(job.id)
        ? prev.filter((id) => id !== job.id)
        : [...prev, job.id],
    );
  };

  const trackHeight = shouldReduceMotion
    ? undefined
    : `${Math.max(200, count * PAGE_VH_PER_STOP)}vh`;

  const activeAccent = PIN_ACCENTS[activeIndex % PIN_ACCENTS.length];

  const stage = (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:gap-4 sm:px-6",
        !shouldReduceMotion &&
          "h-svh overflow-hidden bg-background pt-[4.5rem] pb-3",
      )}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          selectStop(Math.min(count - 1, activeIndex + 1));
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          selectStop(Math.max(0, activeIndex - 1));
        }
      }}
    >
      {/* Path owns the upper flex region and cannot be covered by the panel */}
      <div
        className={cn(
          "relative flex min-h-0 flex-col overflow-hidden rounded-3xl border",
          "bg-gradient-to-b from-card/80 via-background/40 to-card/50",
          "transition-[border-color,box-shadow] duration-700",
          shouldReduceMotion ? "h-[min(52vh,420px)]" : "flex-1",
        )}
        style={{
          borderColor: `color-mix(in oklch, ${activeAccent} 35%, var(--border))`,
          boxShadow: `0 0 90px color-mix(in oklch, ${activeAccent} 16%, transparent)`,
        }}
      >
        {/* Ambient glow re-tints to the active stop's accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
        >
          <div
            className="absolute top-0 left-1/4 size-48 rounded-full blur-[80px] transition-colors duration-700"
            style={{
              backgroundColor: `color-mix(in oklch, ${activeAccent} 26%, transparent)`,
            }}
          />
          <div
            className="absolute right-1/4 bottom-0 size-40 rounded-full blur-[70px] transition-colors duration-700"
            style={{
              backgroundColor: `color-mix(in oklch, ${activeAccent} 18%, transparent)`,
            }}
          />
        </div>

        {/* Giant crossfading year watermark - the loudest "you moved" cue */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <motion.div
            key={`watermark-${job.id}`}
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 40, scale: 0.94 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span
              className="font-heading text-[clamp(4rem,16vw,11rem)] leading-none font-bold tracking-tight"
              style={{
                color: `color-mix(in oklch, ${activeAccent} 14%, transparent)`,
              }}
            >
              {pinYearLabel(job)}
            </span>
            <span
              className="mt-1 font-mono text-sm uppercase tracking-[0.4em] sm:text-base"
              style={{
                color: `color-mix(in oklch, ${activeAccent} 34%, transparent)`,
              }}
            >
              {shortCompany(job.company)}
            </span>
          </motion.div>
        </div>

        {/* Journey progress bar pinned to the top edge of the path card */}
        <div className="absolute inset-x-0 top-0 h-1 bg-border/40" aria-hidden>
          <div
            className="h-full rounded-r-full transition-[width] duration-200 ease-out"
            style={{
              width: `${Math.round(progress * 100)}%`,
              background: `linear-gradient(to right, var(--brand), ${activeAccent})`,
              boxShadow: `0 0 12px ${activeAccent}`,
            }}
          />
        </div>

        <div className="relative flex shrink-0 items-center justify-between gap-2 px-4 pt-3 sm:px-5 sm:pt-4">
          <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand sm:text-xs">
            2013
          </span>
          {/* Live stop counter - updates with every scroll stop */}
          <span
            className="rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest transition-colors duration-500 sm:text-xs"
            style={{
              borderColor: `color-mix(in oklch, ${activeAccent} 45%, transparent)`,
              backgroundColor: `color-mix(in oklch, ${activeAccent} 14%, transparent)`,
              color: activeAccent,
            }}
          >
            {String(activeIndex + 1).padStart(2, "0")}/
            {String(count).padStart(2, "0")} ·{" "}
            {shortCompany(job.company)}
          </span>
          <span className="hidden rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand-secondary sm:inline sm:text-xs">
            Present · 2026
          </span>
        </div>

        <div className="relative min-h-0 flex-1 px-2 pb-3 sm:px-4 lg:hidden">
          <RoadmapSvg
            idPrefix="road-mobile"
            pathD={MOBILE_PATH}
            viewBox="0 0 160 800"
            points={mobilePoints}
            jobs={timeline}
            activeIndex={activeIndex}
            progress={progress}
            reducedMotion={shouldReduceMotion}
            onSelect={selectStop}
            compactLabels
          />
        </div>

        <div className="relative hidden min-h-0 flex-1 px-2 pb-4 sm:px-4 lg:block">
          <RoadmapSvg
            idPrefix="road-desktop"
            pathD={DESKTOP_PATH}
            viewBox="0 0 1200 480"
            points={desktopPoints}
            jobs={timeline}
            activeIndex={activeIndex}
            progress={progress}
            reducedMotion={shouldReduceMotion}
            onSelect={selectStop}
          />
        </div>
      </div>

      {/* Panel is height-capped; highlights scroll inside - never overlaps path */}
      <div className="h-[min(34svh,300px)] shrink-0 sm:h-[min(32svh,280px)]">
        <DetailPanel
          job={job}
          index={activeIndex}
          total={count}
          isOpen={isOpen}
          onToggle={toggle}
          onPrev={() => selectStop(Math.max(0, activeIndex - 1))}
          onNext={() => selectStop(Math.min(count - 1, activeIndex + 1))}
          onSelect={selectStop}
        />
      </div>

      <p className="shrink-0 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 sm:text-xs">
        Scroll to travel · click a pin to jump
      </p>
    </div>
  );

  return (
    <section id="experience" className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Experience
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Places I&apos;ve done the work.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A winding path from where I started to where I am now - once this
            stage pins, keep scrolling to travel, or tap a pin to jump.
          </p>
        </Reveal>
      </div>

      {/*
        Tall page track + sticky full-viewport stage.
        While pinned, page scroll only advances the traveler + panel.
        Stage fills the viewport so the track never reads as empty black.
      */}
      <div
        ref={trackRef}
        className="relative mt-8 sm:mt-10"
        style={trackHeight ? { height: trackHeight } : undefined}
      >
        <div className={cn(!shouldReduceMotion && "sticky top-0")}>{stage}</div>
      </div>
    </section>
  );
}
