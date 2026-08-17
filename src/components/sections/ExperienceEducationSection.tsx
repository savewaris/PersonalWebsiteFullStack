import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import { Experience, Education } from '@prisma/client';

interface ExperienceEducationSectionProps {
  experiences: Experience[];
  education: Education[];
}

export function ExperienceEducationSection({ experiences, education }: ExperienceEducationSectionProps) {
  return (
    <StaggerItem id="experience" className={`${styles.bentoItem} ${styles.span2} ${styles.rowSpan2}`}>
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
  );
}
