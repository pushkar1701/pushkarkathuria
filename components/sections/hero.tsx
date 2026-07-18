"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Download, Mail } from "lucide-react";
import { hero, siteConfig } from "@/content/site";
import { LinkButton } from "@/components/link-button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: "13+", label: "years building web UIs", accent: "var(--brand)" },
  { value: "7", label: "companies, support to founding engineer", accent: "oklch(0.8 0.14 85)" },
  { value: "5", label: "iOS apps shipped under my own label", accent: "var(--brand-secondary)" },
] as const;

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 size-[min(480px,80vw)] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute bottom-0 -left-24 size-[min(360px,70vw)] rounded-full bg-brand-secondary/15 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:32px_32px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="min-w-0">
          <Reveal>
            <Badge
              variant="outline"
              className="mb-6 h-auto max-w-full shrink border-brand/40 px-3 py-1.5 text-left leading-snug whitespace-normal text-brand"
            >
              {hero.availability}
            </Badge>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {siteConfig.location}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 className="font-heading text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Pushkar
              <br />
              <span className="bg-gradient-to-r from-brand via-brand-secondary to-brand bg-clip-text text-transparent">
                Kathuria
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-xl font-medium text-foreground/90 sm:text-3xl">
              {hero.headline}
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {hero.subheadline}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
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

          {/* Compact stats strip on mobile/tablet, where the side card is hidden */}
          <Reveal delay={0.35} className="lg:hidden">
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd
                    className="font-heading text-2xl font-bold"
                    style={{ color: stat.accent }}
                  >
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Personal signal card — about me, not my projects */}
        <div className="relative hidden lg:block">
          <Reveal delay={0.25} direction="left">
            <motion.div
              animate={
                shouldReduceMotion ? undefined : { y: [0, -8, 0] }
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/50 p-7 backdrop-blur-sm shadow-[0_0_60px_oklch(from_var(--brand)_l_c_h_/_0.07)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--brand), var(--brand-secondary), transparent)",
                }}
              />

              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Currently
              </p>
              <p className="mt-3 font-heading text-xl font-semibold leading-snug">
                Founding Engineer / UI Technical Lead
              </p>
              <p className="mt-1 text-sm font-medium text-brand">
                Datalogz · Apr 2024 — Present
              </p>

              <div className="my-6 h-px bg-border/60" />

              <dl className="space-y-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-4">
                    <dd
                      className="w-12 shrink-0 font-heading text-3xl font-bold"
                      style={{ color: stat.accent }}
                    >
                      {stat.value}
                    </dd>
                    <dt className="text-sm leading-snug text-muted-foreground">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <div className="my-6 h-px bg-border/60" />

              <a
                href="#experience"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
              >
                Trace the whole path
                <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
