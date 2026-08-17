'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { INTEREST_SUGGESTIONS } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface Interest {
  id: string;
  name: string;
  emoji: string | null;
}

export default function InterestsClient({ initialInterests }: { initialInterests: Interest[] }) {
  const {
    items: interests,
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
  } = useAdminCrud<Interest>(initialInterests, '/api/interests');

  const [formData, setFormData] = useState<Partial<Interest>>({ name: '', emoji: '' });

  const handleOpenCreate = () => {
    setFormData({ name: '', emoji: '' });
    openCreate();
  };

  const handleOpenEdit = (interest: Interest) => {
    setFormData(interest);
    openEdit(interest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  const existingNames = new Set(interests.map((i) => i.name.toLowerCase()));
  const availableSuggestions = INTEREST_SUGGESTIONS.filter((s) => !existingNames.has(s.name.toLowerCase()));

  const handleSelectPreset = async (preset: (typeof INTEREST_SUGGESTIONS)[0]) => {
    await saveItem({ name: preset.name, emoji: preset.emoji });
  };

  return (
    <div>
      <AdminPageHeader
        title="Interests Management"
        description="Manage your professional, technical, and creative intellectual interests."
        count={interests.length}
        actionLabel="Add Interest"
        onAction={handleOpenCreate}
      />

      <PresetChips
        title="Suggested Interests (Click to instant add)"
        items={availableSuggestions}
        getLabel={(s) => `${s.emoji || ''} ${s.name}`}
        onSelect={handleSelectPreset}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {interests.length === 0 ? (
        <div className={styles.emptyState}>No interests added yet. Pick from the suggestions above or click &ldquo;+ Add Interest&rdquo;.</div>
      ) : (
        <div className={styles.cardGrid}>
          {interests.map((interest) => (
            <div key={interest.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{interest.emoji || '💡'}</span>
                  <h3 className={styles.cardTitle}>{interest.name}</h3>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(interest)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(interest)}
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
        title={editingItem ? 'Edit Interest' : 'Add New Interest'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Interest Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Generative AI, Distributed Systems, Web3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Emoji</label>
            <input
              type="text"
              value={formData.emoji || ''}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              placeholder="e.g. 🤖, ⚡, 🌐"
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Interest' : 'Create Interest'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem?.name}
        isDeleting={isSubmitting}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteItem(deletingItem.id)}
      />
    </div>
  );
}
