import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const spanClasses = {
  lg: "md:col-span-2",
  md: "md:col-span-1",
  sm: "md:col-span-1",
} as const;

/** Same accent cycle as the Experience roadmap pins, for visual continuity. */
const CARD_ACCENTS = [
  "var(--brand)",
  "oklch(0.8 0.14 85)",
  "var(--brand-secondary)",
  "oklch(0.76 0.13 155)",
] as const;

export function ProjectsSection() {
  return (
    <section id="projects" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Projects
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            A few things I&apos;m proud of shipping.
          </h2>
        </Reveal>

        <div className="mt-10 grid auto-rows-fr gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
          {projects.map((project, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            const Card = (
              <article
                className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklch,var(--accent)_45%,transparent)] hover:bg-card/80 sm:p-6"
                style={
                  {
                    "--accent": accent,
                  } as React.CSSProperties
                }
              >
                {/* Accent glow that fades in on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(140% 90% at 50% 0%, color-mix(in oklch, ${accent} 14%, transparent), transparent 65%)`,
                  }}
                />
                {/* Accent hairline along the top edge */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
                  }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-background transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: accent }}
                      >
                        {project.company}
                      </p>
                      <h3 className="mt-1.5 font-heading text-lg font-semibold sm:text-xl md:text-2xl">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  {"url" in project && project.url && (
                    <span className="relative shrink-0 overflow-hidden rounded-full border border-border/70 p-1.5 text-muted-foreground transition-colors duration-300 group-hover:border-transparent group-hover:text-background">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ backgroundColor: accent }}
                      />
                      <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>

                <p className="relative mt-4 text-sm font-medium leading-relaxed text-foreground/90">
                  {project.metric}
                </p>
                <p className="relative mt-3 flex-1 text-sm text-muted-foreground sm:text-base">
                  {project.description}
                </p>

                <div className="relative mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="max-w-full whitespace-normal transition-colors group-hover:bg-secondary/80"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </article>
            );

            return (
              <Reveal
                key={project.slug}
                delay={i * 0.05}
                className={cn("min-w-0", spanClasses[project.span])}
              >
                {"url" in project && project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {Card}
                  </a>
                ) : (
                  Card
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
