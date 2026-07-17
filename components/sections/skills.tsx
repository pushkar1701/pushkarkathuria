import { skills } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

const categories = [
  { key: "frontend" as const, label: "Frontend & how I structure UI" },
  { key: "visualization" as const, label: "Styling & visualization" },
  { key: "platforms" as const, label: "Platforms I've worked on" },
  { key: "leadership" as const, label: "How I work with people" },
  { key: "tools" as const, label: "Tools & everyday stack" },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Skills
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            What I reach for when I build.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.key} delay={i * 0.05} className="min-w-0">
              <div className="h-full rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
                <h3 className="font-heading font-semibold">{cat.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills[cat.key].map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="h-auto max-w-full whitespace-normal"
                    >
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
