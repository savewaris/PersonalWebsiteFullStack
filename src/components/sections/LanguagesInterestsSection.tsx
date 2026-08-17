import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';
import { Language, Hobby, Interest } from '@prisma/client';

interface LanguagesInterestsSectionProps {
  languages: Language[];
  hobbies: Hobby[];
  interests: Interest[];
}

export function LanguagesInterestsSection({ languages, hobbies, interests }: LanguagesInterestsSectionProps) {
  return (
    <StaggerItem className={`${styles.bentoItem} ${styles.span4}`} style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h2 className={styles.bentoTitle}>Languages</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {languages.map((lang) => (
            <div key={lang.id} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{lang.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h2 className={styles.bentoTitle}>Interests</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[...hobbies, ...interests].map((item) => (
            <div key={item.id} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <span>{item.emoji}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </StaggerItem>
  );
}
