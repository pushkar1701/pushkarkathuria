"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { experience } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const [expanded, setExpanded] = useState<string[]>(
    experience.filter((e) => e.featured).map((e) => e.id),
  );

  const toggle = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Experience
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Nearly 14 years across SaaS, enterprise, and media.
          </h2>
        </Reveal>

        <div className="relative mt-12">
          <div
            className="absolute left-[11px] top-2 hidden h-[calc(100%-16px)] w-px bg-border md:block"
            aria-hidden
          />

          <div className="flex flex-col gap-4">
            {experience.map((job, i) => {
              const isOpen = expanded.includes(job.id);

              return (
                <Reveal key={job.id} delay={i * 0.04}>
                  <div className="relative md:pl-10">
                    <div
                      className="absolute left-0 top-6 hidden size-[22px] rounded-full border-2 border-brand bg-background md:block"
                      aria-hidden
                    />

                    <div className="rounded-2xl border border-border/80 bg-card/40">
                      <button
                        type="button"
                        onClick={() => toggle(job.id)}
                        className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                        aria-expanded={isOpen}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h3 className="font-heading text-lg font-semibold">
                              {job.role}
                            </h3>
                            <span className="text-sm text-brand">{job.company}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {job.dates} · {job.location}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground/80">
                            {job.context}
                          </p>
                        </div>
                        <ChevronDown
                          className={cn(
                            "mt-1 shrink-0 text-muted-foreground transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>

                      {isOpen && (
                        <ul className="flex flex-col gap-2 border-t border-border/60 px-6 py-4">
                          {job.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="text-sm text-muted-foreground before:mr-2 before:text-brand before:content-['→']"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
