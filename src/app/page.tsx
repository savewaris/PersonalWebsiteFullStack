import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

// Lazy load heavy client components
const ReactMarkdown = dynamic(() => import('react-markdown'), { 
  loading: () => <div style={{ height: '20px', opacity: 0.5, animation: 'pulse 2s infinite' }}>Loading...</div> 
});
const ContactForm = dynamic(() => import('@/components/ContactForm'), { 
  loading: () => <div style={{ height: '200px', opacity: 0.5, animation: 'pulse 2s infinite' }}>Loading form...</div> 
});

import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/MotionWrappers';
import styles from './page.module.css';

export const revalidate = 0;

// Extend Prisma's Education type with the newly added faculty field
// (Prisma client will auto-pick this up after next server restart)
type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  faculty: string | null;
  startDate: Date;
  endDate: Date | null;
  score: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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
  const education = await getEducation() as EducationEntry[];
  const hobbies = await getHobbies();
  const interests = await getInterests();
  const languages = await getLanguages();

  // "Quick Stats" for the dashboard
  const stats = {
    projects: await prisma.project.count(),
    skills: await prisma.skill.count(),
    experience: await prisma.experience.count(),
  };

  return (
    <div className={styles.page}>
      <StaggerContainer className={styles.bentoContainer}>
        
        {/* Hero Section - Spans 3 cols */}
        <StaggerItem className={`${styles.bentoItem} ${styles.span3}`} style={{ minHeight: '400px', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left', padding: '48px' }}>
          <h1 className={styles.heroTitle} style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
            Full Stack Developer.<br />Building Digital Experiences.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', marginBottom: '48px' }}>
            I build accessible, pixel-perfect, and performant web applications with a focus on modern architectures.
          </p>
          <div className={styles.heroButtons} style={{ display: 'flex', gap: '16px' }}>
            <Link href="#projects" className={styles.ctaPrimary}>View Work</Link>
            <Link href="#contact" className={styles.ctaSecondary}>Contact Me</Link>
          </div>
        </StaggerItem>

        {/* Quick Stats - Spans 1 col */}
        <StaggerItem className={`${styles.bentoItem} ${styles.span1}`} style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.projects}+</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects Shipped</span>
          </div>
          <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.skills}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Technologies</span>
          </div>
          <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.experience}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Roles Held</span>
          </div>
        </StaggerItem>

        {/* Bio / About Section - Spans 2 cols */}
        <StaggerItem className={`${styles.bentoItem} ${styles.span2}`}>
          <h2 className={styles.bentoTitle}>About Me</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '24px' }}>
            I am a passionate software engineer specializing in modern React frameworks, scalable backend architectures, and stunning UI/UX design. My approach is rooted in the belief that great software is a perfect blend of high-performance engineering and beautiful aesthetics.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            When I'm not writing code or managing deployments, I'm constantly exploring new technologies, refining my design skills, and striving to build the best possible digital products.
          </p>
        </StaggerItem>

        {/* Skills Section - Spans 2 cols */}
        <StaggerItem className={`${styles.bentoItem} ${styles.span2}`}>
          <h2 className={styles.bentoTitle}>Core Skills</h2>
          <div className={styles.bentoScrollArea} style={{ maxHeight: '300px' }}>
            <div className={styles.skillsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {skills.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{skill.icon} {skill.name}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* Experience & Education - Spans 2 col, Row Span 2 */}
        <StaggerItem className={`${styles.bentoItem} ${styles.span2} ${styles.rowSpan2}`}>
          <h2 className={styles.bentoTitle}>Experience & Education</h2>
          <div className={styles.bentoScrollArea} style={{ maxHeight: '100%' }}>
            <div className={styles.experienceList} style={{ gap: '32px' }}>
              {experiences.map((exp) => (
                <div key={exp.id} className={styles.experienceItem} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border)', marginBottom: '24px' }}>
                  <h3 className={styles.expRole} style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{exp.role}</h3>
                  <div className={styles.expCompany} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exp.company}</div>
                  <div className={styles.expDate} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                  </div>
                </div>
              ))}
              
              <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '16px 0 32px' }} />

              {education.map((edu) => (
                <div key={edu.id} className={styles.experienceItem} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border)', marginBottom: '24px' }}>
                  <h3 className={styles.expRole} style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{edu.degree}</h3>
                  <div className={styles.expCompany} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{edu.institution}</div>
                  {edu.faculty && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontStyle: 'italic', marginTop: '2px', opacity: 0.85 }}>
                      🏛️ {edu.faculty}
                    </div>
                  )}
                  <div className={styles.expDate} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Class of {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* Projects Section - Spans 2 cols, Row Span 2 */}
        <StaggerItem id="projects" className={`${styles.bentoItem} ${styles.span2} ${styles.rowSpan2}`}>
          <h2 className={styles.bentoTitle}>Featured Projects</h2>
          <div className={styles.bentoScrollArea} style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard} style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                <div className={styles.projectImageContainer} style={{ height: '200px', position: 'relative' }}>
                  {project.imageUrl ? (
                    <Image src={project.imageUrl} alt={project.title} fill className={styles.projectImage} style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <div className={styles.projectImage} style={{ width: '100%', height: '100%', backgroundColor: 'var(--border)' }} />
                  )}
                </div>
                <div className={styles.projectContent} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <h3 className={styles.projectTitle} style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{project.title}</h3>
                  <div className={styles.projectDesc} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <ReactMarkdown>{project.description}</ReactMarkdown>
                  </div>
                  <div className={styles.projectLinks} style={{ display: 'flex', gap: '12px' }}>
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink} style={{ padding: '8px 16px', background: 'var(--text-primary)', color: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Live Demo</a>}
                    {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>GitHub</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StaggerItem>

        {/* Languages & Interests - Spans 4 cols */}
        <StaggerItem className={`${styles.bentoItem} ${styles.span4}`} style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className={styles.bentoTitle}>Languages</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {languages.map((lang) => (
                <div key={lang.id} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{lang.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className={styles.bentoTitle}>Interests</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[...hobbies, ...interests].map((item) => (
                <div key={item.id} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* Contact Section - Spans 4 cols */}
        <StaggerItem id="contact" className={`${styles.bentoItem} ${styles.span4}`} style={{ display: 'flex', flexDirection: 'row', gap: '48px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 className={styles.bentoTitle} style={{ fontSize: '2.5rem' }}>Get In Touch</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
              Interested in working together or have a question? Drop a message and I'll get back to you as soon as possible.
            </p>
            <div className={styles.socialLinks} style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
              <a href="https://github.com/savewaris" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/waris-khamkaweepart/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="LinkedIn"><FaLinkedin /></a>
              <a href="https://www.instagram.com/save.waris/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Instagram"><FaInstagram /></a>
            </div>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <ContactForm />
          </div>
        </StaggerItem>

      </StaggerContainer>
    </div>
  );
}
