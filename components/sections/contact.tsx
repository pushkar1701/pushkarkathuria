import { ArrowDownRight, Download, Mail } from "lucide-react";
import { siteConfig } from "@/content/site";
import { LinkButton } from "@/components/link-button";
import { Reveal } from "@/components/motion/reveal";

export function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/10 via-card to-brand-secondary/10 p-6 sm:p-8 md:p-12">
            <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-brand/20 blur-[80px]" />

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
              Contact
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Got a frontend problem worth solving? Say hi.
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              I&apos;m looking for Senior / Staff Frontend or UI Architect roles - 
              remote, or relocating if the work is right.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <LinkButton href={`mailto:${siteConfig.email}`} size="lg">
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
              >
                LinkedIn
                <ArrowDownRight data-icon="inline-end" />
              </LinkButton>
              <LinkButton href="/resume" size="lg" variant="ghost">
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
