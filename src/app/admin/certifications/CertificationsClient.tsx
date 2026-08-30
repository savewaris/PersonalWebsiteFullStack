'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaCertificate, FaFileUpload, FaPalette } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { CertificationImportModal } from '@/components/admin/CertificationImportModal';
import { LogoPickerModal } from '@/components/admin/LogoPickerModal';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { resolveCertificationLogo } from '@/lib/resolve-certification-logo';
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
    openCreate,
    openEdit,
    closeModal,
    saveItem,
    deleteItem,
  } = useAdminCrud<CertificationItem>(initialCertifications, '/api/certifications');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);
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

  const handleIssuerChange = (val: string) => {
    const resolved = resolveCertificationLogo({
      issuer: val,
      title: formData.title,
      credentialUrl: formData.credentialUrl,
    });

    setFormData((prev) => ({
      ...prev,
      issuer: val,
      badgeImageUrl: prev.badgeImageUrl && prev.badgeImageUrl !== 'default-cert' && !prev.badgeImageUrl.includes('favicons') ? prev.badgeImageUrl : (resolved.iconKey !== 'default-cert' ? resolved.iconKey : prev.badgeImageUrl),
    }));
  };

  const handleLogoPickerSelect = (selected: { name: string; iconKey: string; badgeImageUrl?: string }) => {
    setFormData((prev) => ({
      ...prev,
      issuer: prev.issuer ? prev.issuer : selected.name,
      badgeImageUrl: selected.badgeImageUrl || selected.iconKey,
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

  const currentResolvedLogo = resolveCertificationLogo({
    issuer: formData.issuer,
    title: formData.title,
    credentialUrl: formData.credentialUrl,
    badgeImageUrl: formData.badgeImageUrl,
  });

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
            <FaFileUpload />
            <span>Import LinkedIn / CSV</span>
          </button>
          <button onClick={handleOpenCreate} className={styles.primaryButton}>
            + Add Certification
          </button>
        </div>
      </AdminPageHeader>

      {/* Certifications Table */}
      <div className={styles.tableContainer}>
        {certifications.length === 0 ? (
          <div className={styles.emptyState}>
            <FaCertificate size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No certifications added yet.</p>
            <button onClick={handleOpenCreate} className={styles.primaryButton} style={{ marginTop: '12px' }}>
              Add Your First Certification
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '45px' }}>Logo</th>
                <th>Certification Title</th>
                <th>Issuing Organization</th>
                <th>Issued</th>
                <th>Expires</th>
                <th>Credential ID</th>
                <th>Verify</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((cert) => {
                const resolved = resolveCertificationLogo({
                  issuer: cert.issuer,
                  title: cert.title,
                  credentialUrl: cert.credentialUrl,
                  badgeImageUrl: cert.badgeImageUrl,
                });
                return (
                  <tr key={cert.id}>
                    <td>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PortfolioIcon
                          name={cert.issuer}
                          icon={resolved.iconKey}
                          url={cert.credentialUrl}
                          size={18}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cert.title}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {cert.issuer}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {cert.expiryDate
                        ? new Date(cert.expiryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : <span style={{ color: 'var(--text-muted)' }}>Never</span>}
                    </td>
                    <td style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {cert.credentialId || '—'}
                    </td>
                    <td>
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--accent)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.82rem',
                          }}
                        >
                          Verify <FaExternalLinkAlt size={10} />
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenEdit(cert)}
                          className={styles.iconButton}
                          title="Edit Certification"
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeletingItem(cert)}
                          className={`${styles.iconButton} ${styles.dangerButton}`}
                          title="Delete Certification"
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Certification' : 'Add Certification'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Quick Preset Buttons */}
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <FaCertificate style={{ color: 'var(--accent)' }} /> Quick Issuer Presets
              </label>
              <button
                type="button"
                onClick={() => setIsLogoPickerOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaPalette size={11} /> Browse 60+ Logos
              </button>
            </div>
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
                onChange={(e) => handleIssuerChange(e.target.value)}
                placeholder="e.g. Stanford Online, Google Cloud, Coursera"
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label>Badge Icon / Custom Image URL</label>
              <button
                type="button"
                onClick={() => setIsLogoPickerOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaPalette size={11} /> Open Logo Picker
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PortfolioIcon
                  name={formData.issuer}
                  icon={currentResolvedLogo.iconKey}
                  url={formData.credentialUrl}
                  size={22}
                />
              </div>
              <input
                type="text"
                value={formData.badgeImageUrl || ''}
                onChange={(e) => setFormData({ ...formData, badgeImageUrl: e.target.value })}
                placeholder="e.g. aws, stanford, coursera, or https://... image URL"
                style={{ flex: 1 }}
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Auto-resolved as: <strong>{currentResolvedLogo.iconKey}</strong> ({currentResolvedLogo.displayName})
            </span>
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

      {/* Visual Logo Picker Modal */}
      <LogoPickerModal
        isOpen={isLogoPickerOpen}
        onClose={() => setIsLogoPickerOpen(false)}
        onSelectLogo={handleLogoPickerSelect}
        currentIconKey={formData.badgeImageUrl || ''}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) deleteItem(deletingItem.id);
        }}
        title="Delete Certification"
        itemName={deletingItem ? `${deletingItem.title} (${deletingItem.issuer})` : ''}
        isDeleting={isSubmitting}
      />

      {/* LinkedIn / CSV Import Modal */}
      <CertificationImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingCertifications={certifications}
      />
    </div>
  );
}
