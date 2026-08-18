import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import type { Experience, Education } from '@prisma/client';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';

interface ExperienceEducationSectionProps {
  experiences: Experience[];
  education: Education[];
}

export function ExperienceEducationSection({ experiences, education }: ExperienceEducationSectionProps) {
  return (
    <StaggerItem id="experience" className={`${styles.bentoItem} ${styles.span2} ${styles.rowSpan2}`}>
      <div className={styles.bentoScrollArea} style={{ maxHeight: '100%' }}>
        <ExperienceSection experiences={experiences} />
        <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '24px 0' }} />
        <EducationSection education={education} />
      </div>
    </StaggerItem>
  );
}
