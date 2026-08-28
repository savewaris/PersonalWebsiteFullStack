import { prisma } from '@/lib/prisma';
import type { Project } from '@prisma/client';

export async function getProjects(): Promise<Project[]> {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('[DATA_ERROR:projects]:', error);
    return [];
  }
}
