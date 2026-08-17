'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { EmojiPicker } from '@/components/admin/EmojiPicker';
import { HOBBY_SUGGESTIONS } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface Hobby {
  id: string;
  name: string;
  emoji: string | null;
}

export default function HobbiesClient({ initialHobbies }: { initialHobbies: Hobby[] }) {
  const {
    items: hobbies,
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
  } = useAdminCrud<Hobby>(initialHobbies, '/api/hobbies');

  const [formData, setFormData] = useState<Partial<Hobby>>({ name: '', emoji: '' });

  const handleOpenCreate = () => {
    setFormData({ name: '', emoji: '' });
    openCreate();
  };

  const handleOpenEdit = (hobby: Hobby) => {
    setFormData(hobby);
    openEdit(hobby);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  const existingNames = new Set(hobbies.map((h) => h.name.toLowerCase()));
  const availableSuggestions = HOBBY_SUGGESTIONS.filter((s) => !existingNames.has(s.name.toLowerCase()));

  const handleSelectPreset = async (preset: { name: string; emoji?: string | null }) => {
    await saveItem({ name: preset.name, emoji: preset.emoji || '✨' });
  };

  return (
    <div>
      <AdminPageHeader
        title="Hobbies Management"
        description="Manage your personal pastimes, activities, and interests outside of work."
        count={hobbies.length}
        actionLabel="Add Hobby"
        onAction={handleOpenCreate}
      />

      <PresetChips
        title="Suggested Hobbies (Click to instant add)"
        items={availableSuggestions}
        getLabel={(s) => `${s.emoji || ''} ${s.name}`}
        onSelect={handleSelectPreset}
        allowWebSearch={true}
        searchType="hobbies"
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {hobbies.length === 0 ? (
        <div className={styles.emptyState}>No hobbies added yet. Pick from the suggestions above or click &ldquo;+ Add Hobby&rdquo;.</div>
      ) : (
        <div className={styles.cardGrid}>
          {hobbies.map((hobby) => (
            <div key={hobby.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{hobby.emoji || '✨'}</span>
                  <h3 className={styles.cardTitle}>{hobby.name}</h3>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(hobby)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(hobby)}
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
        title={editingItem ? 'Edit Hobby' : 'Add New Hobby'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Hobby Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Street Photography, Gaming, Running"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Emoji</label>
            <input
              type="text"
              value={formData.emoji || ''}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              placeholder="e.g. 📸, 🎮, 🏃"
            />
          </div>

          <EmojiPicker category="hobbies" onSelect={(em) => setFormData({ ...formData, emoji: em })} />

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Hobby' : 'Create Hobby'}
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
