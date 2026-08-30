'use client';

import { useState, useRef } from 'react';
import { FaTimes, FaFileUpload, FaLink, FaCode, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { PortfolioIcon } from '@/components/PortfolioIcon';
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
  onSuccess: () => void;
}

export function CertificationImportModal({ isOpen, onClose, onSuccess }: CertificationImportModalProps) {
  const [activeTab, setActiveTab] = useState<'csv' | 'url' | 'json'>('csv');
  const [items, setItems] = useState<ImportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      let payload: any = { mode: 'preview' };

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

  const toggleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const toggleSelectItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateItemField = (index: number, field: keyof ImportItem, value: any) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleCommitImport = async () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      setError('Please select at least one certification to import');
      return;
    }

    setError(null);
    setIsImporting(true);

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
        throw new Error(data.error || 'Failed to import certifications');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Import error');
    } finally {
      setIsImporting(false);
    }
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            <FaFileUpload /> Import Certifications & Credentials
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.tabBar}>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === 'csv' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('csv')}
            >
              <FaFileUpload style={{ marginRight: '6px' }} /> LinkedIn CSV Export
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === 'url' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('url')}
            >
              <FaLink style={{ marginRight: '6px' }} /> Credly / Single URL
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === 'json' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('json')}
            >
              <FaCode style={{ marginRight: '6px' }} /> JSON Archive
            </button>
          </div>

          {(activeTab === 'csv' || activeTab === 'json') && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept={activeTab === 'csv' ? '.csv' : '.json'}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div
                className={styles.dropzone}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <FaFileUpload className={styles.dropzoneIcon} />
                <div className={styles.dropzoneText}>
                  {isLoading ? 'Processing file...' : `Click or drag your ${activeTab.toUpperCase()} file here`}
                </div>
                <div className={styles.dropzoneSubtext}>
                  {activeTab === 'csv'
                    ? 'Supports official LinkedIn "Certifications.csv" export'
                    : 'Supports JSON array of certification objects'}
                </div>
              </div>
            </div>
          )}

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
                  placeholder="Optional Authority (e.g. AWS, Google Cloud)"
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
                      <th>Icon Key</th>
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
                            <PortfolioIcon name={item.issuer} icon={item.badgeImageUrl || ''} size={14} />
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

        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={adminStyles.secondaryButton}>
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedCount === 0 || isImporting}
            onClick={handleCommitImport}
            className={adminStyles.primaryButton}
          >
            {isImporting ? 'Importing...' : `Import ${selectedCount} Certification(s)`}
          </button>
        </div>
      </div>
    </div>
  );
}
