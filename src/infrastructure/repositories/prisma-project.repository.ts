import { prisma } from '@/lib/prisma';
import type {
  IProjectRepository,
  ProjectEntity,
  CreateProjectInput,
  UpdateProjectInput,
} from '@/domain/projects';

export class PrismaProjectRepository implements IProjectRepository {
  async findAll(): Promise<ProjectEntity[]> {
    return await prisma.project.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    return await prisma.project.findUnique({
      where: { id },
    });
  }

  async create(data: CreateProjectInput): Promise<ProjectEntity> {
    return await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        videoPreviewUrl: data.videoPreviewUrl,
        galleryImages: data.galleryImages,
        demoUrl: data.demoUrl,
        repoUrl: data.repoUrl,
        tags: data.tags || '',
        demoType: data.demoType || 'modal',
        demoCredentials: data.demoCredentials,
        demoNote: data.demoNote,
        isEmbeddable: data.isEmbeddable ?? true,
        isVisible: data.isVisible ?? true,
        isFeatured: data.isFeatured ?? false,
      },
    });
  }

  async update(id: string, data: UpdateProjectInput): Promise<ProjectEntity> {
    const { tags, ...rest } = data;
    return await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(tags !== undefined ? { tags } : {}),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id },
    });
  }
}

export const projectRepository = new PrismaProjectRepository();
