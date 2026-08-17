'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import styles from '@/components/admin/admin.module.css';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string;
}

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const {
    items: projects,
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
  } = useAdminCrud<Project>(initialProjects, '/api/projects');

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    imageUrl: '',
    demoUrl: '',
    repoUrl: '',
    tags: '',
  });

  const handleOpenCreate = () => {
    setFormData({ title: '', description: '', imageUrl: '', demoUrl: '', repoUrl: '', tags: '' });
    openCreate();
  };

  const handleOpenEdit = (project: Project) => {
    setFormData(project);
    openEdit(project);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects Management"
        description="Manage the portfolio projects showcasing your work, live demos, and open-source repositories."
        count={projects.length}
        actionLabel="Add Project"
        onAction={handleOpenCreate}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {projects.length === 0 ? (
        <div className={styles.emptyState}>No projects added yet. Click &ldquo;+ Add Project&rdquo; to showcase your work.</div>
      ) : (
        <div className={styles.cardGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  {project.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {project.tags.split(',').map((tag, i) => (
                        <span key={i} className={styles.badgeCount} style={{ fontSize: '0.75rem' }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, maxHeight: '80px', overflow: 'hidden' }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FaGithub /> Repository
                  </a>
                )}
              </div>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(project)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(project)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                >
                  <FaTrash style={{ marginRight: '4px' }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Project Title</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI Portfolio Platform"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description (Markdown supported)</label>
            <textarea
              required
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of features, tech stack, and impact..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/project-screenshot.png"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://myproject.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label>GitHub / Repo URL</label>
              <input
                type="url"
                value={formData.repoUrl || ''}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tags (Comma separated)</label>
            <input
              type="text"
              value={formData.tags || ''}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, Next.js, PostgreSQL, TypeScript"
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem?.title}
        isDeleting={isSubmitting}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteItem(deletingItem.id)}
      />
    </div>
  );
}
