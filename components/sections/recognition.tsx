import { education, recognition } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { QuestSectionTracker } from "@/components/quest/use-quest-section";

export function RecognitionSection() {
  return (
    <section id="recognition" className="py-16 sm:py-24">
      <QuestSectionTracker sectionId="recognition" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Recognition
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            A few milestones along the way.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2">
          {recognition.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} className="min-w-0">
              <div className="h-full rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
                <h3 className="font-heading font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-6 rounded-2xl border border-dashed border-border/80 p-5 sm:mt-8 sm:p-6">
            <h3 className="font-heading font-semibold">Education</h3>
            <p className="mt-2 text-foreground">{education.degree}</p>
            <p className="text-sm text-muted-foreground sm:text-base">
              {education.school} · {education.dates} · {education.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
