"use client";

import {
  useCallback,
  useEffect,
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
import { useQuestOptional } from "@/components/quest/quest-provider";
import { QuestSectionTracker } from "@/components/quest/use-quest-section";
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
  const yearLabel = isPresent(job.dates)
    ? "Present · 2026"
    : parseYear(job.dates);

  return (
    <div
      className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm sm:p-6"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex size-8 items-center justify-center rounded-full text-sm font-bold text-background"
            style={{ backgroundColor: accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
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
            className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-30"
            aria-label="Previous stop"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={index === total - 1}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-30"
            aria-label="Next stop"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        className="mt-4 flex flex-wrap gap-1.5"
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

      <h3 className="mt-5 font-heading text-xl font-semibold sm:text-2xl">
        {job.role}
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
        {job.company}
      </p>
      <p className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
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
      <p className="mt-2 text-sm text-muted-foreground/85">{job.context}</p>

      <button
        type="button"
        onClick={onToggle}
        className="mt-5 flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
        <ul className="mt-3 flex flex-col gap-2.5 px-1">
          {job.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-sm leading-relaxed text-muted-foreground before:mr-2 before:text-brand before:content-['→']"
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}
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
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.55" />
          <stop
            offset="50%"
            stopColor="var(--brand-secondary)"
            stopOpacity="0.45"
          />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.55" />
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

      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={`url(#${glowId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - drawn}
        opacity="0.9"
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
              <circle
                cy="-10"
                r={active ? 18 : 15}
                fill={accent}
                filter={active ? `url(#${pinGlowId})` : undefined}
              />
              <text
                y="-6"
                textAnchor="middle"
                className="fill-background font-heading text-[11px] font-bold"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                {String(i + 1)}
              </text>
              <text
                y={compactLabels ? 32 : 34}
                textAnchor="middle"
                style={{
                  fontSize: compactLabels ? 8 : 10,
                  fontFamily: "var(--font-geist-mono), monospace",
                  fill: "oklch(0.72 0.02 280)",
                  opacity: active ? 1 : 0.7,
                }}
              >
                {year}
              </text>
              {present && !compactLabels && (
                <text
                  y="48"
                  textAnchor="middle"
                  style={{
                    fontSize: 9,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fill: "var(--brand-secondary)",
                    opacity: active ? 1 : 0.75,
                  }}
                >
                  2026
                </text>
              )}
              <text
                y={present && !compactLabels ? 62 : compactLabels ? 44 : 50}
                textAnchor="middle"
                style={{
                  fontSize: compactLabels ? 8 : 10,
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
          <circle r="10" fill="var(--brand-secondary)" opacity="0.25" />
          <circle r="5" fill="white" />
          <circle r="3" fill="var(--brand)" />
        </motion.g>
      )}
    </svg>
  );
}

export function ExperienceSection() {
  const count = timeline.length;
  const shouldReduceMotion = useReducedMotion();
  const quest = useQuestOptional();
  const sectionRef = useRef<HTMLElement>(null);
  const clickLockY = useRef<number | null>(null);

  // Default to the latest stop (Present) at the right end of the path
  const [activeIndex, setActiveIndex] = useState(count - 1);
  const [progress, setProgress] = useState(1);
  const [expanded, setExpanded] = useState<string[]>(
    experience.filter((e) => e.featured).map((e) => e.id),
  );

  const desktopPoints = usePathPoints(DESKTOP_PATH, count);
  const mobilePoints = usePathPoints(MOBILE_PATH, count);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.35"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: shouldReduceMotion ? 1000 : 90,
    damping: shouldReduceMotion ? 100 : 28,
    mass: 0.35,
  });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (
      clickLockY.current != null &&
      Math.abs(window.scrollY - clickLockY.current) < 120
    ) {
      return;
    }
    clickLockY.current = null;
    const clamped = Math.min(1, Math.max(0, v));
    setProgress(clamped);
    setActiveIndex(Math.round(clamped * (count - 1)));
  });

  const selectStop = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(count - 1, Math.max(0, index));
      const nextProgress = clampedIndex / Math.max(1, count - 1);
      clickLockY.current = window.scrollY;
      setActiveIndex(clampedIndex);
      setProgress(nextProgress);
    },
    [count],
  );

  const job = timeline[activeIndex];
  const isOpen = expanded.includes(job.id);

  const emitQuest = quest?.emit;
  const experienceEntered = Boolean(
    quest?.state.visitedSections.includes("experience"),
  );
  useEffect(() => {
    if (!experienceEntered || !emitQuest) return;
    const stop = timeline[activeIndex];
    if (!stop) return;
    emitQuest({ type: "experience_pin", jobId: stop.id });
  }, [activeIndex, emitQuest, experienceEntered]);

  const toggle = () => {
    setExpanded((prev) => {
      const opening = !prev.includes(job.id);
      if (opening) {
        quest?.emit({ type: "experience_expand" });
      }
      return opening
        ? [...prev, job.id]
        : prev.filter((id) => id !== job.id);
    });
  };

  return (
    <section id="experience" ref={sectionRef} className="relative py-16 sm:py-24">
      <QuestSectionTracker sectionId="experience" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Experience
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Places I&apos;ve done the work.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A winding path from where I started to where I am now — scroll to
            travel, or tap a pin to jump.
          </p>
        </Reveal>

        <div className="mt-10 sm:mt-12">
          <div
            className={cn(
              "relative overflow-visible rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 via-background/40 to-card/50",
              "shadow-[0_0_80px_oklch(from_var(--brand)_l_c_h_/_0.08)]",
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
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
            >
              <div className="absolute top-0 left-1/4 size-48 rounded-full bg-brand/20 blur-[80px]" />
              <div className="absolute right-1/4 bottom-0 size-40 rounded-full bg-brand-secondary/15 blur-[70px]" />
            </div>

            <div className="relative flex items-center justify-between px-4 pt-4 sm:px-6">
              <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand sm:text-xs">
                2013
              </span>
              <span className="rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand-secondary sm:text-xs">
                Present · 2026
              </span>
            </div>

            <div className="relative mx-auto h-[min(62vh,560px)] w-full px-2 pt-1 pb-4 sm:px-4 lg:hidden">
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

            <div className="relative mx-auto hidden h-[min(56vh,480px)] w-full px-2 pt-2 pb-8 sm:px-4 lg:block">
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

          <div className="mt-5 sm:mt-6">
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

          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 sm:text-xs">
            Scroll to travel · click a pin to jump
          </p>
        </div>
      </div>
    </section>
  );
}
