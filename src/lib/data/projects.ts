import { prisma } from '@/lib/prisma';
import type { Project } from '@prisma/client';

export async function getProjects(): Promise<Project[]> {
  return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
}
