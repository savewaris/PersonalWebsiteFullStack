'use client';

import { AdminModal } from '@/components/admin/AdminModal';
import { MediaDropzone } from '@/components/admin/MediaDropzone';
import { ProjectGalleryManager } from '@/components/admin/ProjectGalleryManager';
import styles from '@/components/admin/admin.module.css';

export interface ProjectFormData {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string | null;
  videoPreviewUrl?: string | null;
  galleryImages?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  tags?: string;
  demoType?: string;
  demoCredentials?: string | null;
  demoNote?: string | null;
  isEmbeddable?: boolean;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  formData: ProjectFormData;
  onChange: (data: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProjectFormModal({
  isOpen,
  isSubmitting,
  isEditing,
  formData,
  onChange,
  onSubmit,
  onClose,
}: ProjectFormModalProps) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Add New Project'}
    >
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Project Title</label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            placeholder="e.g. AI Portfolio Platform"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description (Markdown supported)</label>
          <textarea
            required
            rows={4}
            value={formData.description || ''}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            placeholder="Detailed description of features, tech stack, and impact..."
          />
        </div>

        <div className={styles.formGroup}>
          <MediaDropzone
            label="Cover / Poster Image"
            value={formData.imageUrl || ''}
            onChange={(url) => onChange({ ...formData, imageUrl: url })}
            mediaType="image"
            placeholder="https://example.com/cover.png"
          />
        </div>

        <div className={styles.formGroup}>
          <MediaDropzone
            label="Video Preview (MP4 / WebM / MOV)"
            value={formData.videoPreviewUrl || ''}
            onChange={(url) => onChange({ ...formData, videoPreviewUrl: url })}
            mediaType="video"
            placeholder="https://example.com/demo.mp4"
          />
        </div>

        <div className={styles.formGroup}>
          <ProjectGalleryManager
            value={formData.galleryImages || ''}
            onChange={(val) => onChange({ ...formData, galleryImages: val })}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Demo URL (HTTPS enforced)</label>
            <input
              type="url"
              value={formData.demoUrl || ''}
              onChange={(e) => onChange({ ...formData, demoUrl: e.target.value })}
              placeholder="https://myproject.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label>GitHub / Repo URL</label>
            <input
              type="url"
              value={formData.repoUrl || ''}
              onChange={(e) => onChange({ ...formData, repoUrl: e.target.value })}
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>

        {/* View-Only Demo & Sandbox Configuration */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔒</span> View-Only Demo & Sandbox Settings
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Demo Mode Type</label>
              <select
                value={formData.demoType || 'modal'}
                onChange={(e) => onChange({ ...formData, demoType: e.target.value })}
              >
                <option value="modal">In-Portfolio Modal Sandbox</option>
                <option value="external">Direct External Window</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Embeddable in Iframe?</label>
              <select
                value={formData.isEmbeddable ? 'true' : 'false'}
                onChange={(e) => onChange({ ...formData, isEmbeddable: e.target.value === 'true' })}
              >
                <option value="true">Yes (Permits Frame Sandbox)</option>
                <option value="false">No (Blocks Frame / External Fallback)</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Guest Demo Credentials (Optional)</label>
              <input
                type="text"
                value={formData.demoCredentials || ''}
                onChange={(e) => onChange({ ...formData, demoCredentials: e.target.value })}
                placeholder="e.g. demo@example.com / demo123"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Demo Instructions / Note</label>
              <input
                type="text"
                value={formData.demoNote || ''}
                onChange={(e) => onChange({ ...formData, demoNote: e.target.value })}
                placeholder="e.g. Read-only guest session. Mutations disabled."
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Tags (Comma separated)</label>
          <input
            type="text"
            value={formData.tags || ''}
            onChange={(e) => onChange({ ...formData, tags: e.target.value })}
            placeholder="React, Next.js, PostgreSQL, TypeScript"
          />
        </div>

        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.secondaryButton}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
