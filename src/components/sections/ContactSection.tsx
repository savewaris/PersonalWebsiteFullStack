import dynamic from 'next/dynamic';
import { StaggerItem } from '@/components/MotionWrappers';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import styles from '@/app/page.module.css';
import { SocialLink } from '@prisma/client';

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div style={{ height: '200px', opacity: 0.5, animation: 'pulse 2s infinite' }}>Loading form...</div>,
});

interface ContactSectionProps {
  socials: SocialLink[];
}

export function ContactSection({ socials }: ContactSectionProps) {
  return (
    <StaggerItem id="contact" className={`${styles.bentoItem} ${styles.span4}`} style={{ display: 'flex', flexDirection: 'row', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px' }}>
        <h2 className={styles.bentoTitle} style={{ fontSize: '2.5rem' }}>
          Get In Touch
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
          Interested in working together or have a question? Drop a message and I&apos;ll get back to you as soon as possible.
        </p>
        <div className={styles.socialLinks} style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title={social.platform}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease',
              }}
            >
              <PortfolioIcon platform={social.platform} url={social.url} icon={social.icon} size={20} />
            </a>
          ))}
        </div>
      </div>
      <div style={{ flex: '2 1 400px' }}>
        <ContactForm />
      </div>
    </StaggerItem>
  );
}
