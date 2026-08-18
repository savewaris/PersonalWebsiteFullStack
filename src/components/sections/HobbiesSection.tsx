import styles from '@/app/page.module.css';
import type { Hobby } from '@prisma/client';

interface HobbiesSectionProps {
  hobbies: Hobby[];
  className?: string;
}

export function HobbiesSection({ hobbies, className }: HobbiesSectionProps) {
  return (
    <div className={className} style={{ flex: 1, minWidth: '260px' }}>
      <h2 className={styles.bentoTitle}>Hobbies</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {hobbies.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
            }}
          >
            <span>{item.emoji || '🎯'}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
