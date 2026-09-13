'use client';

import { useState } from 'react';
import {
  FaFilePdf,
  FaPlus,
  FaTrash,
  FaDownload,
  FaExternalLinkAlt,
  FaStar,
  FaCheck,
  FaTimes,
  FaUpload,
} from 'react-icons/fa';
import { AdminModal } from '@/components/admin/AdminModal';
import styles from './resumes.module.css';

interface SerializedResume {
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

export default function ResumesClient({ initialResumes }: ResumesClientProps) {
  const [resumes, setResumes] = useState<SerializedResume[]>(initialResumes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [roleCategory, setRoleCategory] = useState('Full-Stack');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
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

    setIsSubmitting(true);
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

      setIsModalOpen(false);
      resetForm();
      setBannerSuccess(`Successfully uploaded and published "${created.title}".`);
      setTimeout(() => setBannerSuccess(null), 6000);
    } catch (err: any) {
      setModalError(err.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <FaFilePdf style={{ color: 'var(--accent-primary, #5e6ad2)' }} />
            Resume Management
          </h1>
          <p className={styles.pageSubtitle}>
            Upload and organize real PDF resumes for your portfolio and plugin adapter
          </p>
        </div>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <FaPlus size={13} />
          <span>Upload Real Resume</span>
        </button>
      </div>

      {bannerSuccess && (
        <div className={styles.bannerSuccess}>
          <FaCheck /> {bannerSuccess}
        </div>
      )}

      {bannerError && (
        <div className={styles.bannerError}>
          <FaTimes /> {bannerError}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaFilePdf />
          </div>
          <h3>No resumes uploaded yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Upload your real PDF resume here. It will immediately replace any mockup placeholders.
          </p>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <FaUpload size={13} />
            <span>Upload Your First Resume</span>
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {resumes.map((resume) => (
            <div key={resume.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.fileIconBox}>
                  <FaFilePdf />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.resumeTitle}>{resume.title}</h3>
                  <span className={styles.roleTag}>{resume.roleCategory}</span>
                  {resume.isPrimary && (
                    <span className={styles.primaryBadge}>Primary Default</span>
                  )}
                  <div className={styles.metaText}>
                    {resume.fileName} • {formatBytes(resume.fileSize)}
                  </div>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <div className={styles.leftActions}>
                  <a
                    href={resume.fileUrl}
                    download={resume.fileName}
                    className={styles.actionBtn}
                    title="Download File"
                  >
                    <FaDownload size={11} />
                    <span>Download</span>
                  </a>
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                    title="Preview in Tab"
                  >
                    <FaExternalLinkAlt size={10} />
                    <span>Preview</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleTogglePrimary(resume.id)}
                    className={styles.actionBtn}
                    style={{
                      color: resume.isPrimary ? '#4ade80' : undefined,
                    }}
                    title={resume.isPrimary ? 'Current primary default' : 'Set as primary default'}
                  >
                    <FaStar size={11} />
                    <span>{resume.isPrimary ? 'Primary' : 'Make Primary'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(resume.id, resume.isActive)}
                    className={styles.actionBtn}
                    style={{
                      color: resume.isActive ? '#60a5fa' : '#94a3b8',
                    }}
                    title={resume.isActive ? 'Active on homepage' : 'Hidden from homepage'}
                  >
                    {resume.isActive ? <FaCheck size={11} /> : <FaTimes size={11} />}
                    <span>{resume.isActive ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(resume.id)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="Delete Resume"
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Real Resume PDF"
      >
        <form onSubmit={handleCreateResume}>
          {modalError && (
            <div className={styles.bannerError} style={{ margin: '0 0 16px 0' }}>
              <FaTimes /> {modalError}
            </div>
          )}
          <div className={styles.formGroup}>
            <label className={styles.label}>Resume Title</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Full-Stack Software Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role Specialization</label>
            <select
              className={styles.select}
              value={roleCategory}
              onChange={(e) => setRoleCategory(e.target.value)}
            >
              <option value="Full-Stack">Full-Stack Software Engineer</option>
              <option value="AI Systems">AI & Autonomous Systems Engineer</option>
              <option value="Frontend">Frontend & UI/UX Specialist</option>
              <option value="Backend">Backend & Database Systems</option>
              <option value="General">General Software Engineer</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Select PDF File</label>
            <div
              className={styles.dropzone}
              onClick={() => document.getElementById('resumeFileInput')?.click()}
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
              <FaUpload size={24} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
              {selectedFile ? (
                <div>
                  <strong style={{ color: '#fff' }}>{selectedFile.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {formatBytes(selectedFile.size)}
                  </div>
                </div>
              ) : (
                <div>
                  <strong style={{ color: '#fff' }}>Click to select a PDF resume</strong>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PDF files up to 10MB</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
              <span>Set as primary default resume</span>
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span>Visible on public homepage</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.addBtn}
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? 'Uploading...' : 'Save & Publish'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
