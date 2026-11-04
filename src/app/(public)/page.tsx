import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Certifications from "@/components/sections/Certifications";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import {
  getCertifications,
  getEducation,
  getExperiences,
  getFaq,
  getProjects,
  getServices,
  getSkills,
} from "@/lib/content";

// Content is read from MySQL/TiDB and memoised in src/lib/content.ts.
// The pool stays warm, so revalidation is cheap.
export const revalidate = 60;

export default async function HomePage() {
  const [skills, services, projects, experiences, education, certifications, faq] =
    await Promise.all([
      getSkills(),
      getServices(),
      getProjects({ publishedOnly: true }),
      getExperiences(),
      getEducation(),
      getCertifications(),
      getFaq(),
    ]);

  return (
    <>
      <Hero />
      <About />
      <Skills skills={skills} />
      <Services services={services} />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Education education={education} />
      <Certifications certifications={certifications} />
      <FAQ faq={faq} />
      <Contact />
    </>
  );
}
