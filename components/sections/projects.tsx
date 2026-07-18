import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Same accent cycle as the Experience roadmap pins, for visual continuity. */
const GROUP_ACCENTS = [
  "var(--brand)",
  "oklch(0.8 0.14 85)",
  "var(--brand-secondary)",
  "oklch(0.76 0.13 155)",
] as const;

type Project = (typeof projects)[number];

/** Group projects by company, preserving the order they appear in. */
function groupByCompany(items: readonly Project[]) {
  const order: string[] = [];
  const map = new Map<string, Project[]>();
  for (const item of items) {
    if (!map.has(item.company)) {
      map.set(item.company, []);
      order.push(item.company);
    }
    map.get(item.company)!.push(item);
  }
  return order.map((company) => ({ company, items: map.get(company)! }));
}

function ProjectCard({
  project,
  accent,
}: {
  project: Project;
  accent: string;
}) {
  const hasUrl = "url" in project && Boolean(project.url);

  const card = (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklch,var(--accent)_45%,transparent)] hover:bg-card/80 sm:p-6">
      {/* Accent glow that fades in on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(140% 90% at 50% 0%, color-mix(in oklch, ${accent} 12%, transparent), transparent 65%)`,
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
        <h3 className="min-w-0 font-heading text-lg font-semibold sm:text-xl">
          {project.title}
        </h3>
        {hasUrl && (
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

      <p
        className="relative mt-2 text-sm font-medium leading-relaxed"
        style={{ color: `color-mix(in oklch, ${accent} 45%, white)` }}
      >
        {project.metric}
      </p>
      <p className="relative mt-3 flex-1 text-sm text-muted-foreground">
        {project.description}
      </p>

      <div className="relative mt-5 flex flex-wrap gap-2">
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

  if (!hasUrl) return card;

  return (
    <a
      href={(project as { url: string }).url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {card}
    </a>
  );
}

export function ProjectsSection() {
  const groups = groupByCompany(projects);

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
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Grouped by where I built them — from consulting programs to
            founding-engineer work and things I shipped on my own.
          </p>
        </Reveal>

        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20">
          {groups.map((group, gi) => {
            const accent = GROUP_ACCENTS[gi % GROUP_ACCENTS.length];
            const single = group.items.length === 1;

            return (
              <div
                key={group.company}
                className="relative grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12"
                style={{ "--accent": accent } as React.CSSProperties}
              >
                {/* Company rail */}
                <Reveal className="min-w-0">
                  <div className="lg:sticky lg:top-28">
                    <div className="flex items-baseline gap-3 lg:flex-col lg:gap-0">
                      <span
                        className="font-mono text-xs font-semibold tracking-[0.3em]"
                        style={{ color: accent }}
                      >
                        {String(gi + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl lg:mt-2">
                        {group.company}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground lg:mt-2">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "project" : "projects"}
                    </p>
                    <div
                      aria-hidden
                      className="mt-4 hidden h-px w-16 lg:block"
                      style={{
                        background: `linear-gradient(to right, ${accent}, transparent)`,
                      }}
                    />
                  </div>
                </Reveal>

                {/* Project cards */}
                <div
                  className={cn(
                    "grid min-w-0 gap-4 sm:gap-6",
                    !single && "md:grid-cols-2",
                  )}
                >
                  {group.items.map((project, pi) => (
                    <Reveal
                      key={project.slug}
                      delay={pi * 0.06}
                      className="min-w-0"
                    >
                      <ProjectCard project={project} accent={accent} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
