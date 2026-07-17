import { about } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";

export function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            About
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Building UI systems that scale with the product — and the team.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            {about.summary}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {about.superpowers.map((item, i) => (
            <Reveal key={item.title} delay={0.15 + i * 0.05}>
              <div className="group h-full rounded-2xl border border-border/80 bg-card/40 p-6 transition-colors hover:border-brand/30">
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
