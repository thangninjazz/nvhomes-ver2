import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ProjectsSection } from "@/components/landing/projects-section"
import { ProcessSection } from "@/components/landing/process-section"
import { ContactSection } from "@/components/landing/contact-section"

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth">
      <HeroSection />
      <FeaturesSection />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
    </main>
  )
}
