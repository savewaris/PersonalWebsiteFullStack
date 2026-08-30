'use client';

import React, { useState, useMemo } from 'react';
import styles from './LogoPickerModal.module.css';
import {
  CERTIFICATION_CATEGORIES,
  CERTIFICATION_LOGOS,
  OrganizationLogoEntry,
} from '@/lib/certification-logos';
import { PortfolioIcon } from '@/components/PortfolioIcon';

interface LogoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLogo: (selected: { name: string; iconKey: string; badgeImageUrl?: string }) => void;
  currentIconKey?: string;
}

export function LogoPickerModal({
  isOpen,
  onClose,
  onSelectLogo,
  currentIconKey,
}: LogoPickerModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');

  const filteredLogos = useMemo(() => {
    return CERTIFICATION_LOGOS.filter((logo) => {
      // Category filter
      if (activeCategory !== 'all' && logo.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = logo.name.toLowerCase().includes(query);
        const matchesKey = logo.iconKey.toLowerCase().includes(query);
        const matchesAlias = logo.aliases.some((a) => a.toLowerCase().includes(query));
        const matchesDomain = logo.domains.some((d) => d.toLowerCase().includes(query));
        return matchesName || matchesKey || matchesAlias || matchesDomain;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (logo: OrganizationLogoEntry) => {
    onSelectLogo({
      name: logo.name,
      iconKey: logo.iconKey,
    });
    onClose();
  };

  const handleApplyCustomDomain = () => {
    if (!customDomain.trim()) return;
    const cleanDomain = customDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const cdnUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
    onSelectLogo({
      name: cleanDomain,
      iconKey: cdnUrl,
      badgeImageUrl: cdnUrl,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>
            <span>🎨</span> Browse Organization & Academy Logos
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Search bar */}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by academy, provider, university (e.g. AWS, Stanford, Coursera)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {CERTIFICATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryTab} ${
                  activeCategory === cat.id ? styles.categoryTabActive : ''
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Logo Grid */}
          <div className={styles.logoGrid}>
            {filteredLogos.map((logo) => {
              const isSelected = currentIconKey?.toLowerCase() === logo.iconKey.toLowerCase();
              return (
                <button
                  key={logo.id}
                  type="button"
                  className={`${styles.logoCard} ${isSelected ? styles.logoCardSelected : ''}`}
                  onClick={() => handleSelect(logo)}
                >
                  <div className={styles.logoIconBox} style={{ borderLeft: `3px solid ${logo.brandColor}` }}>
                    <PortfolioIcon icon={logo.iconKey} name={logo.name} size={18} />
                  </div>
                  <div className={styles.logoInfo}>
                    <span className={styles.logoName} title={logo.name}>
                      {logo.name}
                    </span>
                    <span className={styles.logoCategory}>{logo.category}</span>
                  </div>
                </button>
              );
            })}

            {filteredLogos.length === 0 && (
              <div className={styles.emptyState}>
                <span>🔍</span>
                <p>No predefined logo matched &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Custom Domain / Favicon Fallback Section */}
          <div className={styles.customUrlSection}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              🌐 Or use dynamic Google Favicon CDN for any custom domain:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="e.g. chula.ac.th, hackerearth.com, learn.mongodb.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className={styles.searchInput}
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              />
              <button
                type="button"
                onClick={handleApplyCustomDomain}
                disabled={!customDomain.trim()}
                style={{
                  padding: '0.45rem 0.9rem',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: customDomain.trim() ? 'pointer' : 'not-allowed',
                  opacity: customDomain.trim() ? 1 : 0.6,
                }}
              >
                Apply Domain Favicon
              </button>
            </div>
            {customDomain.trim() && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Preview:</span>
                <PortfolioIcon
                  icon={`https://www.google.com/s2/favicons?domain=${customDomain.trim().toLowerCase()}&sz=128`}
                  size={20}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing {filteredLogos.length} organizations
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.4rem 0.9rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
