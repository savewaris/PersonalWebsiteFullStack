'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaGithub, FaVideo, FaImages, FaLock, FaGlobe } from 'react-icons/fa';
import { useAdminCrud, useQuickAddParam } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { StatusToggleButtons } from '@/components/admin/StatusToggleButtons';
import { ProjectFormModal, type ProjectFormData } from './ProjectFormModal';
import styles from '@/components/admin/admin.module.css';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoPreviewUrl: string | null;
  galleryImages: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string;
  demoType?: string;
  demoCredentials?: string | null;
  demoNote?: string | null;
  isEmbeddable?: boolean;
  isVisible: boolean;
  isFeatured: boolean;
}

const DEFAULT_FORM: ProjectFormData = {
  title: '',
  description: '',
  imageUrl: '',
  videoPreviewUrl: '',
  galleryImages: '',
  demoUrl: '',
  repoUrl: '',
  tags: '',
  demoType: 'modal',
  demoCredentials: '',
  demoNote: '',
  isEmbeddable: true,
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const {
    items: projects,
    setItems,
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

  useQuickAddParam(openCreate);

  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM);

  const handleOpenCreate = () => {
    setFormData(DEFAULT_FORM);
    openCreate();
  };

  const handleOpenEdit = (project: Project) => {
    setFormData({
      ...project,
      demoType: project.demoType || 'modal',
      demoCredentials: project.demoCredentials || '',
      demoNote: project.demoNote || '',
      isEmbeddable: project.isEmbeddable ?? true,
    });
    openEdit(project);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData as Partial<Project>);
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects Management"
        description="Manage portfolio projects, live demo sandboxes, guest credentials, videos, and screenshot galleries."
        count={projects.length}
        actionLabel="Add Project"
        onAction={handleOpenCreate}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No projects added yet. Click &ldquo;+ Add Project&rdquo; to showcase your work.</p>
          <button onClick={handleOpenCreate} className={styles.primaryButton} style={{ marginTop: '14px' }}>
            + Add First Project
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Media</th>
                <th>Project Title & Description</th>
                <th>Tech Stack</th>
                <th>Demo & Sandbox</th>
                <th>Links</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const galleryCount = project.galleryImages
                  ? project.galleryImages.split(',').filter((s) => s.trim().length > 0).length
                  : 0;

                return (
                  <tr key={project.id}>
                    <td>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <FaGlobe size={18} color="var(--text-secondary)" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                        {project.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '260px',
                        }}
                        title={project.description}
                      >
                        {project.description}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '220px' }}>
                        {project.tags
                          ? project.tags.split(',').slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid var(--border)',
                                }}
                              >
                                {tag.trim()}
                              </span>
                            ))
                          : '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: project.demoType === 'external' ? '#fbbf24' : '#34d399',
                          }}
                        >
                          <FaLock size={10} />
                          {project.demoType === 'external' ? 'External' : 'Modal Sandbox'}
                        </span>
                        {project.demoCredentials && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            <code>{project.demoCredentials}</code>
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }} title="Open Demo">
                            <FaExternalLinkAlt />
                          </a>
                        )}
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }} title="Open Repo">
                            <FaGithub />
                          </a>
                        )}
                        {project.videoPreviewUrl && (
                          <span title="Video Preview" style={{ color: '#60a5fa' }}><FaVideo /></span>
                        )}
                        {galleryCount > 0 && (
                          <span title={`${galleryCount} Screenshots`} style={{ color: '#c084fc' }}><FaImages /></span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <StatusToggleButtons item={project} endpoint="/api/projects" setItems={setItems} />
                        <button type="button" onClick={() => handleOpenEdit(project)} className={styles.actionBtn} title="Edit Project">
                          <FaEdit />
                        </button>
                        <button type="button" onClick={() => setDeletingItem(project)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Project">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        isEditing={Boolean(editingItem)}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

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
