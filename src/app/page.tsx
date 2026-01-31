import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const revalidate = 0; // Disable cache for demo purposes or use a revalidation strategy

async function getSkills() {
  return await prisma.skill.findMany({ orderBy: { proficiency: 'desc' } });
}

async function getProjects() {
  return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
}

async function getExperience() {
  return await prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
}

export default async function Home() {
  const skills = await getSkills();
  const projects = await getProjects();
  const experiences = await getExperience();

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Full Stack Developer.<br />Building Digital Experiences.</h1>
        <p>I build accessible, pixel-perfect, and performant web applications.</p>
        <div className={styles.heroButtons}>
          <Link href="#projects" className={styles.ctaPrimary}>View Work</Link>
          <Link href="#contact" className={styles.ctaSecondary}>Contact Me</Link>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills & Technologies</h2>
        <div className={styles.skillsGrid}>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className={styles.skillBadge}>
                {skill.icon && <span>{skill.icon}</span>}
                <span>{skill.name}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No skills added yet.</p>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Projects</h2>
        <div className={styles.projectsGrid}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectImage} /> {/* Placeholder for real image */}
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <div className={styles.projectLinks}>
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" className={styles.projectLink}>Live Demo</a>}
                    {project.repoUrl && <a href={project.repoUrl} target="_blank" className={styles.projectLink}>GitHub</a>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No projects added yet.</p>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={styles.experienceList}>
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp.id} className={styles.experienceItem}>
                <h3 className={styles.expRole}>{exp.role}</h3>
                <div className={styles.expCompany}>{exp.company} | {exp.location}</div>
                <div className={styles.expDate}>
                  {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </div>
                <p className={styles.expDesc}>{exp.description}</p>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No experience added yet.</p>
          )}
        </div>
      </section>

      {/* Contact Section Placeholder */}
      <section id="contact" className={styles.section} style={{ textAlign: 'center' }}>
        <h2 className={styles.sectionTitle}>Get In Touch</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Interested in working together? Feel free to reach out!
        </p>
        <a href="mailto:email@example.com" className={styles.ctaPrimary}>Say Hello</a>
      </section>
    </div>
  );
}
