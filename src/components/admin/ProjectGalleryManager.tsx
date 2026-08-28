'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  FaImages,
  FaCloudUploadAlt,
  FaTrash,
  FaGripVertical,
  FaLink,
  FaExclamationCircle,
  FaTimes,
  FaPlus,
} from 'react-icons/fa';
import styles from './MediaDropzone.module.css';

interface ProjectGalleryManagerProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  folder?: string;
}

export function ProjectGalleryManager({
  value,
  onChange,
  folder = 'projects',
}: ProjectGalleryManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Parse comma-separated or JSON list
  const getImagesList = (): string[] => {
    if (!value || typeof value !== 'string') return [];
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // fallback to comma separated
      }
    }

    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const images = getImagesList();

  const updateImagesList = (newImages: string[]) => {
    onChange(newImages.join(', '));
  };

  const uploadBatchFiles = async (files: FileList | File[]) => {
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to upload screenshot images.');
      }

      const uploadedFiles: Array<{ url: string }> = json.data?.files || json.files || [];
      const newUrls = uploadedFiles.map((f) => f.url).filter(Boolean);

      if (newUrls.length === 0) {
        // Check if single response format
        const singleUrl = json.data?.url || json.url;
        if (singleUrl) {
          newUrls.push(singleUrl);
        }
      }

      if (newUrls.length > 0) {
        const updated = [...images, ...newUrls];
        updateImagesList(updated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during gallery upload.';
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadBatchFiles(e.target.files);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadBatchFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const updated = images.filter((_, idx) => idx !== indexToDelete);
    updateImagesList(updated);
  };

  // Drag-and-drop reordering handlers
  const handleItemDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const itemToMove = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, itemToMove);

    setDraggedIndex(index);
    updateImagesList(newImages);
  };

  const handleItemDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDraggedIndex(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>
          <FaImages />
          Screenshot Gallery ({images.length})
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
            <FaLink /> Raw URLs
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
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />

          {/* Upload Dropzone */}
          <div
            className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
            style={{ minHeight: images.length > 0 ? '80px' : '110px', padding: '16px 12px' }}
          >
            {isUploading ? (
              <div className={styles.uploadingBox}>
                <div className={styles.spinner} />
                <span>Uploading screenshots...</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaPlus color="var(--accent, #60a5fa)" />
                  <span className={styles.dropTextPrimary} style={{ fontSize: '0.84rem' }}>
                    Drag & drop screenshots here (or click to browse multiple)
                  </span>
                </div>
                <span className={styles.dropTextSecondary}>PNG, JPG, WebP, GIF (Max 10MB each)</span>
              </>
            )}
          </div>

          {/* Reorderable Gallery Grid */}
          {images.length > 0 && (
            <div className={styles.galleryGrid}>
              {images.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className={`${styles.galleryItem} ${draggedIndex === idx ? styles.galleryItemDragging : ''}`}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, idx)}
                  onDragOver={(e) => handleItemDragOver(e, idx)}
                  onDragEnd={handleItemDragEnd}
                  title="Drag to reorder"
                >
                  <span className={styles.galleryIndexBadge}>#{idx + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className={styles.galleryThumb} />

                  <div className={styles.galleryItemOverlay}>
                    <span className={styles.galleryDragHandle} title="Drag to reorder">
                      <FaGripVertical />
                    </span>
                    <button
                      type="button"
                      className={styles.galleryDeleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(idx);
                      }}
                      title="Delete this screenshot"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <textarea
            rows={3}
            className={styles.urlInput}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/shot1.png, https://example.com/shot2.png"
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Separate multiple image URLs with commas.
          </div>
        </div>
      )}
    </div>
  );
}
