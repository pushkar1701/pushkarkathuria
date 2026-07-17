import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const spanClasses = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-1",
  sm: "md:col-span-1",
} as const;

export function ProjectsSection() {
  return (
    <section id="work" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Selected Work
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            A few things I&apos;m proud of shipping.
          </h2>
        </Reveal>

        <div className="mt-10 grid auto-rows-fr gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
          {projects.map((project, i) => {
            const Card = (
              <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-border/80 bg-card/50 p-5 transition-all hover:border-brand/40 hover:bg-card/80 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-brand">
                      {project.company}
                    </p>
                    <h3 className="mt-2 font-heading text-lg font-semibold sm:text-xl md:text-2xl">
                      {project.title}
                    </h3>
                  </div>
                  {"url" in project && project.url && (
                    <ArrowUpRight className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                  )}
                </div>

                <p className="mt-3 text-sm font-medium text-foreground/90">
                  {project.metric}
                </p>
                <p className="mt-3 flex-1 text-sm text-muted-foreground sm:text-base">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="max-w-full whitespace-normal">
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
