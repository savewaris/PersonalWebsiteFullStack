'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import styles from '@/components/admin/admin.module.css';

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  faculty: string | null;
  startDate: string;
  endDate: string | null;
  score: string | null;
}

export default function EducationClient({ initialEducation }: { initialEducation: Education[] }) {
  const {
    items: educationList,
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
  } = useAdminCrud<Education>(initialEducation, '/api/education');

  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    faculty: '',
    startDate: '',
    endDate: '',
    score: '',
  });

  const handleOpenCreate = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      faculty: '',
      startDate: '',
      endDate: '',
      score: '',
    });
    openCreate();
  };

  const handleOpenEdit = (edu: Education) => {
    setFormData({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
    });
    openEdit(edu);
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
        title="Education Management"
        description="Manage your degrees, university qualifications, faculty, and academic background."
        count={educationList.length}
        actionLabel="Add Education"
        onAction={handleOpenCreate}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {educationList.length === 0 ? (
        <div className={styles.emptyState}>No education records found. Click &ldquo;+ Add Education&rdquo; to add your academic degrees.</div>
      ) : (
        <div className={styles.cardGrid}>
          {educationList.map((edu) => (
            <div key={edu.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{edu.degree} in {edu.fieldOfStudy}</h3>
                  <div className={styles.cardSubtitle}>{edu.institution}</div>
                  {edu.faculty && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '4px' }}>
                      🏛️ {edu.faculty}
                    </div>
                  )}
                </div>
                <span className={styles.badgeCount}>
                  Class of {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                </span>
              </div>

              {edu.score && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  GPA / Grade: <strong>{edu.score}</strong>
                </div>
              )}

              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(edu)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(edu)}
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
        title={editingItem ? 'Edit Education' : 'Add New Education'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Institution / University</label>
            <input
              type="text"
              required
              value={formData.institution || ''}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. Chulalongkorn University, Stanford University"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Degree</label>
              <input
                type="text"
                required
                value={formData.degree || ''}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. Bachelor of Science, Master"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Field of Study</label>
              <input
                type="text"
                required
                value={formData.fieldOfStudy || ''}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder="e.g. Computer Science, Information Systems"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Faculty (Optional)</label>
              <input
                type="text"
                value={formData.faculty || ''}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                placeholder="e.g. Faculty of ICT / Engineering"
              />
            </div>
            <div className={styles.formGroup}>
              <label>GPA / Grade (Optional)</label>
              <input
                type="text"
                value={formData.score || ''}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="e.g. 3.85 / 4.00, First Class Honours"
              />
            </div>
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
              <label>Graduation / End Date</label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Education' : 'Create Education'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem ? `${deletingItem.degree} at ${deletingItem.institution}` : undefined}
        isDeleting={isSubmitting}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteItem(deletingItem.id)}
      />
    </div>
  );
}
