import { prisma } from '@/lib/prisma';
import type { Language } from '@prisma/client';

export async function getLanguages(): Promise<Language[]> {
  return await prisma.language.findMany({ orderBy: { proficiency: 'asc' } });
}
