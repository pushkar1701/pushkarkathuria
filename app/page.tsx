import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceSection } from "@/components/sections/experience";
import { SkillsSection } from "@/components/sections/skills";
import { RecognitionSection } from "@/components/sections/recognition";
import { ContactSection } from "@/components/sections/contact";
import { FlightProvider } from "@/components/flight/flight-provider";
import { FlightShell } from "@/components/flight/flight-shell";

export default function HomePage() {
  return (
    <FlightProvider>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsSection />
        <RecognitionSection />
        <ContactSection />
      </main>
      <Footer />
      <FlightShell />
    </FlightProvider>
  );
}
