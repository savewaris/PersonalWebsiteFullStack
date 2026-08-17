import React from 'react';
import { AdminModal } from './AdminModal';
import styles from './admin.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title = 'Confirm Deletion',
  itemName,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Are you sure you want to delete {itemName ? <strong>&ldquo;{itemName}&rdquo;</strong> : 'this item'}? This action
          cannot be undone.
        </p>
        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} disabled={isDeleting} className={styles.secondaryButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={styles.dangerButton}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
