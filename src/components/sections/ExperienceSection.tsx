import styles from '@/app/page.module.css';
import type { Experience } from '@prisma/client';

interface ExperienceSectionProps {
  experiences: Experience[];
  className?: string;
}

export function ExperienceSection({ experiences, className }: ExperienceSectionProps) {
  return (
    <div className={className}>
      <h2 className={styles.bentoTitle}>Experience</h2>
      <div className={styles.experienceList} style={{ gap: '24px' }}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className={styles.experienceItem}
            style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border)', marginBottom: '20px' }}
          >
            <h3 className={styles.expRole} style={{ fontSize: '1.05rem', marginBottom: '4px' }}>
              {exp.role}
            </h3>
            <div className={styles.expCompany} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {exp.company}
            </div>
            <div className={styles.expDate} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
