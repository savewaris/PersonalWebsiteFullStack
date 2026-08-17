import { SocialLink } from '@prisma/client';
import { SocialIcon } from '@/components/SocialIcon';
import styles from './Footer.module.css';

interface FooterProps {
  socials?: SocialLink[];
}

export default function Footer({ socials = [] }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} Waris Khamkaweepart. Built with Next.js, Prisma &amp; PostgreSQL.</p>
        <div className={styles.socials}>
          {socials.length > 0 ? (
            socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={s.platform}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <SocialIcon platform={s.platform} url={s.url} icon={s.icon} size={14} />
                <span>{s.platform}</span>
              </a>
            ))
          ) : (
            <>
              <a href="https://github.com/savewaris" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/waris-khamkaweepart/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/save.waris/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
