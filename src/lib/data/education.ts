import { prisma } from '@/lib/prisma';
import type { Education } from '@prisma/client';

export async function getEducation(): Promise<Education[]> {
  return await prisma.education.findMany({ orderBy: { startDate: 'desc' } });
}
