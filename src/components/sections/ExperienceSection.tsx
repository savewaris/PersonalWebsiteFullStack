import type { Experience } from '@prisma/client';
import styles from './ExperienceEducation.module.css';

interface ExperienceSectionProps {
  experiences: Experience[];
  className?: string;
}

function getEmploymentBadgeClass(type: string): string {
  switch (type.toLowerCase()) {
    case 'internship':
      return styles.badgeInternship;
    case 'contract':
      return styles.badgeContract;
    case 'freelance':
      return styles.badgeFreelance;
    case 'part-time':
      return styles.badgePartTime;
    case 'full-time':
    default:
      return styles.badgeFullTime;
  }
}

function getEmploymentEmoji(type: string): string {
  switch (type.toLowerCase()) {
    case 'internship':
      return '⚡';
    case 'contract':
      return '📄';
    case 'freelance':
      return '🤝';
    case 'part-time':
      return '⏱️';
    case 'full-time':
    default:
      return '💼';
  }
}

function getLocationBadgeClass(type: string): string {
  switch (type.toLowerCase()) {
    case 'remote':
      return styles.badgeRemote;
    case 'hybrid':
      return styles.badgeHybrid;
    case 'onsite':
    case 'on-site':
    default:
      return styles.badgeOnsite;
  }
}

function getLocationEmoji(type: string): string {
  switch (type.toLowerCase()) {
    case 'remote':
      return '🌐';
    case 'hybrid':
      return '🔀';
    case 'onsite':
    case 'on-site':
    default:
      return '🏢';
  }
}

export function ExperienceSection({ experiences, className }: ExperienceSectionProps) {
  return (
    <div className={`${styles.column} ${className || ''}`}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span>💼</span> Work Experience
        </div>
        <span className={styles.columnCountBadge}>{experiences.length} Positions</span>
      </div>

      {experiences.length === 0 ? (
        <div className={styles.emptyState}>No work experience entries recorded yet.</div>
      ) : (
        <div className={styles.timeline}>
          {experiences.map((exp) => {
            const startYear = new Date(exp.startDate).getFullYear();
            const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present';
            const empType = exp.employmentType || 'Full-time';
            const locType = exp.locationType || 'On-site';

            return (
              <div key={exp.id} className={styles.timelineItem}>
                <div className={styles.timelineNode} />
                <div className={styles.timelineCard}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemRole}>{exp.role}</h3>
                    <div className={styles.itemCompany}>
                      <span>{exp.company}</span>
                      {exp.location && <span>• {exp.location}</span>}
                    </div>
                    <div className={styles.itemDate}>
                      {startYear} - {endYear}
                    </div>
                  </div>

                  <div className={styles.badgeRow}>
                    <span className={`${styles.badge} ${getEmploymentBadgeClass(empType)}`}>
                      {getEmploymentEmoji(empType)} {empType}
                    </span>
                    <span className={`${styles.badge} ${getLocationBadgeClass(locType)}`}>
                      {getLocationEmoji(locType)} {locType}
                    </span>
                  </div>

                  {exp.description && (
                    <p className={styles.itemDescription}>{exp.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
