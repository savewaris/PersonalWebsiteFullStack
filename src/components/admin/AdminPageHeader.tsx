import React from 'react';
import styles from './admin.module.css';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  count,
  actionLabel,
  onAction,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>
          {title}
          {count !== undefined && <span className={styles.badgeCount}>{count}</span>}
        </h1>
        {description && <p className={styles.pageDescription}>{description}</p>}
      </div>
      <div>
        {actionLabel && onAction && (
          <button type="button" onClick={onAction} className={styles.primaryButton}>
            + {actionLabel}
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
