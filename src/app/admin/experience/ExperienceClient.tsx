'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import styles from '@/components/admin/admin.module.css';

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string | null;
  employmentType: string;
  locationType: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
const LOCATION_TYPES = ['On-site', 'Hybrid', 'Remote'];

export default function ExperienceClient({ initialExperience }: { initialExperience: Experience[] }) {
  const {
    items: experiences,
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
  } = useAdminCrud<Experience>(initialExperience, '/api/experience');

  const [formData, setFormData] = useState<Partial<Experience>>({
    role: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    locationType: 'On-site',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleOpenCreate = () => {
    setFormData({
      role: '',
      company: '',
      location: '',
      employmentType: 'Full-time',
      locationType: 'On-site',
      startDate: '',
      endDate: '',
      description: '',
    });
    openCreate();
  };

  const handleOpenEdit = (exp: Experience) => {
    setFormData({
      ...exp,
      employmentType: exp.employmentType || 'Full-time',
      locationType: exp.locationType || 'On-site',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
    });
    openEdit(exp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem({
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Experience Management"
        description="Manage your professional career history, job positions, and achievements."
        count={experiences.length}
        actionLabel="Add Experience"
        onAction={handleOpenCreate}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {experiences.length === 0 ? (
        <div className={styles.emptyState}>No work experience recorded. Click &ldquo;+ Add Experience&rdquo; to add your roles.</div>
      ) : (
        <div className={styles.cardGrid}>
          {experiences.map((exp) => (
            <div key={exp.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{exp.role}</h3>
                  <div className={styles.cardSubtitle}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'rgba(124, 58, 237, 0.15)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                    }}>
                      💼 {exp.employmentType || 'Full-time'}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}>
                      🌐 {exp.locationType || 'On-site'}
                    </span>
                  </div>
                </div>
                <span className={styles.badgeCount}>
                  {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                </span>
              </div>

              <p className={styles.cardDescription}>
                {exp.description}
              </p>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(exp)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(exp)}
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
        title={editingItem ? 'Edit Experience' : 'Add New Experience'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Role / Job Title</label>
              <input
                type="text"
                required
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Company</label>
              <input
                type="text"
                required
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google, TechCorp"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Employment Type</label>
              <select
                value={formData.employmentType || 'Full-time'}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Location Mode</label>
              <select
                value={formData.locationType || 'On-site'}
                onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
              >
                {LOCATION_TYPES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Location (City / Country / Remote)</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bangkok, Thailand"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Date (Leave blank for Present)</label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description &amp; Achievements</label>
            <textarea
              required
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summarize key responsibilities, technologies used, and team achievements..."
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Experience' : 'Create Experience'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem ? `${deletingItem.role} at ${deletingItem.company}` : undefined}
        isDeleting={isSubmitting}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteItem(deletingItem.id)}
      />
    </div>
  );
}
