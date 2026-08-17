'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { SKILL_SUGGESTIONS } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  icon: string | null;
}

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const {
    items: skills,
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
  } = useAdminCrud<Skill>(initialSkills, '/api/skills');

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    proficiency: 80,
    category: 'Frontend',
    icon: '',
  });

  const handleOpenCreate = () => {
    setFormData({ name: '', proficiency: 80, category: 'Frontend', icon: '' });
    openCreate();
  };

  const handleOpenEdit = (skill: Skill) => {
    setFormData(skill);
    openEdit(skill);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));
  const availableSuggestions = SKILL_SUGGESTIONS.filter((s) => !existingNames.has(s.name.toLowerCase()));

  const handleSelectPreset = (preset: { name: string; category?: string; proficiency?: number; icon?: string | null }) => {
    setFormData({
      name: preset.name,
      proficiency: preset.proficiency || 80,
      category: preset.category || 'General',
      icon: preset.icon || '',
    });
    openCreate();
  };

  return (
    <div>
      <AdminPageHeader
        title="Skills Management"
        description="Manage the technical stack, tools, and proficiencies displayed on your portfolio."
        count={skills.length}
        actionLabel="Add Skill"
        onAction={handleOpenCreate}
      />

      <PresetChips
        title="Suggested Skills (Click to auto-fill)"
        items={availableSuggestions}
        getLabel={(s) => `${s.name} (${s.category})`}
        onSelect={handleSelectPreset}
        allowWebSearch={true}
        searchType="skills"
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {skills.length === 0 ? (
        <div className={styles.emptyState}>No skills added yet. Add your first skill or pick from suggestions above.</div>
      ) : (
        <div className={styles.cardGrid}>
          {skills.map((skill) => (
            <div key={skill.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {skill.icon && <span style={{ marginRight: '8px' }}>{skill.icon}</span>}
                    {skill.name}
                  </h3>
                  <div className={styles.cardSubtitle}>{skill.category}</div>
                </div>
                <span className={styles.badgeCount}>{skill.proficiency}%</span>
              </div>
              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(skill)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(skill)}
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
        title={editingItem ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Skill Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Next.js, TypeScript, PostgreSQL"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <input
                type="text"
                required
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Frontend, Backend, Tools"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Proficiency ({formData.proficiency || 0}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.proficiency || 80}
                onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Icon / Emoji (Optional)</label>
            <input
              type="text"
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g. ⚡, 🚀, or icon identifier"
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Skill' : 'Create Skill'}
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
