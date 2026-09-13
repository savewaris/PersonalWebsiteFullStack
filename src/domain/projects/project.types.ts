/**
 * Domain types for Project entities.
 * Decoupled from any web framework or database driver.
 */

export type ProjectDemoType = 'modal' | 'external' | 'architecture' | 'none';

export type ProjectCategory = 'All' | 'Full-Stack' | 'Architecture' | 'Mobile';

export interface ProjectEntity {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoPreviewUrl?: string | null;
  galleryImages?: string | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
  demoType?: string;
  isEmbeddable?: boolean;
  demoNote?: string | null;
  demoCredentials?: string | null;
  tags: string;
  featured?: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectInput = Omit<ProjectEntity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
