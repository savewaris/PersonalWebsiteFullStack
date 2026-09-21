'use client';

import { useState } from 'react';
import {
  FaFilePdf,
  FaTrash,
  FaDownload,
  FaExternalLinkAlt,
  FaStar,
  FaCheck,
  FaTimes,
  FaUpload,
} from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import styles from '@/components/admin/admin.module.css';

export interface SerializedResume {
  id: string;
  title: string;
  roleCategory: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  isPrimary: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ResumesClientProps {
  initialResumes: SerializedResume[];
}

const ROLE_CATEGORIES = [
  { value: 'Full-Stack', label: 'Full-Stack Software Engineer' },
  { value: 'AI Systems', label: 'AI & Autonomous Systems Engineer' },
  { value: 'Frontend', label: 'Frontend & UI/UX Specialist' },
  { value: 'Backend', label: 'Backend & Database Systems' },
  { value: 'General', label: 'General Software Engineer' },
];

function formatBytes(bytes: number | null) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

export default function ResumesClient({ initialResumes }: ResumesClientProps) {
  const {
    items: resumes,
    setItems: setResumes,
    deletingItem,
    setDeletingItem,
    isSubmitting,
    deleteItem,
  } = useAdminCrud<SerializedResume>(initialResumes, '/api/resumes');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload form state (bespoke: multipart file upload, not JSON via useAdminCrud.saveItem)
  const [title, setTitle] = useState('');
  const [roleCategory, setRoleCategory] = useState('Full-Stack');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setRoleCategory('Full-Stack');
    setIsPrimary(false);
    setIsActive(true);
    setSelectedFile(null);
    setModalError(null);
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!selectedFile) {
      setModalError('Please select a PDF resume file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setModalError(`File size exceeds 10MB limit (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB).`);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setModalError('Invalid file type: Only PDF files are supported.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title || selectedFile.name.replace(/\.pdf$/i, ''));
      formData.append('roleCategory', roleCategory);
      formData.append('isPrimary', String(isPrimary));
      formData.append('isActive', String(isActive));

      const res = await fetch('/api/resumes', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to upload resume');
      }

      const created = json.data || json;
      setResumes((prev) => {
        let list = prev;
        if (created.isPrimary) {
          list = list.map((r) => ({ ...r, isPrimary: false }));
        }
        return [created, ...list];
      });

      setIsUploadModalOpen(false);
      resetForm();
    } catch (err: any) {
      setModalError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTogglePrimary = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrimary: true }),
      });
      if (res.ok) {
        setResumes((prev) =>
          prev.map((r) => ({
            ...r,
            isPrimary: r.id === id,
          }))
        );
      }
    } catch (err) {
      console.error('Error toggling primary:', err);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setResumes((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isActive: !currentActive } : r))
        );
      }
    } catch (err) {
      console.error('Error toggling active:', err);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Resume Management"
        description="Upload and organize real PDF resumes for your portfolio and plugin adapter."
        count={resumes.length}
      >
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsUploadModalOpen(true);
          }}
          className={styles.primaryButton}
        >
          + Upload Real Resume
        </button>
      </AdminPageHeader>

      <div className={styles.tableContainer}>
        {resumes.length === 0 ? (
          <div className={styles.emptyState}>
            <FaFilePdf size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No resumes uploaded yet.</p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className={styles.primaryButton}
              style={{ marginTop: '12px' }}
            >
              Upload Your First Resume
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Resume</th>
                <th>Role Specialization</th>
                <th>File</th>
                <th>Primary</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                          flexShrink: 0,
                        }}
                      >
                        <FaFilePdf size={14} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{resume.title}</span>
                    </div>
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
                      {resume.roleCategory}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div>{resume.fileName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatBytes(resume.fileSize)}</div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleTogglePrimary(resume.id)}
                      className={styles.iconButton}
                      style={{ color: resume.isPrimary ? '#4ade80' : undefined }}
                      title={resume.isPrimary ? 'Current primary default' : 'Set as primary default'}
                    >
                      <FaStar size={13} />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(resume.id, resume.isActive)}
                      className={styles.iconButton}
                      style={{ color: resume.isActive ? '#60a5fa' : '#94a3b8' }}
                      title={resume.isActive ? 'Active on homepage' : 'Hidden from homepage'}
                    >
                      {resume.isActive ? <FaCheck size={13} /> : <FaTimes size={13} />}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <a
                        href={resume.fileUrl}
                        download={resume.fileName}
                        className={styles.iconButton}
                        title="Download File"
                      >
                        <FaDownload size={13} />
                      </a>
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconButton}
                        title="Preview in Tab"
                      >
                        <FaExternalLinkAlt size={12} />
                      </a>
                      <button
                        onClick={() => setDeletingItem(resume)}
                        className={`${styles.iconButton} ${styles.dangerButton}`}
                        title="Delete Resume"
                        aria-label="Delete"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      <AdminModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Real Resume PDF"
      >
        <form onSubmit={handleCreateResume} className={styles.form}>
          {modalError && (
            <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '4px' }}>
              <FaTimes style={{ marginRight: '6px' }} /> {modalError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Resume Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full-Stack Software Engineer"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Role Specialization</label>
            <select value={roleCategory} onChange={(e) => setRoleCategory(e.target.value)}>
              {ROLE_CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Select PDF File</label>
            <div
              onClick={() => document.getElementById('resumeFileInput')?.click()}
              style={{
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-tertiary)',
              }}
            >
              <input
                id="resumeFileInput"
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    if (!title) {
                      setTitle(file.name.replace(/\.pdf$/i, ''));
                    }
                  }
                }}
              />
              <FaUpload size={22} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
              {selectedFile ? (
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {formatBytes(selectedFile.size)}
                  </div>
                </div>
              ) : (
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Click to select a PDF resume</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PDF files up to 10MB</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
              <span>Set as primary default resume</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span>Visible on public homepage</span>
            </label>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={() => setIsUploadModalOpen(false)} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isUploading || !selectedFile} className={styles.primaryButton}>
              {isUploading ? 'Uploading...' : 'Save & Publish'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) deleteItem(deletingItem.id);
        }}
        title="Delete Resume"
        itemName={deletingItem ? deletingItem.title : ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
