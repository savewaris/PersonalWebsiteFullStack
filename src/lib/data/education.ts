import { prisma } from '@/lib/prisma';
import type { Education } from '@prisma/client';

export async function getEducation(): Promise<Education[]> {
  try {
    return await prisma.education.findMany({ orderBy: { startDate: 'desc' } });
  } catch (error) {
    console.error('[DATA_ERROR:education]:', error);
    return [];
  }
}
