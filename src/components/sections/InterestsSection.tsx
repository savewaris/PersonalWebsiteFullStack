import styles from '@/app/page.module.css';
import type { Interest } from '@prisma/client';

interface InterestsSectionProps {
  interests: Interest[];
  className?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Engineering & Core Tech': '⚡',
  'Domain & Industry': '🏢',
  'Personal & Disciplines': '🎯',
};

export function InterestsSection({ interests, className }: InterestsSectionProps) {
  // Group interests by category
  const groupedInterests = interests.reduce<Record<string, Interest[]>>((acc, interest) => {
    const category = interest.category || 'Engineering & Core Tech';
    if (!acc[category]) acc[category] = [];
    acc[category].push(interest);
    return acc;
  }, {});

  const categories = Object.keys(groupedInterests);

  return (
    <div className={className} style={{ flex: 1, minWidth: '280px' }}>
      <h2 className={styles.bentoTitle}>Interests & Focus Areas</h2>
      
      {categories.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No interests added yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {categories.map((category) => {
            const items = groupedInterests[category];
            const icon = CATEGORY_ICONS[category] || '💡';

            return (
              <div
                key={category}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  padding: '14px 16px',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  <span>{category}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s ease',
                        cursor: 'default',
                      }}
                    >
                      {item.emoji && <span style={{ fontSize: '0.95rem' }}>{item.emoji}</span>}
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
