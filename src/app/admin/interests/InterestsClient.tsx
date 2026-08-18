'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaLayerGroup } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { EmojiPicker } from '@/components/admin/EmojiPicker';
import { INTEREST_SUGGESTIONS, INTEREST_CATEGORIES } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface Interest {
  id: string;
  name: string;
  category: string;
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

  const [formData, setFormData] = useState<Partial<Interest>>({
    name: '',
    category: 'Engineering & Core Tech',
    emoji: '',
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const handleOpenCreate = () => {
    setFormData({ name: '', category: 'Engineering & Core Tech', emoji: '' });
    openCreate();
  };

  const handleOpenEdit = (interest: Interest) => {
    setFormData({
      ...interest,
      category: interest.category || 'Engineering & Core Tech',
    });
    openEdit(interest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  const existingNames = new Set(interests.map((i) => i.name.toLowerCase()));
  const availableSuggestions = INTEREST_SUGGESTIONS.filter((s) => !existingNames.has(s.name.toLowerCase()));

  const handleSelectPreset = async (preset: { name: string; emoji?: string | null; category?: string }) => {
    await saveItem({
      name: preset.name,
      category: preset.category || 'Engineering & Core Tech',
      emoji: preset.emoji || '💡',
    });
  };

  const filteredInterests = selectedCategoryFilter === 'All'
    ? interests
    : interests.filter((i) => (i.category || 'Engineering & Core Tech') === selectedCategoryFilter);

  return (
    <div>
      <AdminPageHeader
        title="Interests Management"
        description="Manage your professional, technical, and creative intellectual interests grouped into structured categories."
        count={interests.length}
        actionLabel="Add Interest"
        onAction={handleOpenCreate}
      />

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {['All', ...INTEREST_CATEGORIES].map((cat) => {
          const isActive = selectedCategoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                background: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#000' : 'var(--text-primary)',
                fontWeight: isActive ? '600' : '400',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <PresetChips
        title="Suggested Interests (Click to instant add with category)"
        items={availableSuggestions}
        getLabel={(s) => `${s.emoji || ''} ${s.name}`}
        onSelect={handleSelectPreset}
        allowWebSearch={true}
        searchType="interests"
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {filteredInterests.length === 0 ? (
        <div className={styles.emptyState}>
          {interests.length === 0
            ? 'No interests added yet. Pick from the suggestions above or click "+ Add Interest".'
            : `No interests in category "${selectedCategoryFilter}".`}
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {filteredInterests.map((interest) => (
            <div key={interest.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{interest.emoji || '💡'}</span>
                  <div>
                    <h3 className={styles.cardTitle}>{interest.name}</h3>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        marginTop: '4px',
                      }}
                    >
                      <FaLayerGroup style={{ marginRight: '4px', fontSize: '0.65rem' }} />
                      {interest.category || 'Engineering & Core Tech'}
                    </span>
                  </div>
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
              placeholder="e.g. AI Agents, Distributed Systems, FinTech"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={formData.category || 'Engineering & Core Tech'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                marginBottom: '8px',
              }}
            >
              {INTEREST_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: '#1e1e24', color: '#fff' }}>
                  {cat}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {INTEREST_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    background: formData.category === cat ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: formData.category === cat ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
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

          <EmojiPicker category="interests" onSelect={(em) => setFormData({ ...formData, emoji: em })} />

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
