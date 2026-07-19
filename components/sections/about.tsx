import { about } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            About
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            I build interfaces that hold up when the product - and the team - get bigger.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-3xl text-base text-muted-foreground sm:text-lg">
            {about.summary}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2">
          {about.superpowers.map((item, i) => (
            <Reveal key={item.title} delay={0.15 + i * 0.05} className="min-w-0">
              <div className="group h-full rounded-2xl border border-border/80 bg-card/40 p-5 transition-colors hover:border-brand/30 sm:p-6">
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
