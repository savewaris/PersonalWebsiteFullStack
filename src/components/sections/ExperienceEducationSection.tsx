import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import expStyles from './ExperienceEducation.module.css';
import type { Experience, Education } from '@prisma/client';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';

interface ExperienceEducationSectionProps {
  experiences: Experience[];
  education: Education[];
}

export function ExperienceEducationSection({ experiences, education }: ExperienceEducationSectionProps) {
  return (
    <StaggerItem id="experience" className={`${styles.bentoItem} ${styles.span4}`}>
      <div className={expStyles.sectionContainer}>
        <div className={expStyles.sectionHeader}>
          <h2 className={expStyles.sectionHeaderTitle}>
            <span>💼</span> Career &amp; Academic Timeline
          </h2>
        </div>

        <div className={expStyles.dualGrid}>
          <ExperienceSection experiences={experiences} />
          <EducationSection education={education} />
        </div>
      </div>
    </StaggerItem>
  );
}
