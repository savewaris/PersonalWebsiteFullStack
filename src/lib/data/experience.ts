import { prisma } from '@/lib/prisma';
import type { Experience } from '@prisma/client';

export async function getExperiences(): Promise<Experience[]> {
  try {
    return await prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
  } catch (error) {
    console.error('[DATA_ERROR:experience]:', error);
    return [];
  }
}
