import styles from '@/app/page.module.css';
import type { Education } from '@prisma/client';

interface EducationSectionProps {
  education: Education[];
  className?: string;
}

export function EducationSection({ education, className }: EducationSectionProps) {
  return (
    <div className={className}>
      <h2 className={styles.bentoTitle}>Education</h2>
      <div className={styles.experienceList} style={{ gap: '24px' }}>
        {education.map((edu) => (
          <div
            key={edu.id}
            className={styles.experienceItem}
            style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border)', marginBottom: '20px' }}
          >
            <h3 className={styles.expRole} style={{ fontSize: '1.05rem', marginBottom: '4px' }}>
              {edu.degree}
            </h3>
            <div className={styles.expCompany} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {edu.institution}
            </div>
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
  );
}
