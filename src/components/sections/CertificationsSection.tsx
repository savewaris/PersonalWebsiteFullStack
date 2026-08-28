import { StaggerItem } from '@/components/MotionWrappers';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { FaExternalLinkAlt } from 'react-icons/fa';
import styles from '@/app/page.module.css';
import certStyles from './Certifications.module.css';
import type { Certification } from '@prisma/client';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <StaggerItem id="certifications" className={`${styles.bentoItem} ${styles.span4}`}>
      <div className={certStyles.sectionHeader}>
        <h2 className={certStyles.sectionTitle}>
          <span>📜</span> Verified Certifications &amp; Credentials
        </h2>
        <span className={styles.badgeCount}>{certifications.length} Credentials</span>
      </div>

      <div className={certStyles.certGrid}>
        {certifications.map((cert) => {
          const issueDateFormatted = new Date(cert.issueDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });

          return (
            <div key={cert.id} className={certStyles.certCard}>
              <div className={certStyles.certHeader}>
                <div className={certStyles.issuerIconWrapper}>
                  <PortfolioIcon name={cert.issuer} icon={cert.badgeImageUrl} size={20} />
                </div>
                <div className={certStyles.certInfo}>
                  <h3 className={certStyles.certTitle}>{cert.title}</h3>
                  <span className={certStyles.certIssuer}>{cert.issuer}</span>
                </div>
              </div>

              <div className={certStyles.certMeta}>
                <div className={certStyles.certBadgeGroup}>
                  <span className={certStyles.dateBadge}>Issued {issueDateFormatted}</span>
                  {cert.credentialId && (
                    <span className={certStyles.credentialIdBadge} title={`Credential ID: ${cert.credentialId}`}>
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={certStyles.verifyBtn}
                  >
                    <span>Verify</span>
                    <FaExternalLinkAlt size={11} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </StaggerItem>
  );
}
