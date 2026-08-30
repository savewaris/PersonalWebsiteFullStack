import { prisma } from '@/lib/prisma';

export type PortfolioStats = {
  projects: number;
  skills: number;
  experience: number;
};

export async function getStats(): Promise<PortfolioStats> {
  try {
    const [projects, skills, experience] = await Promise.all([
      prisma.project.count().catch(() => 0),
      prisma.skill.count().catch(() => 0),
      prisma.experience.count().catch(() => 0),
    ]);

    return {
      projects: typeof projects === 'number' ? projects : 0,
      skills: typeof skills === 'number' ? skills : 0,
      experience: typeof experience === 'number' ? experience : 0,
    };
  } catch (error) {
    console.error('[DATA_ERROR:stats]:', error);
    return { projects: 0, skills: 0, experience: 0 };
  }
}
