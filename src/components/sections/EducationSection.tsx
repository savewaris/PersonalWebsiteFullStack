import type { Education } from '@prisma/client';
import { getSafeYear } from '@/lib/format-utils';
import styles from './ExperienceEducation.module.css';

interface EducationSectionProps {
  education: Education[];
  className?: string;
}

export function EducationSection({ education, className }: EducationSectionProps) {
  return (
    <div className={`${styles.column} ${className || ''}`}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span>🎓</span> Academic Journey
        </div>
        <span className={styles.columnCountBadge}>{education.length} Qualifications</span>
      </div>

      {education.length === 0 ? (
        <div className={styles.emptyState}>No education records recorded yet.</div>
      ) : (
        <div className={styles.timeline}>
          {education.map((edu) => {
            const startYear = getSafeYear(edu.startDate, '2023');
            const endYear = edu.endDate ? getSafeYear(edu.endDate, 'Present') : 'Present';

            return (
              <div key={edu.id} className={styles.timelineItem}>
                <div className={styles.timelineNode} />
                <div className={styles.timelineCard}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemRole}>
                      {edu.degree}
                      {edu.fieldOfStudy && edu.fieldOfStudy !== 'General' ? ` in ${edu.fieldOfStudy}` : ''}
                    </h3>
                    <div className={styles.itemCompany}>
                      <span>{edu.institution}</span>
                    </div>
                    <div className={styles.itemDate}>
                      {startYear} - {endYear}
                    </div>
                  </div>

                  <div className={styles.badgeRow}>
                    {edu.faculty && (
                      <span className={styles.facultyBadge}>
                        🏛️ {edu.faculty}
                      </span>
                    )}
                    {edu.score && (
                      <span className={styles.gpaBadge}>
                        🏆 GPA: {edu.score}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
