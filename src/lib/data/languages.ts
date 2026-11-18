import { prisma } from '@/lib/prisma';
import type { Language } from '@prisma/client';

export async function getLanguages(): Promise<Language[]> {
  try {
    return await prisma.language.findMany({ where: { isVisible: true }, orderBy: [{ order: 'asc' }, { proficiency: 'asc' }] });
  } catch (error) {
    console.error('[DATA_ERROR:languages]:', error);
    return [];
  }
}
