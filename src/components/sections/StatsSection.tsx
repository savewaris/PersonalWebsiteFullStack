import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import { PortfolioStats } from '@/lib/data';

interface StatsSectionProps {
  stats: PortfolioStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <StaggerItem
      className={`${styles.bentoItem} ${styles.span1}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {stats.projects}+
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Projects Shipped
        </span>
      </div>
      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {stats.skills}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Core Technologies
        </span>
      </div>
      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {stats.experience}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Roles Held
        </span>
      </div>
    </StaggerItem>
  );
}
