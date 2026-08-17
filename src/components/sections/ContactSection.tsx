import dynamic from 'next/dynamic';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { StaggerItem } from '@/components/MotionWrappers';
import styles from '@/app/page.module.css';

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <div style={{ height: '200px', opacity: 0.5, animation: 'pulse 2s infinite' }}>Loading form...</div>,
});

export function ContactSection() {
  return (
    <StaggerItem id="contact" className={`${styles.bentoItem} ${styles.span4}`} style={{ display: 'flex', flexDirection: 'row', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px' }}>
        <h2 className={styles.bentoTitle} style={{ fontSize: '2.5rem' }}>
          Get In Touch
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
          Interested in working together or have a question? Drop a message and I'll get back to you as soon as possible.
        </p>
        <div className={styles.socialLinks} style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
          <a href="https://github.com/savewaris" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/waris-khamkaweepart/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/save.waris/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
      <div style={{ flex: '2 1 400px' }}>
        <ContactForm />
      </div>
    </StaggerItem>
  );
}
