'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StaggerItem } from '@/components/MotionWrappers';
import { PortfolioIcon } from '@/components/PortfolioIcon';
import { ProjectMediaPreview } from '@/components/ProjectMediaPreview';
import { ProjectLightbox } from '@/components/ProjectLightbox';
import { ProjectLiveDemoModal } from '@/components/ProjectLiveDemoModal';
import { ArchitectureModal } from '@/components/ArchitectureModal';
import { ensureHttps } from '@/lib/url-utils';
import {
  hasActiveLiveDemo,
  isArchitectureProject,
  getProjectStatusLabel,
  getRepoSlug,
  parseProjectTags,
} from '@/domain/projects';
import { FaProjectDiagram, FaGithub } from 'react-icons/fa';
import styles from '@/app/page.module.css';
import projectStyles from './Projects.module.css';
import type { Project } from '@prisma/client';

interface ProjectsSectionProps {
  projects: Project[];
}

const CATEGORIES = ['All', 'Full-Stack', 'Architecture', 'Mobile'] as const;
type Category = typeof CATEGORIES[number];

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedDemoProject, setSelectedDemoProject] = useState<Project | null>(null);
  const [selectedArchitectureProject, setSelectedArchitectureProject] = useState<Project | null>(null);

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
    if (project.imageUrl) images.push(project.imageUrl);
    if (project.galleryImages) {
      const parts = project.galleryImages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const part of parts) {
        if (!images.includes(part)) images.push(part);
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

  const matchesCategory = (project: Project, category: Category): boolean => {
    if (category === 'All') return true;
    const tagsLower = (project.tags || '').toLowerCase();
    const titleLower = (project.title || '').toLowerCase();

    if (category === 'Full-Stack') {
      return (
        tagsLower.includes('full-stack') ||
        tagsLower.includes('next.js') ||
        tagsLower.includes('react') ||
        tagsLower.includes('node') ||
        titleLower.includes('planner') ||
        titleLower.includes('task') ||
        titleLower.includes('brain')
      );
    }
    if (category === 'Architecture') {
      return (
        tagsLower.includes('architecture') ||
        tagsLower.includes('clean code') ||
        tagsLower.includes('ddd') ||
        project.demoType === 'architecture'
      );
    }
    if (category === 'Mobile') {
      return (
        tagsLower.includes('mobile') ||
        tagsLower.includes('flutter') ||
        tagsLower.includes('dart') ||
        titleLower.includes('nutrin')
      );
    }
    return false;
  };

  const filteredProjects = projects.filter((p) => matchesCategory(p, activeCategory));

  const getCategoryCount = (cat: Category): number => {
    return projects.filter((p) => matchesCategory(p, cat)).length;
  };

  return (
    <>
      <StaggerItem id="projects" className={`${styles.bentoItem} ${styles.span4}`}>
        {/* Section Header */}
        <div className={projectStyles.sectionHeader}>
          <h2 className={projectStyles.sectionTitle}>
            <span>🚀</span> Featured Projects
          </h2>
          <span className={projectStyles.badgeCount}>{projects.length} Showcased</span>
        </div>

        {/* Category Filter Pills */}
        <div className={projectStyles.filterContainer} role="tablist" aria-label="Project Categories">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            if (cat !== 'All' && count === 0) return null;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`${projectStyles.filterPill} ${isActive ? projectStyles.filterPillActive : ''}`}
              >
                <span>{cat}</span>
                <span className={projectStyles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Bento Grid */}
        <div className={projectStyles.projectsGrid}>
          {filteredProjects.map((project) => {
            const hasRealLiveDemo = hasActiveLiveDemo(project);
            const isArchitecture = isArchitectureProject(project);
            const liveDemoLink = hasRealLiveDemo ? ensureHttps(project.demoUrl) : null;
            const githubRepoLink = ensureHttps(project.repoUrl);
            const galleryImages = parseProjectTags(project.galleryImages);
            const tags = parseProjectTags(project.tags);

            const isNutrin = project.title.toLowerCase().includes('nutrin');
            const isSecondBrain =
              project.title.toLowerCase().includes('agent second brain') ||
              (project.repoUrl || '').includes('agent-second-brain');
            const repoSlug = getRepoSlug(project.repoUrl);
            const statusLabel = getProjectStatusLabel(project);

            return (
              <div
                key={project.id}
                className={projectStyles.projectCard}
              >
                {/* Media Preview (Video on Hover + Poster + Gallery) */}
                <ProjectMediaPreview
                  title={project.title}
                  imageUrl={project.imageUrl}
                  videoPreviewUrl={project.videoPreviewUrl}
                  galleryImages={galleryImages}
                  onOpenGallery={(idx) => handleOpenGallery(project, idx)}
                  height="125px"
                />

                <div className={projectStyles.projectContent}>
                  {/* Top Row: Category Tag + View-Only Badge + GitHub Icon Link */}
                  <div className={projectStyles.cardTopRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {isNutrin ? (
                        <span className={projectStyles.catBadgeMobile}>Flutter / Dart</span>
                      ) : isSecondBrain ? (
                        <span className={projectStyles.catBadgeDefault}>Autonomous AI Swarm</span>
                      ) : isArchitecture ? (
                        <span className={projectStyles.catBadgeArchitecture}>Clean Architecture</span>
                      ) : (
                        <span className={projectStyles.catBadgeDefault}>TypeScript</span>
                      )}

                      {hasRealLiveDemo && (
                        <span className={projectStyles.badgeViewOnly} title="Interactive Read-Only View">
                          👁️ View-Only
                        </span>
                      )}
                    </div>

                    {githubRepoLink && (
                      <a
                        href={githubRepoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={projectStyles.topIconLink}
                        title="View on GitHub"
                        aria-label="View on GitHub"
                      >
                        <FaGithub size={15} />
                      </a>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className={projectStyles.projectTitle}>{project.title}</h3>

                  {/* Technology Badges */}
                  <div className={projectStyles.tagContainer}>
                    {tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className={projectStyles.tagBadge}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <div className={projectStyles.projectDesc}>
                    <ReactMarkdown>{project.description}</ReactMarkdown>
                  </div>

                  {/* Card Bottom Meta (Repo slug & Status Indicator) */}
                  <div className={projectStyles.cardFooterMeta}>
                    <span>{repoSlug}</span>
                    <span className={projectStyles.statusIndicator}>{statusLabel}</span>
                  </div>

                  {/* Action CTAs */}
                  <div className={projectStyles.projectLinks}>
                    {isArchitecture ? (
                      <button
                        type="button"
                        onClick={() => setSelectedArchitectureProject(project)}
                        className={projectStyles.btnArchitecture}
                        data-track-event="project_architecture_modal"
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        <FaProjectDiagram size={13} />
                        <span>Architecture</span>
                      </button>
                    ) : hasRealLiveDemo && liveDemoLink ? (
                      project.demoType === 'external' ? (
                        <a
                          href={liveDemoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={projectStyles.btnPrimary}
                          data-track-event="project_demo"
                        >
                          <PortfolioIcon platform="Web" size={13} />
                          <span>Live Demo</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedDemoProject(project)}
                          className={projectStyles.btnPrimary}
                          data-track-event="project_demo_modal"
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          <PortfolioIcon platform="Web" size={13} />
                          <span>Live Demo</span>
                        </button>
                      )
                    ) : null}

                    {githubRepoLink && (
                      <a
                        href={githubRepoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={projectStyles.btnSecondary}
                        data-track-event="project_repo"
                      >
                        <PortfolioIcon platform="GitHub" size={13} />
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

      {/* Interactive Live Demo Modal */}
      <ProjectLiveDemoModal
        isOpen={Boolean(selectedDemoProject)}
        project={selectedDemoProject}
        onClose={() => setSelectedDemoProject(null)}
      />

      {/* Interactive Architecture & DDD Modal */}
      <ArchitectureModal
        isOpen={Boolean(selectedArchitectureProject)}
        project={selectedArchitectureProject}
        onClose={() => setSelectedArchitectureProject(null)}
      />
    </>
  );
}
