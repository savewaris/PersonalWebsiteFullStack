'use client';

import { useState, useRef } from 'react';
import { FaTimes, FaFileUpload, FaLink, FaCode, FaCheck, FaExclamationTriangle, FaPalette } from 'react-icons/fa';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { LogoPickerModal } from '@/components/admin/LogoPickerModal';
import styles from './CertificationImportModal.module.css';
import adminStyles from '@/components/admin/admin.module.css';

interface ImportItem {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl: string;
  badgeImageUrl?: string | null;
  isDuplicate?: boolean;
  selected?: boolean;
}

interface CertificationImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCertifications?: any[];
  onSuccess?: () => void;
}

export function CertificationImportModal({ isOpen, onClose, onSuccess }: CertificationImportModalProps) {
  const [activeTab, setActiveTab] = useState<'csv' | 'url' | 'json'>('csv');
  const [items, setItems] = useState<ImportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logo Picker state for table rows
  const [editingRowIdx, setEditingRowIdx] = useState<number | null>(null);

  // URL tab form state
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlIssuer, setUrlIssuer] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    try {
      const text = await file.text();
      const payload: any = { mode: 'preview' };

      if (file.name.endsWith('.csv') || file.type.includes('csv')) {
        payload.csvData = text;
      } else if (file.name.endsWith('.json') || file.type.includes('json')) {
        try {
          payload.jsonData = JSON.parse(text);
        } catch {
          throw new Error('Invalid JSON file format');
        }
      } else {
        throw new Error('Please upload a .csv or .json file');
      }

      const res = await fetch('/api/certifications/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }

      const parsed: ImportItem[] = (data.items || []).map((i: any) => ({
        ...i,
        selected: !i.isDuplicate,
      }));
      setItems(parsed);
    } catch (err: any) {
      setError(err.message || 'Error parsing file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleParseUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/certifications/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'preview',
          url: urlInput,
          title: urlTitle,
          issuer: urlIssuer,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse URL');
      }

      const parsed: ImportItem[] = (data.items || []).map((i: any) => ({
        ...i,
        selected: true,
      }));
      setItems((prev) => [...prev, ...parsed]);
      setUrlInput('');
      setUrlTitle('');
      setUrlIssuer('');
    } catch (err: any) {
      setError(err.message || 'Error parsing URL');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const updateItemField = (index: number, field: keyof ImportItem, value: any) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRowLogoSelect = (selected: { name: string; iconKey: string; badgeImageUrl?: string }) => {
    if (editingRowIdx === null) return;
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === editingRowIdx
          ? {
              ...item,
              badgeImageUrl: selected.badgeImageUrl || selected.iconKey,
            }
          : item
      )
    );
    setEditingRowIdx(null);
  };

  const handleCommitImport = async () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      setError('Please select at least one certification to import');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const res = await fetch('/api/certifications/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'commit',
          items: selectedItems,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save imported certifications');
      }

      if (onSuccess) onSuccess();
      window.location.reload();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to complete import');
      setIsImporting(false);
    }
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <FaFileUpload className={styles.headerIcon} />
            <h2>Import LinkedIn & External Certifications</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          {/* Tab Navigation */}
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === 'csv' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('csv')}
            >
              <FaFileUpload style={{ marginRight: '6px' }} />
              Upload LinkedIn CSV / JSON
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === 'url' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('url')}
            >
              <FaLink style={{ marginRight: '6px' }} />
              Add via Credly / Verification URL
            </button>
          </div>

          {/* Tab Content: CSV / JSON */}
          {activeTab === 'csv' && (
            <div className={styles.uploadArea}>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <FaFileUpload className={styles.uploadIcon} />
              <p className={styles.uploadText}>
                Drag and drop your LinkedIn <strong>Certifications.csv</strong> or backup <strong>.json</strong> file
              </p>
              <p className={styles.uploadSubtext}>
                (Obtained from LinkedIn &rarr; Settings & Privacy &rarr; Data Privacy &rarr; Get a copy of your data)
              </p>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className={adminStyles.primaryButton}
                style={{ marginTop: '12px' }}
              >
                {isLoading ? 'Parsing File...' : 'Choose File to Upload'}
              </button>
            </div>
          )}

          {/* Tab Content: URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleParseUrl} className={styles.urlForm}>
              <div className={styles.urlRow}>
                <input
                  type="url"
                  required
                  placeholder="https://www.credly.com/badges/... or https://coursera.org/verify/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={styles.urlInput}
                />
                <button type="submit" disabled={isLoading} className={styles.parseButton}>
                  {isLoading ? 'Parsing...' : 'Add Credential'}
                </button>
              </div>
              <div className={styles.urlRow}>
                <input
                  type="text"
                  placeholder="Optional Title (Auto-detected if blank)"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  className={styles.urlInput}
                />
                <input
                  type="text"
                  placeholder="Optional Authority (e.g. Stanford Online, AWS, Google Cloud)"
                  value={urlIssuer}
                  onChange={(e) => setUrlIssuer(e.target.value)}
                  className={styles.urlInput}
                />
              </div>
            </form>
          )}

          {items.length > 0 && (
            <div className={styles.previewSection}>
              <div className={styles.previewHeader}>
                <div className={styles.previewStats}>
                  <span>Total Parsed: <strong>{items.length}</strong></span>
                  <span>Selected: <strong>{selectedCount}</strong></span>
                  {items.some((i) => i.isDuplicate) && (
                    <span className={styles.badgeDupe}>
                      <FaExclamationTriangle style={{ marginRight: '4px' }} />
                      {items.filter((i) => i.isDuplicate).length} Duplicate(s) Detected
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(true)}
                    className={adminStyles.secondaryButton}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(false)}
                    className={adminStyles.secondaryButton}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Title</th>
                      <th>Issuer</th>
                      <th>Issue Date</th>
                      <th>Logo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className={item.isDuplicate ? styles.rowDuplicate : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={Boolean(item.selected)}
                            onChange={() => toggleSelectItem(idx)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItemField(idx, 'title', e.target.value)}
                            className={styles.rowInput}
                          />
                          {item.isDuplicate && (
                            <span style={{ fontSize: '0.68rem', color: '#f59e0b' }}>
                              ⚠️ Already exists in database
                            </span>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.issuer}
                            onChange={(e) => updateItemField(idx, 'issuer', e.target.value)}
                            className={styles.rowInput}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={item.issueDate}
                            onChange={(e) => updateItemField(idx, 'issueDate', e.target.value)}
                            className={styles.rowInput}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setEditingRowIdx(idx)}
                              title="Pick Logo"
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '4px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              <PortfolioIcon name={item.issuer} icon={item.badgeImageUrl || ''} size={14} />
                            </button>
                            <input
                              type="text"
                              value={item.badgeImageUrl || ''}
                              onChange={(e) => updateItemField(idx, 'badgeImageUrl', e.target.value)}
                              className={styles.rowInput}
                              style={{ width: '80px' }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={adminStyles.secondaryButton}>
            Cancel
          </button>
          <button
            type="button"
            disabled={isImporting || selectedCount === 0}
            onClick={handleCommitImport}
            className={adminStyles.primaryButton}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {isImporting ? (
              'Importing...'
            ) : (
              <>
                <FaCheck />
                <span>Import {selectedCount} Selected Certification(s)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row-level Logo Picker Modal */}
      <LogoPickerModal
        isOpen={editingRowIdx !== null}
        onClose={() => setEditingRowIdx(null)}
        onSelectLogo={handleRowLogoSelect}
        currentIconKey={editingRowIdx !== null ? items[editingRowIdx]?.badgeImageUrl || '' : ''}
      />
    </div>
  );
}
