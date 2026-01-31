import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
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

async function getEducation() {
  return await prisma.education.findMany({ orderBy: { startDate: 'desc' } });
}

async function getHobbies() {
  return await prisma.hobby.findMany({ orderBy: { createdAt: 'asc' } });
}

async function getInterests() {
  return await prisma.interest.findMany({ orderBy: { createdAt: 'asc' } });
}

async function getLanguages() {
  return await prisma.language.findMany({ orderBy: { proficiency: 'asc' } });
}

export default async function Home() {
  const skills = await getSkills();
  const projects = await getProjects();
  const experiences = await getExperience();
  const education = await getEducation();
  const hobbies = await getHobbies();
  const interests = await getInterests();
  const languages = await getLanguages();

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
                <div className={styles.skillInfo}>
                  {skill.icon && <span className={styles.skillIcon}>{skill.icon}</span>}
                  <span>{skill.name}</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
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
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className={styles.projectImage} />
                ) : (
                  <div className={styles.projectImage} />
                )}
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <div className={styles.projectLinks}>
                    {project.demoUrl && <a href={project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>Live Demo</a>}
                    {project.repoUrl && <a href={project.repoUrl.startsWith('http') ? project.repoUrl : `https://${project.repoUrl}`} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>GitHub</a>}
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

      {/* Education Section */}
      <section id="education" className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        <div className={styles.experienceList}>
          {education.length > 0 ? (
            education.map((edu) => (
              <div key={edu.id} className={styles.experienceItem}>
                <h3 className={styles.expRole}>{edu.institution}</h3>
                <div className={styles.expCompany}>{edu.degree} in {edu.fieldOfStudy}</div>
                <div className={styles.expDate}>
                  {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                </div>
                {edu.score && <p className={styles.expDesc}>Grade/Score: {edu.score}</p>}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No education added yet.</p>
          )}
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className={styles.section}>
        <h2 className={styles.sectionTitle}>Languages</h2>
        <div className={styles.skillsGrid}>
          {languages.length > 0 ? (
            languages.map((lang) => (
              <div key={lang.id} className={styles.skillBadge} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{lang.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{lang.proficiency}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No languages added yet.</p>
          )}
        </div>
      </section>

      {/* Hobbies and Interests Grid */}
      <section id="hobbies-interests" className={styles.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem', textAlign: 'left' }}>Hobbies</h2>
            <div className={styles.skillsGrid} style={{ justifyContent: 'flex-start' }}>
              {hobbies.map((hobby) => (
                <div key={hobby.id} className={styles.skillBadge} style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{hobby.emoji}</span>
                  <span>{hobby.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem', textAlign: 'left' }}>Interests</h2>
            <div className={styles.skillsGrid} style={{ justifyContent: 'flex-start' }}>
              {interests.map((interest) => (
                <div key={interest.id} className={styles.skillBadge} style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{interest.emoji}</span>
                  <span>{interest.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.section} style={{ textAlign: 'center' }}>
        <h2 className={styles.sectionTitle}>Get In Touch</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', marginInline: 'auto' }}>
          Interested in working together? Feel free to reach out via email or connect with me on social media!
        </p>
        <div className={styles.socialLinks}>
          <a href="mailto:savewaris@gmail.com" className={styles.socialLink} title="Email">
            <FaEnvelope />
          </a>
          <a href="https://github.com/savewaris" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/waris-khamkaweepart/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/save.waris/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Instagram">
            <FaInstagram />
          </a>
        </div>
      </section>
    </div>
  );
}
