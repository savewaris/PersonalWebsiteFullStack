'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAdminCrud, useQuickAddParam } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { EmojiPicker } from '@/components/admin/EmojiPicker';
import { StatusToggleButtons } from '@/components/admin/StatusToggleButtons';
import { SKILL_SUGGESTIONS } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  icon: string | null;
  isVisible: boolean;
  isFeatured: boolean;
}

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const {
    items: skills,
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
  } = useAdminCrud<Skill>(initialSkills, '/api/skills');

  useQuickAddParam(openCreate);

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
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '48px' }}>Icon</th>
                <th>Skill Name</th>
                <th>Category</th>
                <th style={{ width: '180px' }}>Proficiency</th>
                <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PortfolioIcon name={skill.name} icon={skill.icon} category={skill.category} size={18} />
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{skill.name}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {skill.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${skill.proficiency}%`,
                            height: '100%',
                            background: 'var(--accent, #5e6ad2)',
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', minWidth: '32px' }}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <StatusToggleButtons item={skill} endpoint="/api/skills" setItems={setItems} />
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(skill)}
                        className={styles.actionBtn}
                        title="Edit Skill"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(skill)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete Skill"
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
            <label>Icon / Emoji Override (Optional)</label>
            <input
              type="text"
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Leave blank to auto-detect official logo"
            />
          </div>

          <EmojiPicker category="skills" onSelect={(em) => setFormData({ ...formData, icon: em })} />

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
