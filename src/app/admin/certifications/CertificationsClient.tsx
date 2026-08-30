'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaCertificate, FaFileUpload } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { CertificationImportModal } from '@/components/admin/CertificationImportModal';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import styles from '@/components/admin/admin.module.css';

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string;
  badgeImageUrl: string | null;
  order: number;
}

const ISSUER_PRESETS = [
  { name: 'Amazon Web Services', iconKey: 'aws', label: 'AWS' },
  { name: 'Google Cloud', iconKey: 'gcp', label: 'Google Cloud' },
  { name: 'Microsoft Azure', iconKey: 'azure', label: 'Azure' },
  { name: 'Meta', iconKey: 'meta', label: 'Meta' },
  { name: 'DeepLearning.AI', iconKey: 'deeplearning', label: 'DeepLearning.AI' },
  { name: 'Coursera', iconKey: 'coursera', label: 'Coursera' },
  { name: 'IBM', iconKey: 'ibm', label: 'IBM' },
  { name: 'HashiCorp', iconKey: 'hashicorp', label: 'HashiCorp' },
  { name: 'Oracle', iconKey: 'oracle', label: 'Oracle' },
];

export default function CertificationsClient({
  initialCertifications,
}: {
  initialCertifications: CertificationItem[];
}) {
  const {
    items: certifications,
    isModalOpen,
    editingItem,
    deletingItem,
    setDeletingItem,
    isSubmitting,
    error,
    openCreate,
    openEdit,
    closeModal,
    saveItem,
    deleteItem,
  } = useAdminCrud<CertificationItem>(initialCertifications, '/api/certifications');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CertificationItem>>({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    badgeImageUrl: '',
    order: 0,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      badgeImageUrl: '',
      order: certifications.length,
    });
    openCreate();
  };

  const handleOpenEdit = (cert: CertificationItem) => {
    setFormData({
      ...cert,
      issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
    });
    openEdit(cert);
  };

  const handleSelectPreset = (issuerName: string, iconKey: string) => {
    setFormData((prev) => ({
      ...prev,
      issuer: issuerName,
      badgeImageUrl: iconKey,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem({
      ...formData,
      issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : undefined,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      order: Number(formData.order) || 0,
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Certifications & Credentials"
        description="Manage verified industry certifications, digital badges, and credential verification URLs."
        count={certifications.length}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className={styles.secondaryButton}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FaFileUpload /> Import LinkedIn / CSV
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className={styles.primaryButton}
          >
            + Add Certification
          </button>
        </div>
      </AdminPageHeader>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {certifications.length === 0 ? (
        <div className={styles.emptyState}>
          No certifications recorded yet. Click &ldquo;+ Add Certification&rdquo; to add your credentials.
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {certifications.map((cert) => {
            const issueYear = new Date(cert.issueDate).getFullYear();
            const expiryText = cert.expiryDate
              ? `Expires ${new Date(cert.expiryDate).getFullYear()}`
              : 'No Expiration';

            return (
              <div key={cert.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}>
                        <PortfolioIcon name={cert.issuer} icon={cert.badgeImageUrl} size={16} />
                      </div>
                      <h3 className={styles.cardTitle}>{cert.title}</h3>
                    </div>

                    <div className={styles.cardSubtitle}>{cert.issuer}</div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {cert.credentialId && (
                        <span style={{
                          fontSize: '0.72rem',
                          fontFamily: 'monospace',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }}>
                          ID: {cert.credentialId}
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}>
                        {expiryText}
                      </span>
                    </div>
                  </div>

                  <span className={styles.badgeCount}>
                    {issueYear}
                  </span>
                </div>

                {cert.credentialUrl && (
                  <div style={{ marginTop: '2px' }}>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--accent)',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                      }}
                    >
                      <FaExternalLinkAlt size={10} /> Verify Credential
                    </a>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button type="button" onClick={() => handleOpenEdit(cert)} className={styles.actionBtn}>
                    <FaEdit style={{ marginRight: '4px' }} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(cert)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  >
                    <FaTrash style={{ marginRight: '4px' }} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Certification' : 'Add New Certification'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Quick Preset Buttons */}
          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <FaCertificate style={{ color: 'var(--accent)' }} /> Quick Issuer Presets
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {ISSUER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset.name, preset.iconKey)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    border: formData.issuer === preset.name ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: formData.issuer === preset.name ? 'rgba(124, 58, 237, 0.18)' : 'var(--bg-tertiary)',
                    color: formData.issuer === preset.name ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <PortfolioIcon name={preset.name} icon={preset.iconKey} size={12} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Certification Title</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AWS Certified Solutions Architect - Associate"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Issuing Organization</label>
              <input
                type="text"
                required
                value={formData.issuer || ''}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. Amazon Web Services, Google Cloud"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Issue Date</label>
              <input
                type="date"
                required
                value={formData.issueDate || ''}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Expiration Date (Optional)</label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Credential ID (Optional)</label>
              <input
                type="text"
                value={formData.credentialId || ''}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                placeholder="e.g. AWS-PSA-1234567"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Display Order</label>
              <input
                type="number"
                value={formData.order ?? 0}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Verification URL</label>
            <input
              type="url"
              required
              value={formData.credentialUrl || ''}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              placeholder="https://www.credly.com/badges/... or https://coursera.org/verify/..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Custom Badge Image / Icon Key (Optional)</label>
            <input
              type="text"
              value={formData.badgeImageUrl || ''}
              onChange={(e) => setFormData({ ...formData, badgeImageUrl: e.target.value })}
              placeholder="e.g. aws, gcp, azure, meta, coursera or image URL"
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Certification' : 'Create Certification'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem ? `${deletingItem.title} (${deletingItem.issuer})` : undefined}
        isDeleting={isSubmitting}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteItem(deletingItem.id)}
      />

      {/* Import Modal */}
      <CertificationImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          // Re-fetch or reload window to refresh state
          window.location.reload();
        }}
      />
    </div>
  );
}
