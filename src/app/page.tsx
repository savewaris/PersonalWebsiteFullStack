import {
  getSkills,
  getProjects,
  getExperiences,
  getEducation,
  getHobbies,
  getInterests,
  getLanguages,
  getStats,
} from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StaggerContainer } from '@/components/MotionWrappers';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceEducationSection } from '@/components/sections/ExperienceEducationSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { LanguagesInterestsSection } from '@/components/sections/LanguagesInterestsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import styles from './page.module.css';

export const revalidate = 0;

export default async function Home() {
  const [skills, projects, experiences, education, hobbies, interests, languages, stats] = await Promise.all([
    getSkills(),
    getProjects(),
    getExperiences(),
    getEducation(),
    getHobbies(),
    getInterests(),
    getLanguages(),
    getStats(),
  ]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '64px' }}>
        <div className={styles.page}>
          <StaggerContainer className={styles.bentoContainer}>
            <HeroSection />
            <StatsSection stats={stats} />
            <AboutSection />
            <SkillsSection skills={skills} />
            <ExperienceEducationSection experiences={experiences} education={education} />
            <ProjectsSection projects={projects} />
            <LanguagesInterestsSection languages={languages} hobbies={hobbies} interests={interests} />
            <ContactSection />
          </StaggerContainer>
        </div>
      </main>
      <Footer />
    </>
  );
}
