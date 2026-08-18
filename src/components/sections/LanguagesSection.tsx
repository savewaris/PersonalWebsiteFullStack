import styles from '@/app/page.module.css';
import type { Language } from '@prisma/client';

interface LanguagesSectionProps {
  languages: Language[];
  className?: string;
}

export function LanguagesSection({ languages, className }: LanguagesSectionProps) {
  return (
    <div className={className} style={{ flex: 1, minWidth: '260px' }}>
      <h2 className={styles.bentoTitle}>Languages</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {languages.map((lang) => (
          <div
            key={lang.id}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{lang.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lang.proficiency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
