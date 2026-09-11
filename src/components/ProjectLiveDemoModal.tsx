'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
  FaLock,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
  FaTimes,
  FaShieldAlt,
} from 'react-icons/fa';
import type { Project } from '@prisma/client';
import styles from './ProjectLiveDemoModal.module.css';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface ProjectLiveDemoModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

export function ProjectLiveDemoModal({ isOpen, project, onClose }: ProjectLiveDemoModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading & copied state when project changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setCopied(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, project?.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !project) return null;

  const demoUrl = project.demoUrl || '';
  const isEmbeddable = project.isEmbeddable ?? true;
  const isExternalOnly = project.demoType === 'external' || !isEmbeddable;

  const handleCopyCredentials = async () => {
    if (!project.demoCredentials) return;
    try {
      await navigator.clipboard.writeText(project.demoCredentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const getFrameClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return styles.frameMobile;
      case 'tablet':
        return styles.frameTablet;
      default:
        return styles.frameDesktop;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} Live Demo Sandbox`}
      >
        <div className={styles.modalContainer}>
          {/* Header Controls */}
          <header className={styles.headerBar}>
            <div className={styles.projectInfo}>
              <h2 className={styles.title}>{project.title}</h2>
              <span className={styles.viewOnlyBadge}>
                <FaLock size={10} /> View-Only Mode
              </span>
            </div>

            {/* Responsive Device Frame Switcher */}
            {!isExternalOnly && (
              <div className={styles.deviceSwitcher} role="group" aria-label="Device Viewport Switcher">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`${styles.deviceBtn} ${deviceMode === 'desktop' ? styles.deviceBtnActive : ''}`}
                  title="Desktop View (100%)"
                >
                  <FaDesktop size={13} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('tablet')}
                  className={`${styles.deviceBtn} ${deviceMode === 'tablet' ? styles.deviceBtnActive : ''}`}
                  title="Tablet View (768px)"
                >
                  <FaTabletAlt size={13} />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`${styles.deviceBtn} ${deviceMode === 'mobile' ? styles.deviceBtnActive : ''}`}
                  title="Mobile View (375px)"
                >
                  <FaMobileAlt size={13} />
                  <span>Mobile</span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actions}>
              {project.demoCredentials && (
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className={`${styles.btnAction} ${copied ? styles.btnCopySuccess : ''}`}
                  title={`Guest Login: ${project.demoCredentials}`}
                >
                  {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                  <span>{copied ? 'Copied Login!' : 'Copy Guest Login'}</span>
                </button>
              )}

              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnAction}
                  title="Open live demo in new window"
                >
                  <FaExternalLinkAlt size={12} />
                  <span>Open New Tab</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className={styles.btnClose}
                aria-label="Close Demo Viewer"
                title="Close (Esc)"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </header>

          {/* Device Frame / Sandboxed Iframe */}
          <main className={styles.viewportArea}>
            {isExternalOnly ? (
              <div className={styles.fallbackCard}>
                <FaShieldAlt size={40} color="var(--accent, #5e6ad2)" style={{ marginBottom: 16 }} />
                <h3>External Guest Demo</h3>
                <p>
                  This project runs on an isolated external domain with custom security policies and is optimized for direct browser window interaction.
                </p>
                {project.demoCredentials && (
                  <p style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: 8 }}>
                    <strong>Guest Login:</strong> <code>{project.demoCredentials}</code>
                  </p>
                )}
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnAction}
                  style={{ display: 'inline-flex', marginTop: 12, padding: '10px 24px', fontSize: '0.95rem' }}
                >
                  <FaExternalLinkAlt size={14} /> Launch Demo in New Tab
                </a>
              </div>
            ) : (
              <div className={`${styles.deviceBezel} ${getFrameClass()}`}>
                {(deviceMode === 'mobile' || deviceMode === 'tablet') && <div className={styles.cameraNotch} />}
                {isLoading && (
                  <div className={styles.loadingOverlay}>
                    <div className={styles.spinner} />
                    <span>Loading View-Only Sandbox...</span>
                  </div>
                )}
                <iframe
                  src={demoUrl}
                  title={`${project.title} Interactive Demo`}
                  className={styles.iframe}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            )}
          </main>

          {/* Footer Disclaimer */}
          <footer className={styles.disclaimerBanner}>
            <FaShieldAlt size={12} color="#34d399" />
            <span>
              {project.demoNote ||
                '🔒 View-Only Mode: Live guest session sandboxed. Database mutations and administrative privileges are disabled.'}
            </span>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
