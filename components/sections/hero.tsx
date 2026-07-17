"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Download, Mail } from "lucide-react";
import { hero, projects, siteConfig } from "@/content/site";
import { LinkButton } from "@/components/link-button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 size-[480px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute bottom-0 -left-24 size-[360px] rounded-full bg-brand-secondary/15 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:32px_32px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <Reveal>
            <Badge variant="outline" className="mb-6 border-brand/40 text-brand">
              {hero.availability}
            </Badge>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {siteConfig.location}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Pushkar
              <br />
              <span className="bg-gradient-to-r from-brand via-brand-secondary to-brand bg-clip-text text-transparent">
                Kathuria
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-2xl font-medium text-foreground/90 sm:text-3xl">
              {hero.headline}
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              {hero.subheadline}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <LinkButton href={`mailto:${siteConfig.email}`} size="lg">
                <Mail data-icon="inline-start" />
                Email me
              </LinkButton>
              <LinkButton
                href={siteConfig.linkedin}
                size="lg"
                variant="outline"
              >
                LinkedIn
                <ArrowDownRight data-icon="inline-end" />
              </LinkButton>
              <LinkButton href="/resume" size="lg" variant="ghost">
                <Download data-icon="inline-start" />
                Resume
              </LinkButton>
            </div>
          </Reveal>
        </div>

        <div className="relative hidden lg:block">
          {!shouldReduceMotion && (
            <motion.div
              className="absolute -top-8 right-0 size-24 rounded-2xl border border-brand/30 bg-brand/10"
              animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="flex flex-col gap-4">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={0.2 + i * 0.1} direction="left">
                <div
                  className="group rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-brand/40"
                  style={{ marginLeft: `${i * 24}px` }}
                >
                  <p className="text-xs uppercase tracking-wider text-brand">
                    {project.company}
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold">
                    {project.title}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.metric}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
