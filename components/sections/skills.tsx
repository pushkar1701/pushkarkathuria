import { skills } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

const categories = [
  { key: "frontend" as const, label: "Frontend & Architecture" },
  { key: "visualization" as const, label: "Data Visualization" },
  { key: "leadership" as const, label: "Leadership" },
  { key: "tools" as const, label: "Tools & Delivery" },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Skills
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            React, TypeScript, and the craft around great UI.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <Reveal key={cat.key} delay={i * 0.05}>
              <div className="rounded-2xl border border-border/80 bg-card/40 p-6">
                <h3 className="font-heading font-semibold">{cat.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills[cat.key].map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
