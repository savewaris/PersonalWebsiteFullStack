'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FaImages, FaPlay, FaPause } from 'react-icons/fa';
import styles from '@/app/page.module.css';

interface ProjectMediaPreviewProps {
  title: string;
  imageUrl: string | null;
  videoPreviewUrl: string | null;
  galleryImages: string[];
  onOpenGallery: (index?: number) => void;
}

export function ProjectMediaPreview({
  title,
  imageUrl,
  videoPreviewUrl,
  galleryImages,
  onOpenGallery,
}: ProjectMediaPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoPreviewUrl && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play was prevented or interrupted
        });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoPreviewUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const hasGallery = galleryImages.length > 0;
  const allImages = imageUrl ? [imageUrl, ...galleryImages.filter((img) => img !== imageUrl)] : galleryImages;

  return (
    <div
      className={styles.projectImageContainer}
      style={{
        height: '210px',
        position: 'relative',
        cursor: hasGallery || allImages.length > 0 ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (allImages.length > 0) {
          onOpenGallery(0);
        }
      }}
    >
      {/* Video Element (rendered if videoPreviewUrl is available) */}
      {videoPreviewUrl && (
        <video
          ref={videoRef}
          src={videoPreviewUrl}
          muted
          loop
          playsInline
          poster={imageUrl || undefined}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: isPlaying ? 2 : 0,
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Main Poster Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={styles.projectImage}
          style={{
            objectFit: 'cover',
            zIndex: 1,
            transition: 'transform 0.4s ease',
            transform: isHovered && !isPlaying ? 'scale(1.03)' : 'scale(1)',
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div
          className={styles.projectImage}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}
        >
          No Preview Image
        </div>
      )}

      {/* Gallery Count Badge (Top Right) */}
      {allImages.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 4,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaImages />
          <span>{allImages.length} Photos</span>
        </div>
      )}

      {/* Video Hover Indicator Badge (Bottom Left) */}
      {videoPreviewUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            zIndex: 4,
            background: isPlaying ? 'rgba(34, 197, 94, 0.85)' : 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '4px 9px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'background 0.2s',
          }}
        >
          {isPlaying ? <FaPause style={{ fontSize: '0.65rem' }} /> : <FaPlay style={{ fontSize: '0.65rem' }} />}
          <span>{isPlaying ? 'Playing Preview' : 'Hover for Video'}</span>
        </div>
      )}
    </div>
  );
}
