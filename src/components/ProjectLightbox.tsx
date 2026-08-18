'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface ProjectLightboxProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

function LightboxModal({
  images,
  initialIndex = 0,
  title,
  onClose,
}: {
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} Screenshot Lightbox` : 'Project Screenshots'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {title && <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{title}</h4>}
          <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Lightbox"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s',
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Screenshot"
            style={{
              position: 'absolute',
              left: '12px',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'background 0.2s',
            }}
          >
            <FaChevronLeft />
          </button>
        )}

        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={currentImage}
            alt={title ? `${title} Screenshot ${currentIndex + 1}` : 'Project Screenshot'}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 1200px) 100vw, 1100px"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Screenshot"
            style={{
              position: 'absolute',
              right: '12px',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'background 0.2s',
            }}
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            display: 'flex',
            gap: '10px',
            maxWidth: '90vw',
            overflowX: 'auto',
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                style={{
                  position: 'relative',
                  width: '60px',
                  height: '40px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.2)',
                  opacity: isSelected ? 1 : 0.6,
                  cursor: 'pointer',
                  padding: 0,
                  background: 'transparent',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="60px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProjectLightbox({
  isOpen,
  images,
  initialIndex = 0,
  title,
  onClose,
}: ProjectLightboxProps) {
  if (!isOpen || images.length === 0) return null;

  return (
    <LightboxModal
      key={`${title || 'lightbox'}-${initialIndex}`}
      images={images}
      initialIndex={initialIndex}
      title={title}
      onClose={onClose}
    />
  );
}
