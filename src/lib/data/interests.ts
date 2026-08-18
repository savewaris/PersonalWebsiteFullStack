import { prisma } from '@/lib/prisma';
import type { Interest } from '@prisma/client';

export async function getInterests(): Promise<Interest[]> {
  return await prisma.interest.findMany({
    orderBy: [
      { category: 'asc' },
      { createdAt: 'asc' },
    ],
  });
}
