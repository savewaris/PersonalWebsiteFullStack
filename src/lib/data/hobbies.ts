import { prisma } from '@/lib/prisma';
import type { Hobby } from '@prisma/client';

export async function getHobbies(): Promise<Hobby[]> {
  return await prisma.hobby.findMany({ orderBy: { createdAt: 'asc' } });
}
