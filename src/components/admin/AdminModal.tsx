'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import type { ModalSize } from '@/config/modal.config';

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: ModalSize;
  children: React.ReactNode;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
}: AdminModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size={size}
    >
      {children}
    </Modal>
  );
}

export default AdminModal;
