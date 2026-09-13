import { StaggerItem } from '@/components/MotionWrappers';
import { FaGithub } from 'react-icons/fa';
import styles from '@/app/page.module.css';
import statsStyles from './StatsSection.module.css';
import type { PortfolioStats } from '@/lib/data';

interface StatsSectionProps {
  stats: PortfolioStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const projectDisplay = stats.projects > 0 ? `${stats.projects}` : '5';

  return (
    <StaggerItem className={`${styles.bentoItem} ${styles.span1} ${statsStyles.statsCard}`}>
      {/* Top Metric: GitHub Impact */}
      <div className={statsStyles.topSection}>
        <span className={statsStyles.labelSmall}>GitHub Impact</span>
        <div className={statsStyles.bigNumber}>30+ Repos</div>
        <span className={statsStyles.subText}>Active Commits & Pipelines</span>
      </div>

      <div className={statsStyles.middleDivider} />

      {/* Secondary Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className={statsStyles.metaRow}>
          <span>Curated Projects</span>
          <span className={statsStyles.metaValue}>{projectDisplay} Showcased</span>
        </div>
        <div className={statsStyles.metaRow}>
          <span>Architecture</span>
          <span className={statsStyles.metaValue}>Hexagonal / DDD</span>
        </div>
        <div className={statsStyles.metaRow}>
          <span>Mobile Stack</span>
          <span className={statsStyles.metaValue}>Flutter & Dart</span>
        </div>
      </div>

      <div className={statsStyles.middleDivider} />

      {/* GitHub Profile Action */}
      <a
        href="https://github.com/savewaris"
        target="_blank"
        rel="noopener noreferrer"
        className={statsStyles.githubButton}
      >
        <FaGithub size={15} />
        <span>@savewaris on GitHub</span>
      </a>
    </StaggerItem>
  );
}
