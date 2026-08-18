'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { StaggerItem } from '@/components/MotionWrappers';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { ProjectMediaPreview } from '@/components/ProjectMediaPreview';
import { ProjectLightbox } from '@/components/ProjectLightbox';
import { ensureHttps } from '@/lib/url-utils';
import styles from '@/app/page.module.css';
import type { Project } from '@prisma/client';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div style={{ height: '20px', opacity: 0.5 }}>Loading...</div>,
});

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeLightbox, setActiveLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: '',
  });

  const parseGalleryImages = (project: Project): string[] => {
    const images: string[] = [];
    if (project.imageUrl) {
      images.push(project.imageUrl);
    }
    if (project.galleryImages) {
      const parts = project.galleryImages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const part of parts) {
        if (!images.includes(part)) {
          images.push(part);
        }
      }
    }
    return images;
  };

  const handleOpenGallery = (project: Project, initialIndex = 0) => {
    const images = parseGalleryImages(project);
    if (images.length > 0) {
      setActiveLightbox({
        isOpen: true,
        images,
        initialIndex,
        title: project.title,
      });
    }
  };

  return (
    <>
      <StaggerItem id="projects" className={`${styles.bentoItem} ${styles.span2} ${styles.rowSpan2}`}>
        <h2 className={styles.bentoTitle}>Featured Projects</h2>
        <div
          className={styles.bentoScrollArea}
          style={{
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {projects.map((project) => {
            const liveDemoLink = ensureHttps(project.demoUrl);
            const githubRepoLink = ensureHttps(project.repoUrl);
            const galleryImages = project.galleryImages
              ? project.galleryImages
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

            const tags = project.tags
              ? project.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [];

            return (
              <div
                key={project.id}
                className={styles.projectCard}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
              >
                {/* Rich Media Container: Hover-to-Play Video + Poster + Lightbox Click */}
                <ProjectMediaPreview
                  title={project.title}
                  imageUrl={project.imageUrl}
                  videoPreviewUrl={project.videoPreviewUrl}
                  galleryImages={galleryImages}
                  onOpenGallery={(index) => handleOpenGallery(project, index)}
                />

                <div className={styles.projectContent} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <h3 className={styles.projectTitle} style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                    {project.title}
                  </h3>

                  {/* Technology Badges */}
                  {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.projectDesc} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <ReactMarkdown>{project.description}</ReactMarkdown>
                  </div>

                  {/* Standardized Action CTAs */}
                  <div className={styles.projectLinks} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {liveDemoLink && (
                      <a
                        href={liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: 'var(--text-primary)',
                          color: 'var(--bg-primary)',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <PortfolioIcon platform="Web" size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {githubRepoLink && (
                      <a
                        href={githubRepoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <PortfolioIcon platform="GitHub" size={14} />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </StaggerItem>

      {/* Lightbox Screenshot Modal */}
      <ProjectLightbox
        isOpen={activeLightbox.isOpen}
        images={activeLightbox.images}
        initialIndex={activeLightbox.initialIndex}
        title={activeLightbox.title}
        onClose={() => setActiveLightbox((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
