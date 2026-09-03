'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StaggerItem } from '@/components/MotionWrappers';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { ProjectMediaPreview } from '@/components/ProjectMediaPreview';
import { ProjectLightbox } from '@/components/ProjectLightbox';
import { ensureHttps } from '@/lib/url-utils';
import styles from '@/app/page.module.css';
import projectStyles from './Projects.module.css';
import type { Project } from '@prisma/client';

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
      <StaggerItem id="projects" className={`${styles.bentoItem} ${styles.span4}`}>
        <div className={projectStyles.sectionHeader}>
          <h2 className={projectStyles.sectionTitle}>
            <span>🚀</span> Featured Projects
          </h2>
          <span className={projectStyles.badgeCount}>{projects.length} Projects</span>
        </div>

        <div className={projectStyles.projectsGrid}>
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
              <div key={project.id} className={projectStyles.projectCard}>
                {/* Rich Media Container: Hover-to-Play Video + Poster + Lightbox Click */}
                <ProjectMediaPreview
                  title={project.title}
                  imageUrl={project.imageUrl}
                  videoPreviewUrl={project.videoPreviewUrl}
                  galleryImages={galleryImages}
                  onOpenGallery={(index) => handleOpenGallery(project, index)}
                />

                <div className={projectStyles.projectContent}>
                  <h3 className={projectStyles.projectTitle}>
                    {project.title}
                  </h3>

                  {/* Technology Badges */}
                  {tags.length > 0 && (
                    <div className={projectStyles.tagContainer}>
                      {tags.map((tag, idx) => (
                        <span key={idx} className={projectStyles.tagBadge}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={projectStyles.projectDesc}>
                    <ReactMarkdown>{project.description}</ReactMarkdown>
                  </div>

                  {/* Standardized Action CTAs */}
                  <div className={projectStyles.projectLinks}>
                    {liveDemoLink && (
                      <a
                        href={liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={projectStyles.btnPrimary}
                        data-track-event="project_demo"
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
                        className={projectStyles.btnSecondary}
                        data-track-event="project_repo"
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
