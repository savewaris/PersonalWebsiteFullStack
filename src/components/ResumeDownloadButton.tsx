'use client';

import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { ResumeDownloadModal, type ResumeItem } from './ResumeDownloadModal';
import heroStyles from './sections/HeroSection.module.css';

interface ResumeDownloadButtonProps {
  initialResumes?: ResumeItem[];
}

export function ResumeDownloadButton({ initialResumes = [] }: ResumeDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If exactly 1 resume is available, allow instant 1-click download
  if (initialResumes.length === 1) {
    const single = initialResumes[0];
    return (
      <a
        href={single.fileUrl}
        download={single.fileName}
        className={heroStyles.ctaSecondary}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}
        aria-label={`Download ${single.title} CV`}
      >
        <FaFilePdf size={14} style={{ color: 'var(--accent-primary, #5e6ad2)' }} />
        <span>Download CV</span>
      </a>
    );
  }

  // If 2+ resumes (or fallback 0), provide interactive selector modal
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={heroStyles.ctaSecondary}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
        aria-label="Open resume download dialog"
      >
        <FaFilePdf size={14} style={{ color: 'var(--accent-primary, #5e6ad2)' }} />
        <span>Download CV</span>
      </button>

      <ResumeDownloadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        resumes={initialResumes}
      />
    </>
  );
}
