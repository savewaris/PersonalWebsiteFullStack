'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  FaCloudUploadAlt,
  FaFileImage,
  FaFileVideo,
  FaTrash,
  FaSyncAlt,
  FaLink,
  FaExclamationCircle,
  FaTimes,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import styles from './MediaDropzone.module.css';

interface MediaDropzoneProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  mediaType?: 'image' | 'video';
  folder?: string;
  placeholder?: string;
  required?: boolean;
}

export function MediaDropzone({
  label,
  value,
  onChange,
  mediaType = 'image',
  folder = 'projects',
  placeholder = 'https://example.com/media...',
  required = false,
}: MediaDropzoneProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isVideo = mediaType === 'video';
  const acceptTypes = isVideo
    ? 'video/mp4,video/webm,video/quicktime'
    : 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

  const allowedFormatsText = isVideo ? 'MP4, WebM, MOV (Max 50MB)' : 'PNG, JPG, WebP, GIF, SVG (Max 10MB)';

  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to upload media file.');
      }

      const uploadedUrl = json.data?.url || json.url;
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no public URL was returned.');
      }

      onChange(uploadedUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during upload.';
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const triggerBrowse = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>
          {isVideo ? <FaFileVideo /> : <FaFileImage />}
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>

        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FaCloudUploadAlt /> Drop / Upload
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'url' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('url')}
          >
            <FaLink /> URL
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaExclamationCircle /> {error}
          </span>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {activeTab === 'upload' ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes}
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />

          {hasValue ? (
            <div className={styles.previewCard}>
              {isVideo ? (
                <video
                  src={value || ''}
                  controls
                  className={styles.videoPreview}
                  preload="metadata"
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className={styles.imagePreviewWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value || ''} alt={label} className={styles.imagePreview} />
                </div>
              )}

              <div className={styles.previewMeta}>
                <span className={styles.urlText} title={value || ''}>
                  {value}
                </span>

                <div className={styles.previewActions}>
                  {value && (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionSmallBtn}
                      title="Open full size"
                    >
                      <FaExternalLinkAlt size={11} /> Open
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={triggerBrowse}
                    disabled={isUploading}
                    className={styles.actionSmallBtn}
                    title="Replace with another file"
                  >
                    <FaSyncAlt size={11} /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className={`${styles.actionSmallBtn} ${styles.removeBtn}`}
                    title="Remove media"
                  >
                    <FaTrash size={11} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerBrowse}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerBrowse()}
            >
              {isUploading ? (
                <div className={styles.uploadingBox}>
                  <div className={styles.spinner} />
                  <span>Uploading {isVideo ? 'video' : 'image'} to server...</span>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className={styles.dropIcon} />
                  <div className={styles.dropTextPrimary}>
                    Drag and drop your {isVideo ? 'video' : 'image'} here, or{' '}
                    <span style={{ color: 'var(--accent, #60a5fa)', textDecoration: 'underline' }}>
                      browse
                    </span>
                  </div>
                  <div className={styles.dropTextSecondary}>{allowedFormatsText}</div>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div>
          <input
            type="url"
            className={styles.urlInput}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {hasValue && (
            <div style={{ marginTop: '8px' }}>
              {isVideo ? (
                <video
                  src={value || ''}
                  controls
                  className={styles.videoPreview}
                  style={{ maxHeight: '180px' }}
                />
              ) : (
                <div className={styles.imagePreviewWrap} style={{ maxHeight: '140px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value || ''} alt={label} className={styles.imagePreview} style={{ maxHeight: '140px' }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
