import { prisma } from '@/lib/prisma';
import type { Experience } from '@prisma/client';

export async function getExperiences(): Promise<Experience[]> {
  return await prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
}
