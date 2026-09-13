'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { MODAL_CONFIG, type ModalSize } from '@/config/modal.config';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  size?: ModalSize;
  headerActions?: React.ReactNode;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  showHeader?: boolean;
  className?: string;
  bodyClassName?: string;
  contentStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  headerActions,
  closeOnClickOutside = true,
  showCloseButton = true,
  showHeader = true,
  className = '',
  bodyClassName = '',
  contentStyle,
  bodyStyle,
  children,
  ariaLabel,
}: ModalProps) {
  const sizeConfig = MODAL_CONFIG.sizes[size] || MODAL_CONFIG.sizes.md;
  const theme = MODAL_CONFIG.theme;
  const physics = MODAL_CONFIG.physics;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          style={{
            backdropFilter: `blur(${theme.backdropBlur})`,
            WebkitBackdropFilter: `blur(${theme.backdropBlur})`,
            backgroundColor: theme.backdropBg,
          }}
          initial={physics.overlay.initial}
          animate={physics.overlay.animate}
          exit={physics.overlay.exit}
          transition={physics.overlay.transition}
          onClick={closeOnClickOutside ? onClose : undefined}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : ariaLabel || 'Modal Dialog'}
        >
          <motion.div
            className={`${styles.content} ${className}`}
            style={{
              maxWidth: sizeConfig.maxWidth,
              maxHeight: sizeConfig.maxHeight,
              minHeight: sizeConfig.minHeight,
              borderRadius: sizeConfig.borderRadius,
              backgroundColor: theme.contentBg,
              border: `1px solid ${theme.borderColor}`,
              boxShadow: theme.boxShadow,
              ...contentStyle,
            }}
            initial={physics.content.initial}
            animate={physics.content.animate}
            exit={physics.content.exit}
            transition={physics.content.transition}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {showHeader && (title || showCloseButton || headerActions) && (
              <div
                className={styles.header}
                style={{ borderBottomColor: theme.headerBorderColor }}
              >
                <div className={styles.titleArea}>
                  {icon && <div className={styles.iconBox}>{icon}</div>}
                  {(title || subtitle) && (
                    <div className={styles.titleTextGroup}>
                      {title && <h2 className={styles.title}>{title}</h2>}
                      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                  )}
                </div>

                <div className={styles.headerControls}>
                  {headerActions}
                  {showCloseButton && (
                    <button
                      type="button"
                      className={styles.closeButton}
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            <div
              className={`${styles.body} ${bodyClassName}`}
              style={{ padding: sizeConfig.padding, ...bodyStyle }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
