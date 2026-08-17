'use client';

import { useState } from 'react';
import { FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import styles from '@/components/admin/admin.module.css';

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentReadStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentReadStatus } : m))
        );
      }
    } catch (err: any) {
      setError('Failed to update message status');
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setDeletingMessage(null);
      }
    } catch (err: any) {
      setError('Failed to delete message');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Messages Inbox"
        description="View and manage contact inquiries sent by visitors to your portfolio."
        count={messages.length}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <strong>{unreadCount}</strong> unread message{unreadCount === 1 ? '' : 's'}
      </div>

      {messages.length === 0 ? (
        <div className={styles.emptyState}>No messages in your inbox yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={styles.card}
              style={{
                borderLeft: msg.read ? '1px solid var(--border)' : '4px solid var(--accent)',
                backgroundColor: msg.read ? 'var(--bg-elevated)' : 'rgba(255, 255, 255, 0.04)',
              }}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    style={{ color: 'var(--accent)', fontSize: '0.9rem', textDecoration: 'none' }}
                  >
                    {msg.email}
                  </a>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(msg.createdAt).toLocaleDateString()} at{' '}
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </p>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => handleToggleRead(msg.id, msg.read)}
                  className={styles.actionBtn}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {msg.read ? (
                    <>
                      <FaCheckCircle style={{ color: 'var(--text-secondary)' }} /> Mark Unread
                    </>
                  ) : (
                    <>
                      <FaRegCircle style={{ color: 'var(--accent)' }} /> Mark as Read
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingMessage(msg)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                >
                  <FaTrash style={{ marginRight: '4px' }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMessage)}
        itemName={deletingMessage ? `message from ${deletingMessage.name}` : undefined}
        isDeleting={isProcessing}
        onClose={() => setDeletingMessage(null)}
        onConfirm={() => deletingMessage && handleDelete(deletingMessage.id)}
      />
    </div>
  );
}
