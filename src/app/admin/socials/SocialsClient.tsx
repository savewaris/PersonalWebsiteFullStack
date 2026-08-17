'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { useAdminCrud } from '@/lib/useAdminCrud';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { PresetChips } from '@/components/admin/PresetChips';
import { SocialIcon } from '@/components/SocialIcon';
import { SOCIAL_SUGGESTIONS } from '@/lib/recommendations';
import styles from '@/components/admin/admin.module.css';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  order: number;
}

export default function SocialsClient({ initialSocials }: { initialSocials: SocialLink[] }) {
  const {
    items: socials,
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
  } = useAdminCrud<SocialLink>(initialSocials, '/api/socials');

  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: '',
    url: '',
    icon: '',
    order: socials.length + 1,
  });

  const handleOpenCreate = () => {
    setFormData({ platform: '', url: '', icon: '', order: socials.length + 1 });
    openCreate();
  };

  const handleOpenEdit = (social: SocialLink) => {
    setFormData(social);
    openEdit(social);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
  };

  const existingPlatforms = new Set(socials.map((s) => s.platform.toLowerCase()));
  const availableSuggestions = SOCIAL_SUGGESTIONS.filter((s) => !existingPlatforms.has(s.platform.toLowerCase()));

  const handleSelectPreset = (preset: (typeof SOCIAL_SUGGESTIONS)[0]) => {
    setFormData({
      platform: preset.platform,
      url: preset.placeholderUrl.startsWith('mailto:') ? '' : preset.placeholderUrl,
      icon: '',
      order: socials.length + 1,
    });
    openCreate();
  };

  return (
    <div>
      <AdminPageHeader
        title="Social Links & Contact Channels"
        description="Manage the live contact channels, social media profiles, and communication links shown in your 'Get In Touch' section and footer."
        count={socials.length}
        actionLabel="Add Social Link"
        onAction={handleOpenCreate}
      />

      <PresetChips
        title="Suggested Platforms (Click to configure)"
        items={availableSuggestions}
        getLabel={(s) => `${s.icon} ${s.platform}`}
        onSelect={handleSelectPreset}
        allowWebSearch={false}
      />

      {error && <div className={styles.errorBanner}>{error}</div>}

      {socials.length === 0 ? (
        <div className={styles.emptyState}>No social links added yet. Click &ldquo;+ Add Social Link&rdquo; or pick from suggestions above.</div>
      ) : (
        <div className={styles.cardGrid}>
          {socials.map((social) => (
            <div key={social.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <SocialIcon platform={social.platform} url={social.url} icon={social.icon} />
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{social.platform}</h3>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cardSubtitle}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--accent)' }}
                    >
                      {social.url.replace(/^https?:\/\//, '')} <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                </div>
                <span className={styles.badgeCount}>#{social.order || 1}</span>
              </div>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => handleOpenEdit(social)} className={styles.actionBtn}>
                  <FaEdit style={{ marginRight: '4px' }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(social)}
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
        title={editingItem ? 'Edit Social Link' : 'Add New Social Link'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Platform Name</label>
            <input
              type="text"
              required
              value={formData.platform || ''}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder="e.g. GitHub, LinkedIn, X / Twitter, Discord, Email"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Profile / Channel URL</label>
            <input
              type="text"
              required
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="e.g. https://github.com/username or mailto:you@domain.com"
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Tip: If you omit https://, it will be automatically fulfilled for you.
            </span>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Custom Icon / Emoji (Optional)</label>
              <input
                type="text"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Leave blank to auto-detect icon"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Display Order</label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={closeModal} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.primaryButton}>
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Link' : 'Create Link'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem?.platform}
        isDeleting={isSubmitting}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteItem(deletingItem.id)}
      />
    </div>
  );
}
