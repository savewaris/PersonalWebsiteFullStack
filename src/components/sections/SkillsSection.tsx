import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import { Skill } from '@prisma/client';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <StaggerItem id="skills" className={`${styles.bentoItem} ${styles.span2}`}>
      <h2 className={styles.bentoTitle}>Core Skills</h2>
      <div className={styles.bentoScrollArea} style={{ maxHeight: '300px' }}>
        <div className={styles.skillsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {skills.map((skill) => (
            <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {skill.icon} {skill.name}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${skill.proficiency}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaggerItem>
  );
}
