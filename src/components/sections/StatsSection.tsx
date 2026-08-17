import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import { PortfolioStats } from '@/lib/data';

interface StatsSectionProps {
  stats: PortfolioStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const projectDisplay = stats.projects > 0 ? `${stats.projects}+` : '100%';
  const projectLabel = stats.projects > 0 ? 'Projects Shipped' : 'Production Ready';

  const skillsDisplay = stats.skills > 0 ? `${stats.skills}+` : 'Next.js';
  const skillsLabel = stats.skills > 0 ? 'Core Technologies' : 'Modern Stack';

  const expDisplay = stats.experience > 0 ? `${stats.experience}+` : '24/7';
  const expLabel = stats.experience > 0 ? 'Industry Roles' : 'Cloud Availability';

  return (
    <StaggerItem
      className={`${styles.bentoItem} ${styles.span1}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {projectDisplay}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {projectLabel}
        </span>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {skillsDisplay}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {skillsLabel}
        </span>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {expDisplay}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {expLabel}
        </span>
      </div>
    </StaggerItem>
  );
}
