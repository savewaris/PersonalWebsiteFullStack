import Link from 'next/link';
import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';

export function HeroSection() {
  return (
    <StaggerItem
      className={`${styles.bentoItem} ${styles.span3}`}
      style={{
        minHeight: '400px',
        justifyContent: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: '48px',
      }}
    >
      <h1
        className={styles.heroTitle}
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
        }}
      >
        Full Stack Developer.<br />Building Digital Experiences.
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', marginBottom: '48px' }}>
        I build accessible, pixel-perfect, and performant web applications with a focus on modern architectures.
      </p>
      <div className={styles.heroButtons} style={{ display: 'flex', gap: '16px' }}>
        <Link href="#projects" className={styles.ctaPrimary}>
          View Work
        </Link>
        <Link href="#contact" className={styles.ctaSecondary}>
          Contact Me
        </Link>
      </div>
    </StaggerItem>
  );
}
