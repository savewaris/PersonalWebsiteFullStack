import type { ProjectEntity } from './project.types';

/**
 * Checks if a given URL points to a GitHub repository.
 */
export function isGithubUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.toLowerCase().includes('github.com');
}

/**
 * Checks whether a project has a genuine, deployed live demo.
 * Strictly blocks GitHub URLs or architecture-only projects from being marked as live demos.
 */
export function hasActiveLiveDemo(project: Pick<ProjectEntity, 'demoUrl' | 'demoType'>): boolean {
  if (!project.demoUrl) return false;
  if (isGithubUrl(project.demoUrl)) return false;
  if (project.demoType === 'architecture' || project.demoType === 'none') return false;
  return true;
}

/**
 * Determines whether a project qualifies as an Architecture Blueprint project
 * (e.g. Hexagonal DDD, Flutter Mobile Clean Architecture, or AI Swarm).
 */
export function isArchitectureProject(project: Pick<ProjectEntity, 'title' | 'tags' | 'demoType' | 'repoUrl'>): boolean {
  if (project.demoType === 'architecture') return true;

  const text = `${project.title} ${project.tags || ''} ${project.repoUrl || ''}`.toLowerCase();
  return (
    text.includes('architecture') ||
    text.includes('nutrin') ||
    text.includes('second-brain') ||
    text.includes('swarm')
  );
}

/**
 * Computes the domain display badge/label for a project.
 */
export function getProjectStatusLabel(
  project: Pick<ProjectEntity, 'title' | 'tags' | 'demoType' | 'demoUrl' | 'repoUrl'>
): string {
  const text = `${project.title} ${project.repoUrl || ''}`.toLowerCase();
  if (text.includes('nutrin')) return 'Mobile Clean Arch';
  if (text.includes('second-brain') || text.includes('agent')) return 'Multi-Agent Swarm';
  if (isArchitectureProject(project)) return 'Clean Code / DDD';
  if (hasActiveLiveDemo(project)) return 'Live on Vercel';
  return 'Open Source';
}

/**
 * Extracts a clean repo slug (e.g. "savewaris/project-name") from a full GitHub URL.
 */
export function getRepoSlug(url?: string | null): string {
  if (!url) return '';
  try {
    const cleaned = url.replace(/\.git\/?$/, '').replace(/\/+$/, '');
    const parts = cleaned.split('/');
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
    }
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}

/**
 * Parses comma-separated tag string into a trimmed, non-empty list of tags.
 */
export function parseProjectTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
