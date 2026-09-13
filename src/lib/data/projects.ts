import { projectRepository } from '@/infrastructure/repositories';
import type { Project } from '@prisma/client';

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await projectRepository.findAll();
    return projects as Project[];
  } catch (error) {
    console.error('[DATA_ERROR:projects]:', error);
    return [];
  }
}
