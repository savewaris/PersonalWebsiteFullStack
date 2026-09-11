'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { LANGUAGE_SUGGESTIONS } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export default function LanguagesClient({ initialLanguages }: { initialLanguages: Language[] }) {
  const {
    items: languages,
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
  } = useAdminCrud<Language>(initialLanguages, '/api/languages');

  const [formData, setFormData] = useState<Partial<Language>>({ name: '', proficiency: 'Professional Working' });

  const handleOpenCreate = () => {
    setFormData({ name: '', proficiency: 'Professional Working' });
    openCreate();
  };

  const handleOpenEdit = (lang: Language) => {
    setFormData(lang);
    openEdit(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  const existingNames = new Set(languages.map((l) => l.name.toLowerCase()));
  const availableSuggestions = LANGUAGE_SUGGESTIONS.filter((l) => !existingNames.has(l.name.toLowerCase()));

  const handleSelectPreset = async (preset: { name: string; defaultProficiency?: string; proficiency?: string; flag?: string }) => {
    await saveItem({ name: preset.name, proficiency: preset.defaultProficiency || preset.proficiency || 'Professional Working' });
  };

  return (
    <div>
      <AdminPageHeader
        title="Languages Management"
        description="Manage your spoken and written language competencies."
        count={languages.length}
        actionLabel="Add Language"
        onAction={handleOpenCreate}
      />

      <PresetChips
        title="Suggested Languages (Click to instant add)"
        items={availableSuggestions}
        getLabel={(s) => `${s.flag || ''} ${s.name} (${s.defaultProficiency || 'Working'})`}
        onSelect={handleSelectPreset}
        allowWebSearch={true}
        searchType="languages"
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {languages.length === 0 ? (
        <div className={styles.emptyState}>No languages added yet. Pick from the suggestions above or click &ldquo;+ Add Language&rdquo;.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Language</th>
                <th>Proficiency Level</th>
                <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang) => (
                <tr key={lang.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lang.name}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: 'rgba(94, 106, 210, 0.12)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(94, 106, 210, 0.25)',
                        fontWeight: 500,
                      }}
                    >
                      {lang.proficiency}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(lang)}
                        className={styles.actionBtn}
                        title="Edit Language"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(lang)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete Language"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Language' : 'Add New Language'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Language Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. English, Thai, Japanese, Mandarin"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Proficiency</label>
            <select
              value={formData.proficiency || 'Professional Working'}
              onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
            >
              <option value="Native / Bilingual">Native / Bilingual</option>
              <option value="Full Professional">Full Professional</option>
              <option value="Professional Working">Professional Working</option>
              <option value="Limited Working">Limited Working</option>
              <option value="Elementary">Elementary</option>
            </select>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Language' : 'Create Language'}
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
