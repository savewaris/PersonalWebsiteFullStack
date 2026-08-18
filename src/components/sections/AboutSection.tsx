import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';

export function AboutSection() {
  return (
    <StaggerItem className={`${styles.bentoItem} ${styles.span2}`}>
      <h2 className={styles.bentoTitle}>About Me</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '24px' }}>
        I am a passionate software engineer specializing in modern React frameworks, scalable backend architectures, and stunning UI/UX design. My approach is rooted in the belief that great software is a perfect blend of high-performance engineering and beautiful aesthetics.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
        When I&apos;m not writing code or managing deployments, I&apos;m constantly exploring new technologies, refining my design skills, and striving to build the best possible digital products.
      </p>
    </StaggerItem>
  );
}
