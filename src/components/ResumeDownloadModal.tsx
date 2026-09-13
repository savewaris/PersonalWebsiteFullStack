'use client';

import React from 'react';
import { FaFilePdf, FaDownload, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { Modal } from '@/components/ui/Modal';
import styles from './ResumeDownloadModal.module.css';

export interface ResumeItem {
  id: string;
  title: string;
  roleCategory: string;
  fileUrl: string;
  fileName: string;
  isPrimary: boolean;
}

interface ResumeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes?: ResumeItem[];
}

export function ResumeDownloadModal({ isOpen, onClose, resumes = [] }: ResumeDownloadModalProps) {
  const displayResumes =
    resumes.length > 0
      ? resumes
      : [
          {
            id: 'default',
            title: 'Full-Stack Software Engineer',
            roleCategory: 'Full-Stack',
            fileUrl: '/resume.pdf',
            fileName: 'resume.pdf',
            isPrimary: true,
          },
        ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download Resume"
      subtitle="Select the version tailored to your engineering requirements"
      icon={<FaFilePdf />}
      size="lg"
      ariaLabel="Download Resume Dialog"
    >
      <div className={styles.body} style={{ padding: 0 }}>
        {displayResumes.map((resume) => (
          <div
            key={resume.id}
            className={`${styles.roleCard} ${
              resume.isPrimary ? styles.roleCardRecommended : ''
            }`}
          >
            <div className={styles.roleDetails}>
              <div className={styles.roleTitleRow}>
                <span className={styles.roleTitle}>{resume.title}</span>
                {resume.isPrimary && <span className={styles.badge}>Primary</span>}
              </div>
              <p className={styles.roleDesc}>{resume.roleCategory} Specialization</p>
            </div>

            <div className={styles.roleActions}>
              <a
                href={resume.fileUrl}
                download={resume.fileName}
                className={styles.downloadBtn}
                aria-label={`Download ${resume.title} PDF resume`}
              >
                <FaDownload size={12} />
                <span>Download</span>
              </a>
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.previewBtn}
                aria-label={`Preview ${resume.title} PDF resume`}
              >
                <FaExternalLinkAlt size={11} />
                <span>Preview</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer} style={{ marginTop: '1.5rem', paddingTop: '1rem' }}>
        <span>
          <FaCheckCircle
            style={{ color: '#22c55e', marginRight: '6px', verticalAlign: '-1px' }}
          />
          Verified PDF format
        </span>
        <span>Available for Hire</span>
      </div>
    </Modal>
  );
}

export default ResumeDownloadModal;
