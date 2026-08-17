import dynamic from 'next/dynamic';
import Image from 'next/image';
import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import { Project } from '@prisma/client';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div style={{ height: '20px', opacity: 0.5, animation: 'pulse 2s infinite' }}>Loading...</div>,
});

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
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
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink} style={{ padding: '8px 16px', background: 'var(--text-primary)', color: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </StaggerItem>
  );
}
