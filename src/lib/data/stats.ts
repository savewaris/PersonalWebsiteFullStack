import { prisma } from '@/lib/prisma';

export type PortfolioStats = {
  projects: number;
  skills: number;
  experience: number;
};

export async function getStats(): Promise<PortfolioStats> {
  try {
    const [projects, skills, experience] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
    ]);

    return { projects, skills, experience };
  } catch (error) {
    console.error('[DATA_ERROR:stats]:', error);
    return { projects: 0, skills: 0, experience: 0 };
  }
}
