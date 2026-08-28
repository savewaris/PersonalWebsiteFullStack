import { prisma } from '@/lib/prisma';
import type { Hobby } from '@prisma/client';

export async function getHobbies(): Promise<Hobby[]> {
  try {
    return await prisma.hobby.findMany({ orderBy: { createdAt: 'asc' } });
  } catch (error) {
    console.error('[DATA_ERROR:hobbies]:', error);
    return [];
  }
}
