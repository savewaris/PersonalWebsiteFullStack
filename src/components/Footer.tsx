import { SocialLink } from '@prisma/client';
import { SocialButton } from '@/components/SocialButton';
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
              <SocialButton
                key={s.id}
                platform={s.platform}
                url={s.url}
                icon={s.icon}
                actionType={s.actionType}
                size={14}
                showPlatformLabel={true}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'inherit',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                }}
              />
            ))
          ) : (
            <>
              <SocialButton platform="GitHub" url="https://github.com/savewaris" size={14} showPlatformLabel={true} />
              <SocialButton platform="LinkedIn" url="https://www.linkedin.com/in/waris-khamkaweepart/" size={14} showPlatformLabel={true} />
              <SocialButton platform="Instagram" url="https://www.instagram.com/save.waris/" size={14} showPlatformLabel={true} />
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
