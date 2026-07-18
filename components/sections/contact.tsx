"use client";

import { ArrowDownRight, Download, Mail } from "lucide-react";
import { questCopy } from "@/content/quest";
import { siteConfig } from "@/content/site";
import { LinkButton } from "@/components/link-button";
import { Reveal } from "@/components/motion/reveal";
import { useQuestOptional } from "@/components/quest/quest-provider";
import { QuestSectionTracker } from "@/components/quest/use-quest-section";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const quest = useQuestOptional();
  const complete = Boolean(quest?.state.questComplete && !quest.state.skipped);

  return (
    <section id="contact" className="py-16 sm:py-24">
      <QuestSectionTracker sectionId="contact" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/10 via-card to-brand-secondary/10 p-6 sm:p-8 md:p-12",
              complete &&
                "shadow-[0_0_80px_oklch(from_var(--brand)_l_c_h_/_0.18)]",
            )}
          >
            <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-brand/20 blur-[80px]" />
            {complete && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
              />
            )}

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
              Contact
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Got a frontend problem worth solving? Say hi.
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              I&apos;m looking for Senior / Staff Frontend or UI Architect roles —
              remote, or relocating if the work is right.
            </p>
            {complete && (
              <p className="mt-3 max-w-xl text-sm font-medium text-brand">
                {questCopy.contactComplete}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <LinkButton
                href={`mailto:${siteConfig.email}`}
                size="lg"
                onClick={() =>
                  quest?.emit({ type: "contact_cta", kind: "email" })
                }
              >
                <Mail data-icon="inline-start" />
                <span className="sm:hidden">Email me</span>
                <span className="hidden max-w-[18rem] truncate sm:inline">
                  {siteConfig.email}
                </span>
              </LinkButton>
              <LinkButton
                href={siteConfig.linkedin}
                size="lg"
                variant="outline"
                onClick={() =>
                  quest?.emit({ type: "contact_cta", kind: "linkedin" })
                }
              >
                LinkedIn
                <ArrowDownRight data-icon="inline-end" />
              </LinkButton>
              <LinkButton
                href="/resume"
                size="lg"
                variant="ghost"
                onClick={() =>
                  quest?.emit({ type: "contact_cta", kind: "resume" })
                }
              >
                <Download data-icon="inline-start" />
                <span className="sm:hidden">Resume</span>
                <span className="hidden sm:inline">Download Resume</span>
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
